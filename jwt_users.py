import os
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()


def generate_jwt_token(user_data, expires_in=3600):
    secret = os.getenv("SECRET_KEY")
    algorithm = os.getenv("ALGORITHM")
    user_data['exp'] = datetime.utcnow() + timedelta(seconds=expires_in)
    return jwt.encode(user_data, secret, algorithm=algorithm)


def decode_jwt_token(user_token):
    secret = os.getenv("SECRET_KEY")
    algorithm = os.getenv("ALGORITHM")
    try:
        return jwt.decode(user_token, secret, algorithms=algorithm)
    except jwt.ExpiredSignatureError:
        raise Exception('Token has expired')
    except jwt.InvalidTokenError:
        raise Exception('Invalid token')
