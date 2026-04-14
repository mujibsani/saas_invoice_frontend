import DashboardContent from "../components/DashboardComponent";
const Dashboard = () => {
  console.log(localStorage.getItem("authToken"));
  return (
    <div className="flex">
      <DashboardContent />
    </div>
    
  );
};

export default Dashboard;