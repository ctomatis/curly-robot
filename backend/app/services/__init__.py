import pandas as pd

def parse_price(price):
    if pd.isna(price):
        return None

    price_str = str(price).replace("$", "").replace(".", "").replace(",", "").strip()

    try:
        price = float(price_str)
        return price if price > 0 else None
    except:
        return None