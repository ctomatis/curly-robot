import os

CONFIG = {
    "FLASK_DEBUG": os.environ.get("FLASK_DEBUG"),
    "MAX_CONTENT_LENGTH": 1024**2,
    "MIN_FRACTION": 250,
    "ALLOWED_ORIGINS": ["http://localhost:5173"],
}
