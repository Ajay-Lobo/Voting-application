import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-blue-600 text-white h-screen p-6">
      <h2 className="text-2xl font-bold">Voting App</h2>
      <nav className="mt-6">
        <Link to="/dashboard" className="block py-2 px-4 hover:bg-blue-500 rounded">🏠 Dashboard</Link>
        <Link to="/profile" className="block py-2 px-4 hover:bg-blue-500 rounded">👤 Profile</Link>
        <Link to="/results" className="block py-2 px-4 hover:bg-blue-500 rounded">📊 Results</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
