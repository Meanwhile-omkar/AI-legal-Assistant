import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DocGen from './pages/DocGen';
import Practice from './pages/Practice';

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  
  // --- ADD THESE TWO STATES ---
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-lawzy-dark text-white font-sans">
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={<Home setAnalysisData={setAnalysisData} />} 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <Dashboard 
                data={analysisData} 
                suggestions={suggestions}
                setSuggestions={setSuggestions} 
                setIsSuggestionsLoading={setIsSuggestionsLoading} 
              />
            } 
          />
          
          <Route 
            path="/generate-docs" 
            element={
              <DocGen 
                caseData={analysisData} 
                suggestions={suggestions} 
                isSuggestionsLoading={isSuggestionsLoading} 
              />
            } 
          />
          
          <Route 
            path="/practice" 
            element={<Practice caseData={analysisData} />} 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;