from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.meal_planning_service import MealPlanningService
from app.models.meal_plan import MealPlan

bp = Blueprint('meal_plan', __name__, url_prefix='/api/meal-plan')
meal_planning_service = MealPlanningService()

@bp.route('', methods=['POST'])
@jwt_required()
def create_meal_plan():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if 'duration' not in data:
        return jsonify({'success': False, 'message': 'Duration is required'}), 400

    result, status_code = meal_planning_service.create_meal_plan(
        user_id=user_id,
        duration=data['duration']
    )
    
    return jsonify(result), status_code

@bp.route('', methods=['GET'])
@jwt_required()
def get_meal_plans():
    user_id = get_jwt_identity()
    result, status_code = meal_planning_service.get_meal_plans(user_id)
    return jsonify(result), status_code

@bp.route('/<meal_plan_id>', methods=['GET'])
@jwt_required()
def get_meal_plan(meal_plan_id):
    try:
        meal_plan = MealPlan.find_by_id(meal_plan_id)
        if not meal_plan:
            return jsonify({'success': False, 'message': 'Meal plan not found'}), 404
        return jsonify({'success': True, 'meal_plan': meal_plan}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
