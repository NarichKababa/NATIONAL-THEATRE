import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ShowsPage from './pages/ShowsPage';
import BookingPage from './pages/BookingPage';
import ArtistsPage from './pages/ArtistsPage';
import ReviewsPage from './pages/ReviewsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import LoginModal from './components/LoginModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

function AppContent() {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <BookingProvider>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <Header onLoginClick={() => setShowLoginModal(true)} />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shows" element={<ShowsPage />} />
          <Route path="/booking/:showId" element={<BookingPage />} />
          <Route path="/artists" element={<ArtistsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route 
            path="/profile" 
            element={user ? <ProfilePage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/admin" 
            element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
          />
        </Routes>

        {showLoginModal && (
          <LoginModal onClose={() => setShowLoginModal(false)} />
        )}
      </div>
    </BookingProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;