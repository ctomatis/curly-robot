from datetime import datetime
import urllib.request
import json


def is_valid_date(date: str) -> bool:
    try:
        datetime.strptime(date, "%Y-%m-%d")
        return True
    except ValueError:
        return False


class CurrencyRates:

    @staticmethod
    def find(date: str, currency_code: str) -> float:

        if not is_valid_date(date):
            raise ValueError("Formato de fecha no válido.")

        # La url deberia estar en config
        url = f"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{date}/v1/currencies/usd.json"

        req = urllib.request.Request(url, method="GET")

        with urllib.request.urlopen(req) as response:
            data = response.read().decode("utf-8")
            json_data = json.loads(data)
            try:
                return json_data["usd"][currency_code]
            except KeyError:
                raise KeyError(f"No hay cotización para '{currency_code}'.")
