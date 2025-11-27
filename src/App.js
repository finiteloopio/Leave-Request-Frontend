import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import LeaveManagement from "./pages/LeaveManagement";
import Notifications from "./pages/Notifications";
import BottomNavigation from "./components/common/BottomNavigation";
import EmployeeInfo from "./components/common/EmployeeInfo";
import ExpenseManagement from "./pages/ExpenseManagement";
import TeamRequestMain from "./pages/TeamRequestMain";
import HistoryPage from "./components/LeaveManagement/HistoryPage";
import RequestHistory from "./components/Request/RequestHistory";
import ApplyPage from "./components/LeaveManagement/ApplyPage";
import WFH from "./pages/WFH";
import LoginPage from "./pages/LoginPage";
import "./App.css";

function App() {
  const { user, login, logout, loading } = useContext(AuthContext);
  const isAuthenticated = !!user;

  const handleLogout = () => {
    logout();
  };

  const handleProfileClick = () => {
    console.log("Profile clicked");
  };

  // PrivateRoute wrapper for protected pages
  const PrivateRoute = ({ element }) => {
    if (loading) return <div className="loading">Loading...</div>;
    return isAuthenticated ? element : <Navigate to="/login" replace />;
  };

  // Callback function to handle successful login from LoginPage
  const handleLoginSuccess = (userData, token) => {
    login(userData, token);
  };

  return (
    <Router>
      {isAuthenticated && user && (
        <div className="app">
          <EmployeeInfo
            name={user?.name || "Employee"}
            role={user?.role || "Employee"}
            onProfileClick={handleProfileClick}
            onLogout={handleLogout}
          />
        </div>
      )}
      <main className="app-content">
        <Routes>
          {/* Login route passes handleLoginSuccess to LoginPage */}
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />

          {/* Protected routes */}
          <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/leave-management" element={<PrivateRoute element={<LeaveManagement />} />} />
          <Route path="/notifications" element={<PrivateRoute element={<Notifications />} />} />
          <Route path="/expense-management" element={<PrivateRoute element={<ExpenseManagement />} />} />
          <Route path="/wfh" element={<PrivateRoute element={<WFH />} />} />
          <Route path="/team-requests" element={<PrivateRoute element={<TeamRequestMain />} />} />
          <Route path="/leave-history" element={<PrivateRoute element={<HistoryPage />} />} />
          <Route path="/apply" element={
            <PrivateRoute element={
              <div className="leave-management-container">
                <div className="leave-management-content">
                  <div className="main-content">
                    <ApplyPage />
                  </div>
                </div>
              </div>
            } />
          } />
          <Route path="/request-history" element={<PrivateRoute element={<RequestHistory />} />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </main>

      {/* Bottom navigation visible only when logged in */}
      {isAuthenticated && <BottomNavigation />}
    </Router>
  );
}

export default App;