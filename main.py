import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from user import db as sqlalchemy_db # Renamed to avoid conflict with local 'db' variable
from auth_routes import auth_bp
from products import products_bp
from cart import cart_bp
from orders import orders_bp
from ondc import ondc_bp

def create_app(config_name=None):
    app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

    # Default configuration
    app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'
    # app.config['JWT_SECRET_KEY'] = 'super-secret' # Default JWT key
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    if config_name == 'testing':
        app.testing = True # Use direct attribute for Flask's testing mode
        app.config['JWT_SECRET_KEY'] = 'testsecretkeyfortesting'
        # print(f"########## TESTING JWT_SECRET_KEY: {app.config['JWT_SECRET_KEY']} ##########")
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['JWT_TOKEN_LOCATION'] = ['headers']
        app.config['JWT_HEADER_NAME'] = 'Authorization'
        app.config['JWT_HEADER_TYPE'] = 'Bearer'
        app.config['JWT_ALGORITHM'] = "HS256" # Explicitly set algorithm
    else: # Default non-testing config
        app.config['JWT_SECRET_KEY'] = 'supersecretkeyfordefault'
        app.config['JWT_ALGORITHM'] = "HS256" # Also set for default


    # Initialize extensions
    CORS(app, origins=['http://localhost:3000', 'http://localhost:5173', '*'])
    JWTManager(app)
    sqlalchemy_db.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(ondc_bp, url_prefix='/api/ondc')

    # Database tables will be created by the test fixture or by the main execution block

    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'message': 'ONDC Buyer App API is running'}

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        static_folder_path = app.static_folder
        if static_folder_path is None:
            return "Static folder not configured", 404

        if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
            return send_from_directory(static_folder_path, path)
        else:
            index_path = os.path.join(static_folder_path, 'index.html')
            if os.path.exists(index_path):
                return send_from_directory(static_folder_path, 'index.html')
            else:
                return "index.html not found", 404

    return app

# if __name__ == '__main__':
#     app = create_app()
#     # Ensure the database directory exists for the default SQLite DB
#     db_dir = os.path.join(os.path.dirname(__file__), 'database')
#     if not os.path.exists(db_dir):
#         os.makedirs(db_dir)
#     with app.app_context(): # Ensure tables are created for default run
#         from user import User # Import User model here
#         sqlalchemy_db.create_all()
#     app.run(host='0.0.0.0', port=5000, debug=True)

