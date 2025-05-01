import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvent.jsx";
import AllEvents from './pages/AllEvents.jsx';
import UpcomingEvents from './pages/UpcomingEvents.jsx';
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import Profile from './pages/Profile.jsx';
import TicketPurchase from './pages/TicketPurchase.jsx';
import AboutUs from './pages/AboutUs.jsx';
import ContactUs from './pages/ContactUs.jsx';
import BuyTicket from './pages/BuyTicket.jsx';
import JoinWaitlist from './pages/JoinWaitlist.jsx';
import AdminWaitlist from './pages/AdminWaitlist.jsx';
import EventList from './pages/EventList.jsx';
import ManageUsers from './pages/ManageUsers.jsx';
import EventDetails from './pages/EventDetails.jsx';
import ForgotPassword from './pages/ForgotPassword';
import OAuthSuccess from './pages/OAuthSuccess'; // new


// Components
import AdminHeader from './componets/Header/AdminHeader.jsx';
import UserHeader from './componets/Header/UserHeader.jsx';
import Footer from "./componets/Footer/Footer.jsx";
import ErrorBoundary from './componets/ErrorBoundary.jsx';

// Context
import { AuthContext } from './context/AuthContext';

// Styles
import "./index.css";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <ErrorBoundary>
        {/* Show different headers for admin and user */}
        {user?.role === 'admin' ? <AdminHeader /> : <UserHeader />}

        <div className="app-layout">
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/upcoming-events" element={<UpcomingEvents />} />
              <Route path="/all-events" element={<AllEvents />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/oauth-success" element={<OAuthSuccess />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/purchase" element={<TicketPurchase />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/buy-ticket/:id" element={<BuyTicket />} />
              <Route path="/waitlist/:id" element={<JoinWaitlist />} />
              <Route path="/admin/waitlist/:eventId" element={<AdminWaitlist />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/admin/manage-users" element={<ManageUsers />} />
              <Route path="/admin/event/:id" element={<EventDetails />} />
              

            </Routes>
          </main>

          <Footer />
        </div>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
