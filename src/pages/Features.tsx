import { Header } from "@/components/Header";
import { FeaturesSection } from "@/components/FeaturesSection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Database,
  Download,
  FileSpreadsheet,
  FileText,
  Grid,
  MessageSquare,
  Globe,
  Bot,
  Code,
  Shield,
  Clock,
  Briefcase,
} from "lucide-react";

const Features = () => {
  const mainFeatures = [
    {
      title: "Pre-built Scrapers",
      description:
        "Ready-to-use scrapers for popular websites including Amazon, eBay, LinkedIn, and more. Get started instantly without any coding.",
      icon: Database,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      title: "Custom Scraping Requests",
      description:
        "Need a specialized solution? Submit a request and our team will build a custom scraper for your specific needs.",
      icon: MessageSquare,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
    {
      title: "Multiple Export Formats",
      description:
        "Download your data in CSV, JSON, or Excel formats to seamlessly integrate with your workflows and analysis tools.",
      icon: FileSpreadsheet,
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      title: "User-friendly Dashboard",
      description:
        "Monitor and manage all your scraping tasks from one intuitive interface. Track progress and results in real-time.",
      icon: Grid,
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
  ];

  const additionalFeatures = [
    {
      title: "Global Website Support",
      description:
        "Scrape data from websites across the globe with multi-language support.",
      icon: Globe,
    },
    {
      title: "AI-Assisted Scraping",
      description:
        "Our AI technology helps identify and extract the most relevant data from complex websites.",
      icon: Bot,
    },
    {
      title: "API Access",
      description:
        "Integrate our scraping capabilities directly into your applications with our developer-friendly API.",
      icon: Code,
    },
    {
      title: "Secure Data Handling",
      description:
        "All scraped data is securely stored and transmitted with enterprise-grade encryption.",
      icon: Shield,
    },
    {
      title: "Scheduled Scraping",
      description:
        "Set up recurring scraping tasks to automatically collect data at regular intervals.",
      icon: Clock,
    },
    {
      title: "Enterprise Solutions",
      description:
        "Custom enterprise plans with dedicated support and tailored scraping solutions for businesses.",
      icon: Briefcase,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 animate-fade-in">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for Effortless Data Collection
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              DataHarvester provides all the tools you need to efficiently
              gather, manage, and utilize data from across the web.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/scraper">Try Scraper Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Main Features Section */}
        <section className="py-20 px-4 container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            Main Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="border shadow-sm">
                <CardHeader>
                  <div
                    className={`h-12 w-12 rounded-lg ${feature.bgColor} ${feature.color} flex items-center justify-center mb-4`}
                  >
                    <feature.icon size={24} />
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section Component */}
        <FeaturesSection />

        {/* Additional Features */}
        <section className="py-20 px-4 container mx-auto bg-muted/30">
          <h2 className="text-3xl font-bold text-center mb-16">
            Additional Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className="border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <feature.icon size={20} />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Start Collecting Data?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Sign up now and start scraping data from the web in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">Create Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Features;
