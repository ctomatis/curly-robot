from flask import Flask
from flask_cors import CORS
from app.db import init_db, db

from app.routes import register_routes
from app.error_handler import register_error_handlers
from app.settings import CONFIG


def create_app():
    app = Flask(__name__)
    app.config.from_mapping(CONFIG)

    CORS(app, origins=CONFIG["ALLOWED_ORIGINS"])

    init_db(app)

    register_routes(app)
    register_error_handlers(app)

    return app


app = create_app()

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
