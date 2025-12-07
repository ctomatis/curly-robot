from flask.views import MethodView
from flask import jsonify, abort, request, current_app
from app.services.currency_rates import CurrencyRates
from app.models import Product
from app.services.recipes_parser import RecipesParser
from app.validator.schema import schema
from app.validator import AppValidator


class OrderBatch(MethodView):

    def post(self):
        date = request.form.get("date")
        date_validator = AppValidator({"date": schema["date"]})
        date_validator.validate({"date": date})

        if not date_validator.validate({"date": date}):
            return jsonify({"status": "ERR", "errors": date_validator.errors}), 422

        try:
            rate = CurrencyRates.find(date, "ars")
            if not rate:
                abort(500)
        except Exception as e:
            abort(500, description=str(e))

        if "file" not in request.files:
            abort(400, description="El archivo es requerido.")

        file = request.files["file"]
        if not file or file.filename == "":
            abort(400, description="El archivo es requerido.")

        data = RecipesParser.parse(file)
        if not data:
            abort(400, description="No se pudo leer el archivo")

        results = []

        for recipe, items in data.items():
            products = Product.query.filter(Product.slug.in_(items.keys())).all()

            total = 0.0
            total_weight = 0.0
            n = 0
            for p in products:
                n += 1
                total_weight += items[p.slug]["weight"]
                total += p.price_for_weight(
                    items[p.slug]["weight"], current_app.config["MIN_FRACTION"]
                )

            results.append(
                {
                    "date": date,
                    "recipe": recipe,
                    "count": n,
                    "weight": total_weight,
                    "ars": total,
                    "usd": total / rate,
                }
            )

        return jsonify(results)
