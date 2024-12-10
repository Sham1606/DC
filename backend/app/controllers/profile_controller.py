from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.assessment_service import AssessmentService

bp = Blueprint('profile', __name__, url_prefix='/api/profile')
assessment_service = AssessmentService()

@bp.route('/health', methods=['POST'])
@jwt_required()
def create_health_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    required_fields = ['age', 'gender', 'height', 'weight', 'activity_level']
    if not all(k in data for k in required_fields):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    result, status_code = assessment_service.create_health_profile(user_id, data)
    return jsonify(result), status_code

@bp.route('/health', methods=['GET'])
@jwt_required()
def get_health_profile():
    user_id = get_jwt_identity()
    result, status_code = assessment_service.get_health_profile(user_id)
    return jsonify(result), status_code

@bp.route('/health', methods=['PUT'])
@jwt_required()
def update_health_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    result, status_code = assessment_service.update_health_profile(user_id, data)
    return jsonify(result), status_code

@bp.route('/questionnaire', methods=['GET'])
@jwt_required()
def get_questionnaire():
    result, status_code = assessment_service.generate_questionnaire()
    return jsonify(result), status_code

@bp.route('/questionnaire/analyze', methods=['POST'])
@jwt_required()
def analyze_questionnaire():
    data = request.get_json()
    if not data.get('responses'):
        return jsonify({'success': False, 'message': 'Missing responses'}), 400
    
    result, status_code = assessment_service.analyze_responses(data['responses'])
    return jsonify(result), status_code