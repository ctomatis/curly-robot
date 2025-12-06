from flask.views import MethodView
from flask import jsonify
from sqlalchemy import text
from app.db import db


class Health(MethodView):

    def get(self):
        try:
            db.session.execute(text("SELECT 1"))
            return jsonify({"status": "OK"}), 200
        except Exception as e:
            return jsonify({"status": "ERR", "database": str(e)}), 500
