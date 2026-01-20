import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DocGen from './pages/DocGen';
import Practice from './pages/Practice';

function App() {
  const [analysisData, setAnalysisData] = useState(null);

  return (
    <div className="min-h-screen bg-lawzy-dark text-white font-sans">
      <Router>
        <Routes>
          <Route path="/" element={<Home setAnalysisData={setAnalysisData} />} />
          <Route path="/dashboard" element={<Dashboard data={analysisData} />} />
          <Route path="/generate-docs" element={<DocGen caseData={analysisData} />} />
          <Route path="/practice" element={<Practice caseData={analysisData} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;