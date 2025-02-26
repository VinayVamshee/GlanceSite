import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import IndexPage from "./Components/IndexPage";
import './Components/style.css';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';

const TRACKING_ID = 'G-B2Z721XDXX'; // Replace with your real GA ID
ReactGA.initialize(TRACKING_ID);

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <div className="App">
        <AnalyticsTracker />
        <Routes>
          <Route path="/" element={<IndexPage />} />
          {/* Add more routes if needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
