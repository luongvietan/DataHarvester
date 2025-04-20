
import { Header } from "@/components/Header";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-4">Contact DataHarvester</h1>
        <p>If you need custom scraping or support, please use the form here (coming soon).</p>
      </main>
    </div>
  );
};

export default Contact;
