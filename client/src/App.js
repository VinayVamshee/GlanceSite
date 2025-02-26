import IndexPage from "./Components/IndexPage";
import './Components/style.css'
import ReactGA from 'react-ga4';

const TRACKING_ID = 'G-B2Z721XDXX';
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
    <div className="App">
    <AnalyticsTracker />
      <IndexPage/>
    </div>
  );
}

export default App;
