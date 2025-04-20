
import { Header } from "@/components/Header";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p>Welcome to DataHarvester. This dashboard will soon show your tasks and data.</p>
      </main>
    </div>
  );
};

export default Dashboard;
