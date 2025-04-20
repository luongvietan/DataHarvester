
import { 
  Database, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Grid, 
  MessageSquare 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Pre-built Scrapers",
    description: "Ready-to-use scrapers for popular websites including Amazon, eBay, LinkedIn, and more.",
    icon: Database,
  },
  {
    title: "Custom Scraping Requests",
    description: "Need a specialized solution? Submit a request and our team will build a custom scraper for you.",
    icon: MessageSquare,
  },
  {
    title: "Multiple Export Formats",
    description: "Download your data in CSV, JSON, or Excel formats to seamlessly integrate with your workflows.",
    icon: FileSpreadsheet,
  },
  {
    title: "User-friendly Dashboard",
    description: "Monitor and manage all your scraping tasks from one intuitive interface.",
    icon: Grid,
  },
  {
    title: "Detailed Documentation",
    description: "Comprehensive guides and API documentation to help you get the most out of DataHarvester.",
    icon: FileText,
  },
  {
    title: "Bulk Downloads",
    description: "Efficiently download large datasets with our optimized bulk download feature.",
    icon: Download,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 md:px-6 lg:px-8 bg-muted/50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Powerful Features for Data Collection
          </h2>
          <p className="text-lg text-muted-foreground">
            DataHarvester provides all the tools you need to efficiently gather and manage data
            from across the web.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border border-border/50 bg-card transition-all duration-300 hover:shadow-md hover:border-border">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <feature.icon size={24} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
