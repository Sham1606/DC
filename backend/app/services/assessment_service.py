from app.models.health_profile import HealthProfile
from app.ml_models.questionnaire_generator import QuestionnaireGenerator

class AssessmentService:
    def __init__(self):
        self.questionnaire_generator = QuestionnaireGenerator()

    def create_health_profile(self, user_id, profile_data):
        try:
            health_profile = HealthProfile(
                user_id=user_id,
                age=profile_data['age'],
                gender=profile_data['gender'],
                height=profile_data['height'],
                weight=profile_data['weight'],
                activity_level=profile_data['activity_level'],
                dietary_restrictions=profile_data.get('dietary_restrictions', []),
                health_goals=profile_data.get('health_goals', [])
            )
            profile_id = health_profile.save()
            
            return {
                'success': True,
                'message': 'Health profile created successfully',
                'profile_id': profile_id,
                'profile': health_profile.to_dict()
            }, 201

        except Exception as e:
            return {'success': False, 'message': str(e)}, 500

    def get_health_profile(self, user_id):
        try:
            profile = HealthProfile.find_by_user_id(user_id)
            if not profile:
                return {'success': False, 'message': 'Health profile not found'}, 404
            
            return {'success': True, 'profile': profile}, 200

        except Exception as e:
            return {'success': False, 'message': str(e)}, 500

    def update_health_profile(self, user_id, updates):
        try:
            result = HealthProfile.update(user_id, updates)
            if result.modified_count == 0:
                return {'success': False, 'message': 'Health profile not found'}, 404

            updated_profile = HealthProfile.find_by_user_id(user_id)
            return {
                'success': True,
                'message': 'Health profile updated successfully',
                'profile': updated_profile
            }, 200

        except Exception as e:
            return {'success': False, 'message': str(e)}, 500

    def generate_questionnaire(self):
        try:
            questions = self.questionnaire_generator.generate_questionnaire()
            return {'success': True, 'questions': questions}, 200
        except Exception as e:
            return {'success': False, 'message': str(e)}, 500

    def analyze_responses(self, responses):
        try:
            analysis = self.questionnaire_generator.analyze_responses(responses)
            return {'success': True, 'analysis': analysis}, 200
        except Exception as e:
            return {'success': False, 'message': str(e)}, 500