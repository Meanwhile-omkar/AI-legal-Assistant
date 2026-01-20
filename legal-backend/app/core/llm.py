import httpx
import json
from app.core.config import settings

async def call_openrouter(prompt: str):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": settings.MODEL_NAME,
        "messages": [
            {"role": "system", "content": "You are a professional Indian Legal Consultant. You only output strictly valid JSON. You never use markdown code blocks or backticks."},
            {"role": "user", "content": prompt}
        ],
        "response_format": {"type": "json_object"}
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(url, headers=headers, json=payload)
        result = response.json()
        
        # OpenRouter returns the content as a string inside the choice
        content = result['choices'][0]['message']['content']
        # Remove markdown backticks if the model ignores the system instruction
        content = content.replace("```json", "").replace("```", "").strip()
        return json.loads(content)