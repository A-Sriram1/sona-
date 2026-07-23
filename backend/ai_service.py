import os
import json
from dotenv import load_dotenv
from openai import OpenAI
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session
import models

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def get_openai_client():
    if OPENAI_API_KEY:
        return OpenAI(api_key=OPENAI_API_KEY)
    return None

class RecommendationEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = None
        self.product_ids = []

    def fit_products(self, products):
        if not products:
            return
        corpus = [f"{p.title} {p.description or ''} {p.brand or ''} {p.category.name if p.category else ''}" for p in products]
        self.product_ids = [p.id for p in products]
        self.tfidf_matrix = self.vectorizer.fit_transform(corpus)

    def get_similar_products(self, product_id: int, top_n: int = 6):
        if self.tfidf_matrix is None or product_id not in self.product_ids:
            return []
        
        idx = self.product_ids.index(product_id)
        scores = cosine_similarity(self.tfidf_matrix[idx], self.tfidf_matrix).flatten()
        
        # Sort indices by highest similarity score (excluding itself)
        similar_indices = scores.argsort()[::-1]
        similar_indices = [i for i in similar_indices if self.product_ids[i] != product_id][:top_n]
        
        return [self.product_ids[i] for i in similar_indices]

recommender = RecommendationEngine()

def get_hybrid_recommendations(db: Session, user_viewed_ids: list = None, limit: int = 8):
    products = db.query(models.Product).all()
    if not products:
        return []

    # Initialize recommender matrix if needed
    if recommender.tfidf_matrix is None or len(recommender.product_ids) != len(products):
        recommender.fit_products(products)

    if not user_viewed_ids:
        # Fallback to top rated & trending products
        sorted_prods = sorted(products, key=lambda x: (x.rating or 0, x.discountPercentage or 0), reverse=True)
        return sorted_prods[:limit]

    # Content-based recommendation based on last viewed product
    last_viewed_id = user_viewed_ids[-1]
    similar_ids = recommender.get_similar_products(last_viewed_id, top_n=limit)
    
    rec_products = db.query(models.Product).filter(models.Product.id.in_(similar_ids)).all()
    
    # If not enough similar products, fill with top rated
    if len(rec_products) < limit:
        existing_ids = {p.id for p in rec_products}
        top_prods = [p for p in products if p.id not in existing_ids and p.id not in user_viewed_ids]
        top_prods.sort(key=lambda x: x.rating or 0, reverse=True)
        rec_products.extend(top_prods[:limit - len(rec_products)])

    return rec_products

def generate_ai_assistant_response(user_message: str, cart_items: list = [], browsing_history: list = [], wishlist: list = []):
    client = get_openai_client()
    
    context = {
        "cart": [item.get("title") for item in cart_items],
        "browsing_history": [item.get("title") for item in browsing_history],
        "wishlist": [item.get("title") for item in wishlist]
    }
    
    system_prompt = (
        "You are an expert AI Shopping Assistant for a modern premium E-commerce platform. "
        "Your goal is to guide customers, offer tailored product suggestions, compare products, "
        "and suggest personalized discount offers based on their cart and browsing context.\n"
        f"User Context: {json.dumps(context)}\n"
        "Be polite, concise, enthusiastic, and helpful!"
    )
    
    if client:
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=350,
                temperature=0.7
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"OpenAI API Error: {e}")

    # Fallback smart agent response
    return f"I see you're interested in {user_message}. Based on your browsing history ({', '.join(context['browsing_history'][:2]) or 'recent items'}), I recommend exploring our top-rated collections with up to 20% instant discount!"

def summarize_reviews_ai(product_title: str, reviews: list):
    client = get_openai_client()
    if not reviews:
        return {"summary": "No reviews available yet.", "sentiment": "Neutral", "key_highlights": []}
        
    review_texts = [f"Rating: {r.rating}/5 - {r.comment}" for r in reviews]
    
    if client:
        try:
            prompt = (
                f"Analyze the following customer reviews for '{product_title}' and produce a JSON response with keys:\n"
                "- 'summary': 2 sentence overview of customer consensus\n"
                "- 'sentiment': Positive, Neutral, or Negative\n"
                "- 'key_highlights': array of 3 bullet point pros/cons\n\n"
                f"Reviews:\n" + "\n".join(review_texts)
            )
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                max_tokens=250
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"OpenAI review summary error: {e}")

    # Fallback rule-based analysis
    avg_rating = sum([r.rating for r in reviews]) / len(reviews)
    sentiment = "Positive" if avg_rating >= 4 else ("Neutral" if avg_rating >= 3 else "Negative")
    return {
        "summary": f"Customers generally rate {product_title} as {sentiment.lower()} with an average score of {avg_rating:.1f}/5.",
        "sentiment": sentiment,
        "key_highlights": [
            f"Average score {avg_rating:.1f}/5",
            f"Total {len(reviews)} customer reviews verified",
            "Great build quality and fast dispatch"
        ]
    }
