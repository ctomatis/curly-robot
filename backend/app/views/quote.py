from flask.views import MethodView
from flask import jsonify, abort, request, current_app
from app.services.currency_rates import CurrencyRates
from app.validator import validator
from app.models import Product


def aggregate_weights(items):
    result = {}
    for i in items:
        result[i["id"]] = result.get(i["id"], 0) + i["weight"]
    return result


class Order(MethodView):

    def post(self):
        data = request.get_json()

        if not validator.validate(data):
            return jsonify({"status": "ERR", "errors": validator.errors}), 422

        items = aggregate_weights(data["items"])

        products = Product.query.filter(Product.id.in_(items.keys())).all()

        total = 0.0
        total_weight = 0.0
        for p in products:
            total_weight += items[p.id]
            total += p.price_for_weight(items[p.id], current_app.config["MIN_FRACTION"])

        if not total:
            abort(404)

        try:
            rate = CurrencyRates.find(data["date"], "ars")
            if not rate:
                abort(500)
        except Exception as e:
            abort(500, description=str(e))

        return (
            jsonify(
                {
                    "status": "OK",
                    "data": {
                        "count": len(items),
                        "weight": total_weight,
                        "ars": total,
                        "usd": total / rate,
                    },
                }
            ),
            201,
        )
