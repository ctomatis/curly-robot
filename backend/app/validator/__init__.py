from cerberus import Validator
from datetime import datetime, timedelta
from app.validator.schema import schema


class AppValidator(Validator):
    rules = {"valid_date": {"type": "integer"}}

    def _validate_valid_date(self, valid_date, field, value):

        if not valid_date:
            return

        try:
            date_value = datetime.strptime(value, "%Y-%m-%d").date()
        except ValueError:
            self._error(field, "Formato de fecha inválido (YYYY-MM-DD)")
            return

        today = datetime.now().date()
        min_date = today - timedelta(days=valid_date)

        if date_value > today:
            self._error(field, "La fecha no debe ser mayor a la actual")
            return

        if date_value < min_date:
            self._error(field, f"La fecha no debe ser menor a {valid_date} dias")


validator = AppValidator(schema)
