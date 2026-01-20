import pandas as pd
import os
from app.utils.text_similarity import get_top_k_matches

class StatuteRetriever:
    def __init__(self):
        self.ipc_df = pd.DataFrame()
        self.bns_df = pd.DataFrame()
        self.load_data()

    def load_data(self):
        try:
            # Load IPC
            ipc_path = "data/ipc_sections.csv"
            if os.path.exists(ipc_path):
                self.ipc_df = pd.read_csv(ipc_path)
                # IPC already has 'title', 'section_number', 'full_legal_text' 
                # based on your description. Ensure they are strings.
                for col in ['title', 'section_number', 'full_legal_text']:
                    if col in self.ipc_df.columns:
                        self.ipc_df[col] = self.ipc_df[col].astype(str)
                print("✅ IPC Data Loaded")
            
            # Load BNS
            bns_path = "data/bns_sections.csv"
            if os.path.exists(bns_path):
                df_b = pd.read_csv(bns_path)
                
                # YOUR BNS COLUMNS: Chapter, Chapter_name, Chapter_subtype, Section, Section _name, Description
                # Mapping them to our internal standard
                mapping = {
                    'Section': 'section_number',
                    'Section _name': 'title', # Note the space you mentioned
                    'Section_name': 'title',  # Fallback
                    'Description': 'full_legal_text'
                }
                
                self.bns_df = df_b.rename(columns=mapping)
                
                # Ensure missing columns needed for similarity logic exist
                if 'title' not in self.bns_df.columns and 'Section _name' in df_b.columns:
                    self.bns_df['title'] = df_b['Section _name']
                
                if 'short_description' not in self.bns_df.columns:
                    self.bns_df['short_description'] = self.bns_df['title']

                for col in ['title', 'section_number', 'full_legal_text']:
                    if col in self.bns_df.columns:
                        self.bns_df[col] = self.bns_df[col].astype(str).fillna('')
                
                print("✅ BNS Data Loaded")

        except Exception as e:
            print(f"❌ Critical Error loading CSVs: {str(e)}")
            # Print columns to help debug
            if 'df_b' in locals(): print(f"BNS Columns found: {df_b.columns.tolist()}")

    def retrieve(self, query: str):
        # Even if query is civil, we try to find the closest criminal matches 
        # (like Trespass or Fraud) if they exist.
        ipc_matches = get_top_k_matches(query, self.ipc_df)
        bns_matches = get_top_k_matches(query, self.bns_df)
        return ipc_matches, bns_matches

retriever = StatuteRetriever()