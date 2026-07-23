import asyncio
import httpx
from datetime import datetime
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

async def fetch_products():
    url = "https://dummyjson.com/products?limit=0&utm_source=chatgpt.com"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 200:
            return response.json().get("products", [])
        else:
            print(f"Failed to fetch data: {response.status_code}")
            return []

def seed_database(products_data):
    db = SessionLocal()
    try:
        categories_set = set()
        for p in products_data:
            if "category" in p:
                categories_set.add(p["category"])
        
        category_map = {}
        for cat_name in categories_set:
            existing = db.query(models.Category).filter(models.Category.name == cat_name).first()
            if not existing:
                cat = models.Category(name=cat_name)
                db.add(cat)
                db.commit()
                db.refresh(cat)
                category_map[cat_name] = cat.id
            else:
                category_map[cat_name] = existing.id

        print(f"Seeded {len(category_map)} categories.")

        for p_data in products_data:
            existing_prod = db.query(models.Product).filter(models.Product.id == p_data.get("id")).first()
            if not existing_prod:
                prod = models.Product(
                    id=p_data.get("id"),
                    title=p_data.get("title"),
                    description=p_data.get("description"),
                    price=p_data.get("price"),
                    discountPercentage=p_data.get("discountPercentage", 0),
                    rating=p_data.get("rating", 0),
                    stock=p_data.get("stock", 0),
                    brand=p_data.get("brand"),
                    sku=p_data.get("sku"),
                    weight=p_data.get("weight", 0),
                    thumbnail=p_data.get("thumbnail"),
                    category_id=category_map.get(p_data.get("category"))
                )
                db.add(prod)
                db.commit()
                db.refresh(prod)
                
                if "images" in p_data:
                    for img_url in p_data["images"]:
                        img = models.ProductImage(url=img_url, product_id=prod.id)
                        db.add(img)
                
                if "reviews" in p_data:
                    for rev in p_data["reviews"]:
                        try:
                            # Convert string to datetime, DummyJSON format: "2024-05-23T08:56:21.618Z"
                            date_str = rev.get("date")
                            if date_str:
                                date_obj = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
                            else:
                                date_obj = datetime.utcnow()
                        except Exception:
                            date_obj = datetime.utcnow()

                        review = models.Review(
                            rating=rev.get("rating"),
                            comment=rev.get("comment"),
                            date=date_obj,
                            reviewerName=rev.get("reviewerName"),
                            reviewerEmail=rev.get("reviewerEmail"),
                            product_id=prod.id
                        )
                        db.add(review)
                db.commit()
        print("Database seeding completed.")
    except Exception as e:
        db.rollback()
        print(f"An error occurred: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    products = asyncio.run(fetch_products())
    if products:
        print(f"Fetched {len(products)} products.")
        seed_database(products)
    else:
        print("No products to seed.")
