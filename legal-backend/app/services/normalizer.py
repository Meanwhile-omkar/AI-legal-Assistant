from app.core.llm import call_openrouter

async def normalize_legal_query(user_input: str):
    """
    Translates regional languages to English and converts 
    layman descriptions into formal legal concepts.
    """
    prompt = f"""
    You are a legal intake specialist. 
    Task: 
    1. Detect the language of the input.
    2. Translate/Normalize it into a clear, professional English legal description.
    3. Keep it factual and concise.

    USER INPUT: "{user_input}"

    OUTPUT JSON FORMAT:
    {{
      "original_language": "...",
      "english_refined_query": "..."
    }}
    """
    try:
        response = await call_openrouter(prompt)
        return response
    except Exception as e:
        # Fallback if AI fails
        return {
            "original_language": "unknown",
            "english_refined_query": user_input
        }