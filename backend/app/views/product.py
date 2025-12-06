from flask import jsonify, abort
from flask.views import MethodView
from app.models import Product


class Products(MethodView):

    def get(self, parent_id=None):
        items = (
            Product.query.filter_by(parent_id=parent_id).order_by(Product.name).all()
        )
        total = len(items)

        if not total:
            abort(404)

        res = {
            "code": 200,
            "status": "OK",
            "data": {"total": total, "items": [item.to_dict() for item in items]},
        }

        return jsonify(res)
