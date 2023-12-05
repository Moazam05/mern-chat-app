import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import SignUp from "./views/SignUp";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Dashboard from "./views/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/signup"
          element={
            <PublicRoutes>
              <SignUp />
            </PublicRoutes>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoutes>
              <Login />
            </PublicRoutes>
          }
        />
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
