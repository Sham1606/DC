from app.models.user import User
from flask_jwt_extended import create_access_token
from datetime import timedelta, datetime
import secrets
from werkzeug.security import generate_password_hash, check_password_hash
from app.services.email_service import send_otp_email
import random


class AuthService:
     @staticmethod
     def register(email, password, name, role):
        if User.find_by_email(email):
            return {'success': False, 'message': 'Email already registered'}, 400
        
        try:
            user = User(email=email, password=password, name=name, role=role)
            user_id = user.save()
            access_token = create_access_token(identity=user_id)
            
            return {
                'success': True,
                'message': 'User registered successfully',
                'access_token': access_token,
                'user': user.to_dict()
            }, 201
        except Exception as e:
            return {'success': False, 'message': str(e)}, 500


     @staticmethod
     def login(email, password):
        user = User.find_by_email(email)
        if not user:
            return {'success': False, 'message': 'User not found'}, 404

        if check_password_hash(user['password_hash'], password):
            access_token = create_access_token(identity=str(user['_id']))
            return {
                'success': True,
                'access_token': access_token,
                'user': {
                    'id': str(user['_id']),
                    'email': user['email'],
                    'name': user['name'],
                    'role': user['role']
                }
            }, 200
        else:
            return {'success': False, 'message': 'Invalid credentials'}, 401
     
     @staticmethod
     def oauth_login_or_register(provider, email, name, oauth_id):
        user = User.find_by_oauth(provider, oauth_id)
        if not user:
            user = User.find_by_email(email)
            if user:
                # Update existing user with OAuth info
                User.update_oauth_info(user['_id'], provider, oauth_id)
            else:
                # Create new user
                user = User(email=email, name=name, password=None, role='user', oauth_provider=provider, oauth_id=oauth_id)
                user_id = user.save()
                user = User.find_by_id(user_id)

        access_token = create_access_token(identity=str(user['_id']))
        return {
            'success': True,
            'access_token': access_token,
            'user': User(email=user['email'], password=None, name=user['name'], role=user['role']).to_dict()
        }, 200

     @staticmethod
     def initiate_password_reset(email):
        user = User.find_by_email(email)
        if user:
            otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
            expiry = datetime.utcnow() + timedelta(minutes=10)
            User.update_reset_token(user['_id'], otp, expiry)
            send_otp_email(email, otp)
            return True
        return False

     @staticmethod
     def verify_otp(email, otp):
        user = User.find_by_email(email)
        if user and user['reset_token'] == otp and user['reset_token_expires'] > datetime.utcnow():
            return True
        return False

     @staticmethod
     def reset_password(email, new_password):
        user = User.find_by_email(email)
        if user:
            User.update_password(user['_id'], new_password)
            User.clear_reset_token(user['_id'])
            return True
        return False


