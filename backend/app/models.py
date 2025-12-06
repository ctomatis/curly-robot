from app.db import db
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.mysql import FLOAT
from slugify import slugify
from sqlalchemy_serializer import SerializerMixin
import math


class Product(db.Model, SerializerMixin):
    __tablename__ = "product"

    serialize_only = ("id", "name", "parent_id", "slug", "price")

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey("product.id"), nullable=True)
    slug = db.Column(db.String(255), nullable=False, unique=True)
    price = db.Column(FLOAT(unsigned=True), nullable=True)

    # 1. Relación Descendente: Hijos (Uno-a-Muchos)
    children = relationship(
        "Product",
        # remote_side=[id]: Indica que el lado "UNO" de la relación es 'Product.id'.
        # Esto le dice a SQLAlchemy que busque hijos donde el parent_id sea igual a este id.
        remote_side=[id],
        # backref="parent" se mantiene, creando la relación ascendente (Muchos-a-Uno)
        backref="parent",
        single_parent=True,
        cascade="all, delete-orphan",
    )

    @classmethod
    def find_by_slug(cls, slug):
        return cls.query.filter_by(slug=slug).first()

    def price_for_weight(self, weight_gr, min_weight):
        if not weight_gr or weight_gr <= 0:
            return 0

        kg = (math.ceil(weight_gr / min_weight) * min_weight) / 1000
        return round(kg * self.price, 2)

    def __repr__(self):
        return f"<Product(name='{self.name}', price={self.price}, parent_id={self.parent_id})>"


def upsert_product(name, parent_id=None, price=None):
    slug = slugify(name)
    product = Product.find_by_slug(slug)
    if product is None:
        product = Product(
            name=name,
            slug=slug,
            parent_id=parent_id,
            price=price
        )
    else:
        if price is not None:
            product.price = price
            
        if parent_id is not None:
            product.parent_id = parent_id

    product = db.session.merge(product)
    db.session.flush()
    return product


def upsert_products(data):
    total = 0
    for section_name, section_content in data.items():
        section = upsert_product(name=section_name)

        first_value = next(iter(section_content.values()))
        if isinstance(first_value, dict):

            for category_name, items in section_content.items():
                category = upsert_product(name=category_name, parent_id=section.id)

                for item_name, price in items.items():
                    upsert_product(name=item_name, parent_id=category.id, price=price)
                    total += 1
        else:
            for item_name, price in section_content.items():
                upsert_product(name=item_name, parent_id=section.id, price=price)
                total += 1

        db.session.commit()
    return total
