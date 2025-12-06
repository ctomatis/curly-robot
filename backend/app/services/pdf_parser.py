from PyPDF2 import PdfReader


def parse_price(price):
    price_str = str(price).replace("$", "").replace(".", "").replace(",", "").strip()
    try:
        price = float(price_str)
        return price if price >= 0 else None
    except:
        return None


def clean_item(line):
    val = ""
    for c in line:
        if not c.strip():
            continue

        if c.isupper():
            val = c
            continue

        if val:
            val += c
    return val


def read_line(line):
    idx = line.find("$")
    price = parse_price(line[idx + 1 :])  # precio

    words = []
    current = ""
    for c in line[:idx]:
        if c.isupper():
            if current:
                words.append(current)
            current = c
        else:
            current += c

    if current:
        words.append(current)

    words = [w.strip() for w in words]

    return words, price


class PDFParser:

    @staticmethod
    def parse(file_path: str):
        reader = PdfReader(file_path)

        content = ""
        for page in reader.pages:
            content += page.extract_text()
        lines = content.split("\n")

        for i, line in enumerate(lines):
            line = line.strip()

            if not i:
                section = line[: line.find(" ")].strip()
                result = {section: {}}

            if "por kg" in line:
                categories, price = read_line(lines[i - 1])

                item = clean_item(lines[i - 2])

                if price is None or not categories or not item:
                    continue

                key = " - ".join(categories)

                if not key in result[section]:
                    result[section][key] = {}
                result[section][key][item] = price
                
        return result


if __name__ == "__main__":
    import os, json

    dir = os.path.abspath(os.path.dirname(__file__))
    filepath = os.path.join(dir, "inputs/verduleria.pdf")
    data = PDFParser.parse(filepath)
    print(json.dumps(data, indent=4, ensure_ascii=False))
