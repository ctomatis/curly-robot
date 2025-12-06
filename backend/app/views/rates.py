from flask.views import MethodView
from flask import jsonify, abort, request
from app.services.currency_rates import CurrencyRates


class Rates(MethodView):

    def get(self):
        date = request.args.get("date")
        currency = request.args.get("currency") or "ars"
        if not date:
            abort(400, description="La fecha es requerida en el formato 'YYYY-MM-DD'.")

        try:
            rv = CurrencyRates.find(date, currency)
            return jsonify(
                {"status": "OK", "data": {"code": currency, "rate": rv, "date": date}}
            )
        except Exception as e:
            abort(400, description=str(e))
