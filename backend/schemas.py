from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    class Config:
        from_attributes = True

class ProductImageBase(BaseModel):
    url: str

class ProductImage(ProductImageBase):
    id: int
    class Config:
        from_attributes = True

class ReviewBase(BaseModel):
    rating: int
    comment: str
    reviewerName: str
    reviewerEmail: str
    date: datetime

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: int
    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    title: str
    description: str
    price: float
    discountPercentage: float = 0.0
    rating: float = 0.0
    stock: int = 0
    brand: Optional[str] = None
    sku: Optional[str] = None
    weight: float = 0.0
    thumbnail: str

class ProductCreate(ProductBase):
    category_name: str

class Product(ProductBase):
    id: int
    category: Optional[Category] = None
    images: List[ProductImage] = []
    reviews: List[Review] = []

    class Config:
        from_attributes = True
