from typing import List, Dict, Any
import random

class QuestionnaireGenerator:
    def __init__(self):
        self.questions_bank = {
            'dietary_preferences': [
                {
                    'id': 'diet_type',
                    'question': 'What type of diet do you follow?',
                    'options': ['Omnivore', 'Vegetarian', 'Vegan', 'Pescatarian', 'Other']
                },
                {
                    'id': 'meal_frequency',
                    'question': 'How many meals do you typically eat per day?',
                    'options': ['2', '3', '4', '5+']
                }
            ],
            'lifestyle': [
                {
                    'id': 'exercise_frequency',
                    'question': 'How often do you exercise?',
                    'options': ['Never', '1-2 times/week', '3-4 times/week', '5+ times/week']
                },
                {
                    'id': 'sleep_quality',
                    'question': 'How would you rate your sleep quality?',
                    'options': ['Poor', 'Fair', 'Good', 'Excellent']
                }
            ],
            'health_conditions': [
                {
                    'id': 'allergies',
                    'question': 'Do you have any food allergies?',
                    'options': ['None', 'Dairy', 'Gluten', 'Nuts', 'Other']
                },
                {
                    'id': 'medical_conditions',
                    'question': 'Do you have any medical conditions that affect your diet?',
                    'options': ['None', 'Diabetes', 'Hypertension', 'Other']
                }
            ]
        }

    def generate_questionnaire(self, num_questions: int = 5) -> List[Dict[str, Any]]:
        """
        Generate a questionnaire with specified number of questions.
        """
        all_questions = []
        for category in self.questions_bank.values():
            all_questions.extend(category)
        
        return random.sample(all_questions, min(num_questions, len(all_questions)))

    def analyze_responses(self, responses: Dict[str, str]) -> Dict[str, Any]:
        """
        Analyze questionnaire responses and provide recommendations.
        """
        analysis = {
            'dietary_recommendations': [],
            'lifestyle_recommendations': [],
            'health_alerts': []
        }

        # Analyze dietary preferences
        if responses.get('diet_type') in ['Vegetarian', 'Vegan']:
            analysis['dietary_recommendations'].append(
                'Ensure adequate protein intake through plant-based sources'
            )

        # Analyze exercise habits
        exercise_freq = responses.get('exercise_frequency')
        if exercise_freq in ['Never', '1-2 times/week']:
            analysis['lifestyle_recommendations'].append(
                'Consider increasing physical activity to at least 3-4 times per week'
            )

        # Analyze sleep patterns
        if responses.get('sleep_quality') in ['Poor', 'Fair']:
            analysis['lifestyle_recommendations'].append(
                'Focus on improving sleep quality through better sleep hygiene'
            )

        # Check for health conditions
        if responses.get('medical_conditions') != 'None':
            analysis['health_alerts'].append(
                'Consult with a healthcare provider for personalized dietary advice'
            )

        return analysis