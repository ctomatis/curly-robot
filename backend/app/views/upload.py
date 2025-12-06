from flask import request, jsonify, abort
from flask.views import MethodView
from werkzeug.utils import secure_filename
from app.services.xls_parser import XLSParser
from app.services.pdf_parser import PDFParser
from app.models import upsert_products

ALLOWED_MIMES = (
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/pdf",
)


class Upload(MethodView):
    def post(self):
        if "file" not in request.files:
            abort(400, description="El archivo es requerido.")

        file = request.files["file"]
        if not file or file.filename == "":
            abort(400, description="El archivo es requerido.")

        if file.mimetype in ALLOWED_MIMES:
            filename = secure_filename(file.filename)

            if file.mimetype == ALLOWED_MIMES[0]:
                data = XLSParser.parse(file)

            if file.mimetype == ALLOWED_MIMES[1]:
                data = PDFParser.parse(file)

            total = upsert_products(data)

            if total:
                return (
                    jsonify(
                        {
                            "code": 201,
                            "status": "OK",
                            "message": f"El archivo '{filename}' se cargó correctamente.",
                            "file": filename,
                            "total": total,
                        }
                    ),
                    201,
                )
            else:
                return (
                    jsonify(
                        {
                            "code": 400,
                            "status": "ERR",
                            "message": "No se pudo leer el archivo.",
                        }
                    ),
                    400,
                )

        abort(422, description="Tipo de archivo no permitido.")
