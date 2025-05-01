import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { logoutUser } from "../services/authService";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <div className="text-lg font-bold">
        <Link to="/">EventEase</Link>
      </div>
      <div className="space-x-4">
        {user ? (
          <>
            <span>Welcome, {user.role}</span>
            {user.role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-blue-500 px-3 py-1 rounded">Login</Link>
            <Link to="/register" className="bg-green-500 px-3 py-1 rounded">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
