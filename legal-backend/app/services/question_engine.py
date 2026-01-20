from app.core.llm import call_openrouter

class QuestionEngine:
    def _build_context(self, case_data: dict):
        # Maps the analysis JSON to a simplified context for the LLM
        return {
            "issue": case_data['normalized_query']['english_version'],
            "summary": case_data['plain_language_summary'],
            "laws": [s['title'] for s in case_data['ipc_sections'] + case_data['bns_sections']],
            "actions": case_data['procedural_guidance']['possible_actions']
        }

    async def generate_flashcards(self, case_data: dict):
        context = self._build_context(case_data)
        
        prompt = f"""
        You are a senior Indian Police Officer or a Court Cross-Examiner.
        Based on this case context, generate 10 progressive questions to test the user's readiness.

        CONTEXT:
        {context}

        STRUCTURE:
        - Questions 1-3: Basic Facts (What happened, when, where?)
        - Questions 4-6: Evidence & Consistency (How can you prove this? Why did you do X?)
        - Questions 7-9: Credibility & Pressure (The other party says Y, why should we believe you?)
        - Question 10: Worst-case / Hardest question.

        RULES:
        - Output ONLY JSON.
        - Do not use markdown backticks.
        - Categories: "Basic Fact", "Evidence", "Credibility", "Worst Case".
        - Difficulty: 1 to 5.

        JSON FORMAT:
        {{
          "cards": [
            {{
              "category": "category_name",
              "question": "The actual question?",
              "purpose": "Why the authority is asking this",
              "difficulty": 1
            }}
          ]
        }}
        """
        return await call_openrouter(prompt)

question_engine = QuestionEngine()