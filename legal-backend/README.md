# Legal Assistance Platform Backend (India)

A stateless FastAPI backend for processing Indian legal queries in English and regional languages, mapping them to IPC (Indian Penal Code) and the new BNS (Bharatiya Nyaya Sanhita).

## Architecture
- **Stateless**: No database or session storage.
- **Retrieval**: TF-IDF similarity matching against bundled CSV datasets.
- **AI**: Single-call logic via OpenRouter (Mimo-v2-flash).
- **Laws**: Covers both IPC and BNS for the transitional legal period in India.

## Deployment on Render
1. Create a new **Web Service**.
2. Connect this repository.
3. Use Environment Variable: `OPENROUTER_API_KEY`.
4. Build Command: `pip install -r requirements.txt`.
5. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port 10000`.

## Local Setup
1. `pip install -r requirements.txt`
2. Create `.env` from `.env.example`.
3. Place `ipc_sections.csv` and `bns_sections.csv` in the `data/` folder.
4. Run: `uvicorn app.main:app --reload`