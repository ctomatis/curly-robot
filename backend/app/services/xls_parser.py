import pandas as pd
import json


# Se asume que el precio tiene separador de miles.
def parse_price(price):
    if pd.isna(price):
        return None

    price_str = str(price).replace("$", "").replace(".", "").replace(",", "").strip()

    try:
        price = float(price_str)
        return price if price >= 0 else None
    except:
        return None


def is_numeric(value):
    if pd.isna(value):
        return False
    return parse_price(value) is not None


class XLSParser:

    @staticmethod
    def parse(file_path: str) -> dict:
        df = pd.read_excel(file_path, header=None)
        df = df.dropna(how="all").reset_index(drop=True)

        result = {}

        # Identificar bloques de columnas (separadas por columnas vacías)
        column_blocks = []
        current_block = []

        for col_idx in range(len(df.columns)):
            has_data = df.iloc[:, col_idx].notna().any()

            if has_data:
                current_block.append(col_idx)
            elif current_block:
                column_blocks.append(current_block)
                current_block = []

        if current_block:
            column_blocks.append(current_block)

        # Procesar cada bloque
        for block in column_blocks:
            if len(block) < 2:
                continue

            # Buscar el nombre de la sección (ahora debería estar en fila 0 o 1)
            section_col = block[0]
            section_name = None

            # Buscar en las primeras filas
            for row_idx in range(min(3, len(df))):
                val = df.iloc[row_idx, section_col]
                if pd.notna(val):
                    temp_name = str(val).strip()
                    # Verificar que no sea un header genérico
                    if temp_name.lower() not in ["corte", "tipo", "precio"]:
                        section_name = temp_name
                        start_row = (
                            row_idx + 1
                        )  # Empezar a procesar desde la siguiente fila
                        break

            if not section_name:
                continue

            # Detectar si esta sección tiene subcategorías
            has_subcategories = False
            for row_idx in range(start_row, len(df)):
                col1 = df.iloc[row_idx, block[0]]
                col2 = df.iloc[row_idx, block[1]] if len(block) > 1 else None

                if pd.notna(col1) and not is_numeric(col2):
                    col1_str = str(col1).strip().lower()
                    if col1_str not in ("corte", "tipo") and not col1_str.startswith(
                        "precio"
                    ):
                        has_subcategories = True
                        break

            # Inicializar estructura
            result[section_name] = {}
            current_category = None

            # Procesar filas
            for row_idx in range(start_row, len(df)):

                col1 = df.iloc[
                    row_idx, block[0]
                ]  # if block[0] < len(df.columns) else None
                col2 = df.iloc[
                    row_idx, block[1]
                ]  # if len(block) > 1 and block[1] < len(df.columns) else None

                # Saltar filas completamente vacías
                if pd.isna(col1) and pd.isna(col2):
                    continue

                # Saltar headers
                if pd.notna(col1):
                    col1_str = str(col1).strip().lower()
                    if col1_str in ("corte", "tipo") or col1_str.startswith("precio"):
                        continue

                # Procesar datos
                if pd.notna(col1):
                    col1_str = str(col1).strip()

                    # Si col2 no es numérico -> es una categoría
                    if not is_numeric(col2):
                        current_category = col1_str
                        result[section_name][current_category] = {}

                    # Si col2 es numérico -> es un producto con precio
                    elif is_numeric(col2):
                        item_name = col1_str
                        price = parse_price(col2)

                        if item_name and price is not None:
                            if has_subcategories and current_category:
                                result[section_name][current_category][
                                    item_name
                                ] = price
                            else:
                                result[section_name][item_name] = price

        return result






if __name__ == "__main__":
    import os
    
    dir = os.path.abspath(os.path.dirname(__file__))
    filepath = os.path.join(dir, "inputs/Carnes y Pescados.xlsx")
    data = XLSParser.parse(filepath)
    print(json.dumps(data, indent=4, ensure_ascii=False))
