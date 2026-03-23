import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import EnhancedMarket from './pages/EnhancedMarket';
import SkinsDatabase from './pages/SkinsDatabase';
import InventoryAnalyzer from './pages/InventoryAnalyzer';
import P2PMarket from './pages/P2PMarket';
import Profile from './pages/Profile';
import Transactions from './pages/Transactions';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <div className="p-3 md:p-6 w-full max-w-[100vw] overflow-x-hidden transition-colors duration-300">
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/market" element={<EnhancedMarket />} />
              <Route path="/skins" element={<SkinsDatabase />} />
              <Route path="/inventory" element={<InventoryAnalyzer />} />
              <Route path="/p2p-market" element={<P2PMarket />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/transactions" element={<Transactions />} />
            </Routes>
          </div>
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
