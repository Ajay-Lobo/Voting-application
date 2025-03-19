import { BrowserRouter as Router } from "react-router-dom";  // ❌ REMOVE THIS

const Dashboard = () => {
  return (
    <>  {/* ❌ DO NOT NEST ANOTHER <Router> */}
      <h1>Dashboard Page</h1>
    </>
  );
};

export default Dashboard;
