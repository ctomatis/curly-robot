from app.views.health import Health
from app.views.upload import Upload
from app.views.product import Products
from app.views.rates import Rates
from app.views.quote import Order


def register_routes(app):
    app.add_url_rule("/health", view_func=Health.as_view("health"))
    app.add_url_rule("/upload", view_func=Upload.as_view("upload"))
    app.add_url_rule("/product/<int:parent_id>", view_func=Products.as_view("product"))

    app.add_url_rule(
        "/product",
        defaults={"parent_id": None},
        view_func=Products.as_view("product_list"),
    )

    app.add_url_rule("/rates", view_func=Rates.as_view("rates"))
    app.add_url_rule("/order", view_func=Order.as_view("quote"))
