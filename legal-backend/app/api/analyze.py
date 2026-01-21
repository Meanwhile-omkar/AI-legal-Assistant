from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import uuid
from app.services.statute_retriever import retriever
from app.core.llm import call_openrouter
from app.services.normalizer import normalize_legal_query
import uuid

router = APIRouter()

class AnalyzeRequest(BaseModel):
    query: str

@router.post("/analyze")
async def analyze_legal_issue(request: AnalyzeRequest):
    # STEP 1: Normalize & Translate (First AI Call)
    # This turns "Someone hit my car and ran" into "Hit and run accident involving property damage"
    normalization_data = await normalize_legal_query(request.query)
    refined_query = normalization_data.get("english_refined_query", request.query)
    detected_lang = normalization_data.get("original_language", "Unknown")

    # STEP 2: Local Retrieval (Keyword + Similarity)
    # Now searching using the REFINED query for better hits
    ipc_results, bns_results = retriever.retrieve(refined_query)

    # STEP 3: Final Analysis (Second AI Call)
    prompt = f"""
    You are acting as a neutral Indian legal analysis assistant whose role is to help a citizen understand
    their situation under Indian law in a calm, fair, and non-accusatory manner.

    USER QUERY: {request.query}
    REFINED LEGAL CONTEXT: {refined_query}
    
    RETRIEVED IPC SECTIONS:
    {ipc_results}
    
    RETRIEVED BNS SECTIONS:
    {bns_results}
    
    TASK:
    1. Understand the situation as described, focusing on facts rather than emotions.
    2. If IPC or BNS sections are retrieved:
      - Explain ONLY those sections.
      - Explain WHY they may apply and under WHAT conditions they would NOT apply.
    3. If no statutes are retrieved:
      - Provide a general explanation of how Indian law typically views such situations.
    4. Populate only those legal signals that are necessary and relevant to requirement of the case. Mark True based on available user facts. 
    5. Describe procedural options neutrally.
    6. Clearly state what information would strengthen legal clarity if the matter proceeds.
    
    OUTPUT REQUIREMENTS (STRICT):

    • Output MUST be valid JSON only.
    • DO NOT add markdown, headings, or commentary.
    • DO NOT change key names or structure.
    • DO NOT add extra fields.
    • Use simple, everyday language understandable by a non-lawyer.
    • Avoid legal jargon unless necessary, and explain it when used.

    {{
      "case_id": "{str(uuid.uuid4())}",
      "normalized_query": {{
        "original_text": "string",
        "language": "string",
        "english_version": "string"
      }},
      "plain_language_summary": "string",
      "ipc_sections": [{{ "section_number": "string", "title": "string", "explanation": "string" }}],
      "bns_sections": [{{ "section_number": "string", "title": "string", "explanation": "string" }}],
      "legal_signal_checklist": {{ "signal_name": bool, "signal_name": bool, "signal_name": bool, "signal_name": bool }},
      "procedural_guidance": {{
        "possible_actions": ["string"],
        "paths_explained": {{ "police_route": "string", "court_route": "string", "non_legal_resolution": "string" }}
      }},
      "missing_information": ["string"],
      "limitations": ["string"]
    }}
    Output MUST be valid JSON only.
    DO NOT add markdown, headings, or commentary.
    """
    final_analysis = await call_openrouter(prompt)
    # Inject metadata
    final_analysis["case_id"] = str(uuid.uuid4())
    final_analysis["normalized_query"] = {
        "original_text": request.query,
        "language": detected_lang,
        "english_version": refined_query
    }
    
    return final_analysis