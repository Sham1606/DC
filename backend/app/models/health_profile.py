from app import mongo
from bson import ObjectId
from datetime import datetime

class HealthProfile:
    def __init__(self, user_id, age, gender, height, weight, activity_level, 
                 dietary_restrictions=None, health_goals=None):
        self.user_id = user_id
        self.age = age
        self.gender = gender
        self.height = height  # in cm
        self.weight = weight  # in kg
        self.activity_level = activity_level
        self.dietary_restrictions = dietary_restrictions or []
        self.health_goals = health_goals or []
        self.last_updated = datetime.utcnow()

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'age': self.age,
            'gender': self.gender,
            'height': self.height,
            'weight': self.weight,
            'activity_level': self.activity_level,
            'dietary_restrictions': self.dietary_restrictions,
            'health_goals': self.health_goals,
            'last_updated': self.last_updated
        }

    def save(self):
        health_profile_data = self.to_dict()
        result = mongo.db.health_profiles.insert_one(health_profile_data)
        return str(result.inserted_id)

    @staticmethod
    def find_by_user_id(user_id):
        return mongo.db.health_profiles.find_one({'user_id': user_id})

    @staticmethod
    def update(user_id, updates):
        updates['last_updated'] = datetime.utcnow()
        return mongo.db.health_profiles.update_one(
            {'user_id': user_id},
            {'$set': updates}
        )