from app.core.llm import call_openrouter

class DocumentEngine:
    async def suggest_documents(self, case_data: dict):
        """Step 1: Suggest 3-5 document types based on analysis"""
        prompt = f"""
        Based on this Indian legal analysis, suggest 3 to 5 specific documents the user needs.
        CASE: {case_data['normalized_query']['english_version']}
        SECTIONS: {case_data['ipc_sections']} {case_data['bns_sections']}
        
        Return ONLY a JSON list of objects with 'title' and 'description'.
        Example: {{"suggestions": [{{"title": "Police Complaint", "description": "short description"}}]}}
        """
        return await call_openrouter(prompt)

    async def generate_content(self, case_data: dict, doc_title: str):
        """Step 2: Draft the actual document content"""
        prompt = f"""
        You are a legal drafting expert in India. 
        Draft a formal '{doc_title}' for the following case:
        
        CASE DETAILS: {case_data['normalized_query']['english_version']}
        LEGAL SECTIONS: {case_data['ipc_sections']} and {case_data['bns_sections']}
        PROCEDURAL GOAL: {case_data['procedural_guidance']['possible_actions']}
        
        INSTRUCTIONS:
        1. Use a professional, official tone.
        2. Use "________" for any missing personal details (Name, Address, Phone).
        3. Mention the specific IPC and BNS sections retrieved.
        4. Format it clearly as a Letter or Legal Notice.
        5. DO NOT use markdown backticks. Return ONLY the text.
        6. DO NOT make very Lengthy but also include important things.
        
        Format the response as a JSON object: {{"document_text": "..."}}
        """
        return await call_openrouter(prompt)

doc_engine = DocumentEngine()