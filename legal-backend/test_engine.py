import sys
import os
import json
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Imports
try:
    from app.services.normalizer import normalize_legal_query
    from app.services.statute_retriever import retriever
    from app.core.llm import call_openrouter
    from app.core.config import settings
    print("✅ System modules loaded successfully.")
except ImportError as e:
    print(f"❌ Import Error: {e}")
    sys.exit(1)

# Terminal colors
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

async def run_full_engine_test():
    print(f"\n{Colors.BOLD}--- 🧠 LEGAL AI ENGINE FULL TEST ---{Colors.END}")

    # 1️⃣ Environment Check
    print(f"\n{Colors.BOLD}[1/5] Environment Check{Colors.END}")
    if not settings.OPENROUTER_API_KEY:
        print(f"{Colors.RED}❌ OPENROUTER_API_KEY missing{Colors.END}")
        return
    print(f"{Colors.GREEN}✅ API Key detected{Colors.END}")

    # 2️⃣ Dataset Check
    print(f"\n{Colors.BOLD}[2/5] Dataset Validation{Colors.END}")
    if retriever.ipc_df.empty or retriever.bns_df.empty:
        print(f"{Colors.YELLOW}⚠️ CSV files missing or empty{Colors.END}")
    else:
        print(f"{Colors.GREEN}✅ IPC Rows: {len(retriever.ipc_df)}{Colors.END}")
        print(f"{Colors.GREEN}✅ BNS Rows: {len(retriever.bns_df)}{Colors.END}")

    # 3️⃣ User Input
    print(f"\n{Colors.BLUE}{Colors.BOLD}Enter legal query (Hindi / English):{Colors.END}")
    raw_query = input("Query > ").strip()
    if not raw_query:
        print(f"{Colors.RED}❌ Empty query. Exiting.{Colors.END}")
        return

    # 4️⃣ Normalization
    print(f"\n{Colors.BOLD}[3/5] Normalizing Query{Colors.END}")
    norm = await normalize_legal_query(raw_query)
    refined_query = norm["english_refined_query"]
    print(f"{Colors.GREEN}Refined Query:{Colors.END} {refined_query}")

    # 5️⃣ Retrieval
    print(f"\n{Colors.BOLD}[4/5] Statute Retrieval{Colors.END}")
    ipc_matches, bns_matches = retriever.retrieve(refined_query)
    print(f"IPC Matches: {len(ipc_matches)}")
    print(f"BNS Matches: {len(bns_matches)}")

    # 6️⃣ LLM Reasoning
    print(f"\n{Colors.BOLD}[5/5] LLM Legal Reasoning{Colors.END}")
    prompt = f"""
    Analyze the Indian legal problem and respond strictly in JSON.

    ORIGINAL QUERY: {raw_query}
    NORMALIZED QUERY: {refined_query}

    IPC MATCHES: {ipc_matches}
    BNS MATCHES: {bns_matches}

    Output fields:
    case_id,
    normalized_query,
    plain_language_summary,
    ipc_sections,
    bns_sections,
    legal_signal_checklist,
    procedural_guidance,
    missing_information,
    limitations
    """

    response = await call_openrouter(prompt)

    print(f"\n{Colors.GREEN}{Colors.BOLD}--- FINAL LEGAL JSON OUTPUT ---{Colors.END}")
    print(json.dumps(response, indent=2, ensure_ascii=False))

    print(f"\n{Colors.GREEN}✅ FULL ENGINE TEST COMPLETED SUCCESSFULLY{Colors.END}")

if __name__ == "__main__":
    asyncio.run(run_full_engine_test())
