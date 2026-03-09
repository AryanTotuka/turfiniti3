import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Venues from './pages/Venues';
import VenueDetails from './pages/VenueDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Payment from './pages/Payment';
import OwnerDashboard from './pages/OwnerDashboard';
import PartnerWithUs from './pages/PartnerWithUs';
import RefundPolicy from './pages/RefundPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import MyBookings from './pages/MyBookings';
import PlayerProfile from './pages/PlayerProfile';
import MyProfile from './pages/MyProfile';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { VenueProvider } from './context/VenueContext';

import { useEffect } from 'react';
import { seedDemoUser } from './utils/seedDemoUser';
import { seedDemoPlayer } from './utils/seedDemoPlayer';
import { seedJaipurOwner } from './utils/seedJaipurOwner';

function App() {
  useEffect(() => {
    // seedDemoUser();
    // seedDemoPlayer();
    // seedJaipurOwner();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <VenueProvider>
          <div className="app">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/venues" element={<Venues />} />
              <Route path="/venues/:id" element={<VenueDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/owner-dashboard" element={<OwnerDashboard />} />
              <Route path="/player/:id" element={<PlayerProfile />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/my-profile" element={<MyProfile />} />
              <Route path="/partner" element={<PartnerWithUs />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
            </Routes>

            {/* Footer */}
            <Footer />
          </div>
        </VenueProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
