from fastapi import FastAPI, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import models, schemas
from database import engine, get_db
import ai_service

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI E-commerce Platform API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    cart: Optional[List[dict]] = []
    browsing_history: Optional[List[dict]] = []
    wishlist: Optional[List[dict]] = []

class RecRequest(BaseModel):
    user_viewed_ids: Optional[List[int]] = []
    limit: Optional[int] = 8

class ProductsResponse(BaseModel):
    products: List[schemas.Product]
    total: int
    skip: int
    limit: int

    class Config:
        from_attributes = True

@app.get("/")
def read_root():
    return {"status": "online", "message": "AI E-commerce Platform API is running"}

# --- PRODUCT ENDPOINTS ---

@app.get("/api/v1/products", response_model=ProductsResponse)
def get_products(
    skip: int = 0, 
    limit: int = 200, 
    search: Optional[str] = None,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort: Optional[str] = None, # price_asc, price_desc, rating, discount
    db: Session = Depends(get_db)
):
    query = db.query(models.Product)
    
    if search:
        query = query.filter(or_(
            models.Product.title.ilike(f"%{search}%"),
            models.Product.description.ilike(f"%{search}%"),
            models.Product.brand.ilike(f"%{search}%")
        ))
    if category:
        query = query.join(models.Category).filter(models.Category.name == category)
    if brand:
        query = query.filter(models.Product.brand == brand)
    if min_price is not None:
        query = query.filter(models.Product.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Product.price <= max_price)
        
    if sort == "price_asc":
        query = query.order_by(models.Product.price.asc())
    elif sort == "price_desc":
        query = query.order_by(models.Product.price.desc())
    elif sort == "rating":
        query = query.order_by(models.Product.rating.desc())
    elif sort == "discount":
        query = query.order_by(models.Product.discountPercentage.desc())

    total = query.count()
    products = query.offset(skip).limit(limit).all()
    
    # Explicitly validate via Pydantic to avoid ORM serialization errors
    serialized = [schemas.Product.model_validate(p) for p in products]
    return ProductsResponse(products=serialized, total=total, skip=skip, limit=limit)

@app.get("/api/v1/products/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return schemas.Product.model_validate(product)

@app.get("/api/v1/categories", response_model=List[schemas.Category])
def get_categories(db: Session = Depends(get_db)):
    cats = db.query(models.Category).all()
    return [schemas.Category.model_validate(c) for c in cats]

# --- AI & RECOMMENDATION ENDPOINTS ---

@app.post("/api/v1/recommendations/hybrid", response_model=List[schemas.Product])
def get_hybrid_recommendations(req: RecRequest, db: Session = Depends(get_db)):
    products = ai_service.get_hybrid_recommendations(db, user_viewed_ids=req.user_viewed_ids, limit=req.limit)
    return [schemas.Product.model_validate(p) for p in products]

@app.get("/api/v1/products/{product_id}/similar", response_model=List[schemas.Product])
def get_similar_products(product_id: int, limit: int = 6, db: Session = Depends(get_db)):
    all_products = db.query(models.Product).all()
    ai_service.recommender.fit_products(all_products)
    similar_ids = ai_service.recommender.get_similar_products(product_id, top_n=limit)
    results = db.query(models.Product).filter(models.Product.id.in_(similar_ids)).all()
    return [schemas.Product.model_validate(p) for p in results]

@app.get("/api/v1/products/{product_id}/ai-summary")
def get_ai_review_summary(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return ai_service.summarize_reviews_ai(product.title, product.reviews)

@app.post("/api/v1/ai/chat")
def ai_chat_assistant(req: ChatRequest):
    reply = ai_service.generate_ai_assistant_response(
        user_message=req.message,
        cart_items=req.cart,
        browsing_history=req.browsing_history,
        wishlist=req.wishlist
    )
    return {"reply": reply}

# --- ANALYTICS ENDPOINTS (ADMIN & SELLER) ---

@app.get("/api/v1/analytics/dashboard")
def get_analytics(db: Session = Depends(get_db)):
    total_products = db.query(models.Product).count()
    total_categories = db.query(models.Category).count()
    total_reviews = db.query(models.Review).count()
    avg_rating = db.query(func.avg(models.Product.rating)).scalar() or 0.0
    
    # Category distribution
    cat_counts = db.query(models.Category.name, func.count(models.Product.id))\
        .join(models.Product).group_by(models.Category.name).all()

    return {
        "metrics": {
            "total_products": total_products,
            "total_categories": total_categories,
            "total_reviews": total_reviews,
            "avg_rating": round(avg_rating, 2),
            "recommendation_ctr": "18.4%",
            "ai_conversion_rate": "4.2%",
            "revenue": 128450.00
        },
        "category_distribution": [{"category": name, "count": count} for name, count in cat_counts[:6]],
        "sales_trend": [
            {"month": "Jan", "sales": 12000, "recommendations_revenue": 3400},
            {"month": "Feb", "sales": 19000, "recommendations_revenue": 5800},
            {"month": "Mar", "sales": 24000, "recommendations_revenue": 8900},
            {"month": "Apr", "sales": 31000, "recommendations_revenue": 12400},
            {"month": "May", "sales": 42000, "recommendations_revenue": 17800},
        ]
    }
