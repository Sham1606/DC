from flask import Blueprint, request, jsonify, current_app, url_for, redirect, session, abort
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user import User
from app.services.auth_service import AuthService
from app import oauth
import os
from flask import url_for, redirect
import logging
from werkzeug.exceptions import BadRequest

bp = Blueprint('auth', __name__, url_prefix='/api/auth')
auth_service = AuthService()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not all(k in data for k in ['email', 'password', 'name', 'role']):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    result, status_code = auth_service.register(
        email=data['email'],
        password=data['password'],
        name=data['name'],
        role=data['role']
    )
    
    return jsonify(result), status_code

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not all(k in data for k in ['email', 'password']):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    result, status_code = auth_service.login(
        email=data['email'],
        password=data['password']
    )
    return jsonify(result), status_code

@bp.route('/google')
def google_login():
    try:
        redirect_uri = url_for('auth.google_callback', _external=True)
        return oauth.google.authorize_redirect(redirect_uri)
    except Exception as e:
        logger.error(f"Google OAuth initialization error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to initialize Google login'
        }), 500

@bp.route('/google/callback')
def google_callback():
    try:
        token = oauth.google.authorize_access_token()
        user_info = oauth.google.parse_id_token(token)
        
        if not user_info:
            raise BadRequest('Failed to get user info from Google')

        email = user_info.get('email')
        name = user_info.get('name')
        google_id = user_info.get('sub')

        if not all([email, name, google_id]):
            raise BadRequest('Missing required user information')

        user = User.find_by_oauth('google', google_id)
        if not user:
            user = User.find_by_email(email)
            if user:
                User.update_oauth_info(str(user['_id']), 'google', google_id)
            else:
                new_user = User(
                    email=email,
                    name=name,
                    password=None,
                    role='user',
                    oauth_provider='google',
                    oauth_id=google_id
                )
                user_id = new_user.save()
                user = User.find_by_id(user_id)

        access_token = create_access_token(identity=str(user['_id']))
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
        return redirect(f"{frontend_url}/login?token={access_token}")

    except Exception as e:
        logger.error(f"Google OAuth callback error: {str(e)}")
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
        return redirect(f"{frontend_url}/login?error=google_oauth_failed")

@bp.route('/github')
def github_login():
    try:
        redirect_uri = url_for('auth.github_callback', _external=True)
        return oauth.github.authorize_redirect(redirect_uri)
    except Exception as e:
        logger.error(f"GitHub OAuth initialization error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Failed to initialize GitHub login'
        }), 500

@bp.route('/github/callback')
def github_callback():
    try:
        token = oauth.github.authorize_access_token()
        resp = oauth.github.get('user', token=token)
        user_info = resp.json()
        
        email = user_info.get('email')
        if not email:
            emails_resp = oauth.github.get('user/emails', token=token)
            emails = emails_resp.json()
            primary_email = next((e for e in emails if e['primary']), None)
            if primary_email:
                email = primary_email['email']
            else:
                raise BadRequest('No primary email found')

        name = user_info.get('name') or user_info.get('login')
        github_id = str(user_info.get('id'))

        if not all([email, name, github_id]):
            raise BadRequest('Missing required user information')

        user = User.find_by_oauth('github', github_id)
        if not user:
            user = User.find_by_email(email)
            if user:
                User.update_oauth_info(str(user['_id']), 'github', github_id)
            else:
                new_user = User(
                    email=email,
                    name=name,
                    password=None,
                    role='user',
                    oauth_provider='github',
                    oauth_id=github_id
                )
                user_id = new_user.save()
                user = User.find_by_id(user_id)

        access_token = create_access_token(identity=str(user['_id']))
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
        return redirect(f"{frontend_url}/login?token={access_token}")

    except Exception as e:
        logger.error(f"GitHub OAuth callback error: {str(e)}")
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')
        return redirect(f"{frontend_url}/login?error=github_oauth_failed")
@bp.route('/user')
@jwt_required()
def get_user():
    try:
        user_id = get_jwt_identity()
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404

        return jsonify({
            'success': True,
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'name': user['name'],
                'role': user['role']
            }
        })
    except Exception as e:
        logger.error(f"Error fetching user: {str(e)}")
        return jsonify({'message': 'Error fetching user data'}), 500

@bp.route('/reset-password', methods=['POST'])
def reset_password_request():
    email = request.json.get('email')
    if not email:
        return jsonify({"message": "Email is required"}), 400
    
    result = auth_service.initiate_password_reset(email)
    if result:
        return jsonify({"message": "Password reset email sent"}), 200
    else:
        return jsonify({"message": "User not found"}), 404

@bp.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    new_password = request.json.get('new_password')
    if not new_password:
        return jsonify({"message": "New password is required"}), 400
    
    result = auth_service.complete_password_reset(token, new_password)
    if result:
        return jsonify({"message": "Password reset successful"}), 200
    else:
        return jsonify({"message": "Invalid or expired token"}), 400

@bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # Clear any session data
    session.clear()
    return jsonify({'message': 'Successfully logged out'}), 200

