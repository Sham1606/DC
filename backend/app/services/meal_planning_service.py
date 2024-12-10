from app.models.meal_plan import MealPlan
from app.models.health_profile import HealthProfile
from app.ml_models.nutrition_recommender import NutritionRecommender
from datetime import datetime

class MealPlanningService:
    def __init__(self):
        self.nutrition_recommender = NutritionRecommender()

    def create_meal_plan(self, user_id, duration):
        try:
            # Get user's health profile
            health_profile = HealthProfile.find_by_user_id(user_id)
            if not health_profile:
                return {'success': False, 'message': 'Health profile not found'}, 404

            # Get nutritional recommendations
            recommendations = self.nutrition_recommender.recommend_nutrition(health_profile)

            # Generate meal plan based on recommendations
            meals = self._generate_meals(recommendations, duration)

            # Create and save meal plan
            meal_plan = MealPlan(
                user_id=user_id,
                meals=meals,
                duration=duration,
                start_date=datetime.utcnow()
            )
            meal_plan_id = meal_plan.save()

            return {
                'success': True,
                'message': 'Meal plan created successfully',
                'meal_plan_id': meal_plan_id,
                'meal_plan': meal_plan.to_dict()
            }, 201

        except Exception as e:
            return {'success': False, 'message': str(e)}, 500

    def _generate_meals(self, recommendations, duration):
        # This is a simplified version. In a real application,
        # this would be more sophisticated and would use the
        # nutrition recommender to generate appropriate meals.
        meals = []
        for day in range(duration):
            daily_meals = {
                'day': day + 1,
                'breakfast': {
                    'name': 'Healthy Breakfast',
                    'calories': recommendations['calories'] * 0.3,
                    'protein': recommendations['protein'] * 0.3,
                    'carbs': recommendations['carbs'] * 0.3,
                    'fat': recommendations['fat'] * 0.3
                },
                'lunch': {
                    'name': 'Balanced Lunch',
                    'calories': recommendations['calories'] * 0.35,
                    'protein': recommendations['protein'] * 0.35,
                    'carbs': recommendations['carbs'] * 0.35,
                    'fat': recommendations['fat'] * 0.35
                },
                'dinner': {
                    'name': 'Nutritious Dinner',
                    'calories': recommendations['calories'] * 0.35,
                    'protein': recommendations['protein'] * 0.35,
                    'carbs': recommendations['carbs'] * 0.35,
                    'fat': recommendations['fat'] * 0.35
                }
            }
            meals.append(daily_meals)
        return meals

    def get_meal_plans(self, user_id):
        try:
            meal_plans = MealPlan.find_by_user_id(user_id)
            return {'success': True, 'meal_plans': meal_plans}, 200
        except Exception as e:
            return {'success': False, 'message': str(e)}, 500