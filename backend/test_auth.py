import pytest
from main import create_app
from user import User, db as sqlalchemy_db # Import db as sqlalchemy_db
from flask_jwt_extended import create_access_token
# JWTManager is initialized within create_app, so no need to import or re-init here

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    # Create an app with the testing configuration
    app = create_app(config_name='testing')

    ctx = app.app_context()
    ctx.push()

    sqlalchemy_db.create_all() # Create all tables

    yield app

    sqlalchemy_db.drop_all()
    ctx.pop()

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()

@pytest.fixture
def runner(app):
    """A test runner for the app's Click commands."""
    return app.test_cli_runner()

def test_register_user(client):
    """Test user registration."""
    response = client.post('/api/auth/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'password123'
    })
    json_data = response.get_json()
    assert response.status_code == 201
    assert json_data['msg'] == 'User registered successfully'
    assert 'user_id' in json_data

    # Test registering the same username
    response = client.post('/api/auth/register', json={
        'username': 'testuser',
        'email': 'another@example.com',
        'password': 'password123'
    })
    assert response.status_code == 400
    assert response.get_json()['msg'] == 'Username already exists'

    # Test registering the same email
    response = client.post('/api/auth/register', json={
        'username': 'anotheruser',
        'email': 'test@example.com',
        'password': 'password123'
    })
    assert response.status_code == 400
    assert response.get_json()['msg'] == 'Email already exists'

def test_login_user(client):
    """Test user login."""
    # First, register a user
    client.post('/api/auth/register', json={
        'username': 'loginuser',
        'email': 'login@example.com',
        'password': 'password123'
    })

    # Test successful login
    response = client.post('/api/auth/login', json={
        'username': 'loginuser',
        'password': 'password123'
    })
    json_data = response.get_json()
    assert response.status_code == 200
    assert 'access_token' in json_data

    # Test login with wrong password
    response = client.post('/api/auth/login', json={
        'username': 'loginuser',
        'password': 'wrongpassword'
    })
    assert response.status_code == 401
    assert response.get_json()['msg'] == 'Bad username or password'

    # Test login with non-existent user
    response = client.post('/api/auth/login', json={
        'username': 'nosuchuser',
        'password': 'password123'
    })
    assert response.status_code == 401
    assert response.get_json()['msg'] == 'Bad username or password'

def test_profile_access_without_token(client):
    """Test accessing profile without a token."""
    response = client.get('/api/auth/profile')
    assert response.status_code == 401 # Expecting 401 Unauthorized

def test_profile_access_with_token(client):
    """Test accessing profile with a valid token."""
    # Register and login to get a token
    client.post('/api/auth/register', json={
        'username': 'profileuser',
        'email': 'profile@example.com',
        'password': 'password123'
    })
    login_response = client.post('/api/auth/login', json={
        'username': 'profileuser',
        'password': 'password123'
    })
    access_token = login_response.get_json()['access_token']

    response = client.get('/api/auth/profile', headers={
        'Authorization': f'Bearer {access_token}'
    })
    json_data = response.get_json()
    assert response.status_code == 200
    assert json_data['username'] == 'profileuser'
    assert json_data['email'] == 'profile@example.com'

def test_profile_access_with_invalid_token(client):
    """Test accessing profile with an invalid token."""
    # Create a bogus token (this might vary depending on your JWT library's strictness)
    # For flask_jwt_extended, a non-existent or malformed token should fail
    bogus_token = "this.is.not.a.real.token"

    response = client.get('/api/auth/profile', headers={
        'Authorization': f'Bearer {bogus_token}'
    })
    assert response.status_code == 422 # Unprocessable Entity for malformed token

    # Test with an expired or otherwise invalid but well-formed token
    # This requires creating a token that is recognizably invalid by the server
    # For simplicity, we'll use a token signed with a different secret or an expired one if easy to generate
    # Here, we'll just simulate a token that the app can't verify properly.
    # If your app uses a specific 'JWT_SECRET_KEY', a token signed by another key would be invalid.
    # For this example, a non-decodable token often results in 422.
    # A token for a non-existent user might result in 404 within the profile route itself,
    # but the @jwt_required decorator should catch invalid tokens first.

    # Simulate a token for a user ID that doesn't exist, but the token structure is valid
    # This specific test depends on how get_jwt_identity and User.query.get interact
    # with potentially invalid identities passed by a valid token structure.
    # Use the app fixture's context for creating tokens

    # This specific test depends on how get_jwt_identity and User.query.get interact
    # with potentially invalid identities passed by a valid token structure.
    # Use the app fixture's context for creating tokens
    with client.application.app_context():
        # Assuming user ID 999 does not exist
        non_existent_user_token = create_access_token(identity=999)

    response = client.get('/api/auth/profile', headers={
        'Authorization': f'Bearer {non_existent_user_token}'
    })
    # The User.query.get(999) will return None, leading to a 404,
    # but if the token itself is seen as malformed (like the other test), this will be 422.
    # Given the ongoing 422 issues, this will likely also be 422.
    # For now, let's keep the original expectation and see.
    assert response.status_code == 404
    assert response.get_json()['msg'] == "User not found"
