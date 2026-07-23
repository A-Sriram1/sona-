from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    role = Column(String, default="customer") # admin, seller, customer
    created_at = Column(DateTime, default=datetime.utcnow)

    reviews = relationship("Review", back_populates="user")
    orders = relationship("Order", back_populates="user")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    
    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    price = Column(Float)
    discountPercentage = Column(Float, default=0.0)
    rating = Column(Float, default=0.0)
    stock = Column(Integer, default=0)
    brand = Column(String, index=True)
    sku = Column(String, index=True)
    weight = Column(Float, default=0.0)
    thumbnail = Column(String)
    
    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="products")
    
    reviews = relationship("Review", back_populates="product")
    images = relationship("ProductImage", back_populates="product")

class ProductImage(Base):
    __tablename__ = "product_images"
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String)
    product_id = Column(Integer, ForeignKey("products.id"))
    
    product = relationship("Product", back_populates="images")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Integer)
    comment = Column(Text)
    date = Column(DateTime, default=datetime.utcnow)
    reviewerName = Column(String)
    reviewerEmail = Column(String)
    
    product_id = Column(Integer, ForeignKey("products.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Optional for now

    product = relationship("Product", back_populates="reviews")
    user = relationship("User", back_populates="reviews")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total_amount = Column(Float)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    price_at_purchase = Column(Float)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product")
