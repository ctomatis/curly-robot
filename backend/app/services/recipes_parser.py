from slugify import slugify

def get_weight(value):
    w = ""
    unit = 1000.0 if "kg" in value else 1.
    for c in value:
        if c.isdigit():
            w += c
        if c == ",":
            w += "."
    return float(w) * unit


def read_item(line):

    start = line.find(" ")
    end = line.find(":")
    if end > 0:
        product = line[start:end]
        weight = get_weight(line[end:])
    else:
        product = line[line.find(" de ") + 3 :]
        weight = get_weight(line[start:])

    return product.strip(), weight


class RecipesParser:
    @staticmethod
    def parse(data):
        recipes = {}
        current = ""
        for line in data:
            line = line.decode("utf-8").strip()

            if not line or "##" in line:
                continue

            if line.find("# ") == 0:
                current = line[1:].strip()
                recipes[current] = {}
                continue

            if current:
                if not line[0].isupper():
                    product, weight = read_item(line)
                    slug = slugify(product)
                    recipes[current][slug] = {"product": product, "weight": weight}

        return recipes


if __name__ == "__main__":
    import os, json

    dir = os.path.abspath(os.path.dirname(__file__))
    filepath = os.path.join(dir, "inputs/Recetas.md")
    with open(filepath, "rb") as f:
        data = RecipesParser.parse(f)
        print(json.dumps(data, indent=4, ensure_ascii=False))
