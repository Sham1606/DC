from app import mongo
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
from datetime import datetime

class User:
    def __init__(self, email, password, name, role, oauth_provider=None, oauth_id=None, reset_token=None, reset_token_expires=None):
        self.email = email
        self.password_hash = generate_password_hash(password)
        self.name = name
        self.role = role
        self.active = True
        self.oauth_provider = oauth_provider  # 'google' or 'github'
        self.oauth_id = oauth_id
        self.reset_token = reset_token
        self.reset_token_expires = reset_token_expires

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'email': self.email,
            'name': self.name,
            'role': self.role,
            'active': self.active,
            'oauth_provider': self.oauth_provider,
            'oauth_id': self.oauth_id,
            'reset_token': self.reset_token,
            'reset_token_expires': self.reset_token_expires
        }

    def save(self):
        user_data = {
            'email': self.email,
            'password_hash': self.password_hash,
            'name': self.name,
            'role': self.role,
            'active': self.active,
            'oauth_provider': self.oauth_provider,
            'oauth_id': self.oauth_id,
            'reset_token': self.reset_token,
            'reset_token_expires': self.reset_token_expires
        }
        result = mongo.db.users.insert_one(user_data)
        return str(result.inserted_id)

    @staticmethod
    def find_by_email(email):
        return mongo.db.users.find_one({'email': email})

    @staticmethod
    def find_by_oauth(oauth_provider, oauth_id):
        return mongo.db.users.find_one({'oauth_provider': oauth_provider, 'oauth_id': oauth_id})

    @staticmethod
    def find_by_id(user_id):
        return mongo.db.users.find_one({'_id': ObjectId(user_id)})

    @staticmethod
    def create_oauth_user(email, name, oauth_provider, oauth_id):
        user = User(email=email, name=name, oauth_provider=oauth_provider, oauth_id=oauth_id)
        user_id = user.save()
        return User.find_by_id(user_id)
    @staticmethod
    def update_oauth_info(user_id, oauth_provider, oauth_id):
        mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'oauth_provider': oauth_provider, 'oauth_id': oauth_id}}
        )

    @staticmethod
    def update_reset_token(user_id, token, expires):
        mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'reset_token': token, 'reset_token_expires': expires}}
        )
    
    @staticmethod
    def clear_reset_token(user_id):
        mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$unset': {'reset_token': '', 'reset_token_expires': ''}}
        )

    @staticmethod
    def find_by_reset_token(token):
        return mongo.db.users.find_one({'reset_token': token})

    @staticmethod
    def update_password(user_id, new_password):
        password_hash = generate_password_hash(new_password)
        mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {
                '$set': {'password_hash': password_hash},
                '$unset': {'reset_token': ''}
            }
        )

