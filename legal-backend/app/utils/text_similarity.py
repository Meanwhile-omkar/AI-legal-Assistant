import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

def get_top_k_matches(query: str, df: pd.DataFrame, top_k: int = 3):
    if df.empty:
        return []
    
    # Identify which columns we actually have
    available_cols = [c for c in ['title', 'short_description', 'full_legal_text'] if c in df.columns]
    
    if not available_cols:
        return []

    # Create corpus safely
    corpus = df[available_cols].fillna('').agg(' '.join, axis=1).tolist()
    
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(corpus)
        query_vec = vectorizer.transform([query])
        
        similarities = cosine_similarity(query_vec, tfidf_matrix).flatten()
        
        # Get indices of top matches that have a score > 0.1 (relevance threshold)
        top_indices = similarities.argsort()[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            if similarities[idx] > 0.05: # Slight threshold to filter garbage
                item = df.iloc[idx].to_dict()
                # Clean up the output dict for the API
                results.append({
                    "section_number": str(item.get('section_number', 'N/A')),
                    "title": str(item.get('title', 'Unknown')),
                    "full_legal_text": str(item.get('full_legal_text', ''))[:200] + "..." 
                })
        return results
    except:
        return []