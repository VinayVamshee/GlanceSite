import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import IndexPage from "./Components/IndexPage";
import './Components/style.css';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';

const TRACKING_ID = 'G-B2Z721XDXX'; 
ReactGA.initialize(TRACKING_ID);

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (ReactGA.isInitialized()) {
      ReactGA.send({ hitType: "pageview", page: location.pathname });
      console.log(`Analytics sent: ${location.pathname}`);
    } else {
      console.warn("Google Analytics not initialized");
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <Router> {/* ✅ Now wrapping the app inside BrowserRouter */}
      <div className="App">
        <AnalyticsTracker />
        <Routes>
          <Route path="/" element={<IndexPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
