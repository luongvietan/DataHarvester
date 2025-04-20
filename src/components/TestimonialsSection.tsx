
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "DataHarvester has revolutionized our market research process. We can collect thousands of data points in minutes, not days.",
    author: "Sarah Johnson",
    title: "Marketing Director, TechInsights",
  },
  {
    quote: "The custom scraping service saved our team countless hours. Their support team built exactly what we needed and delivered it ahead of schedule.",
    author: "Michael Chen",
    title: "Data Analyst, GlobalStats",
  },
  {
    quote: "Clean interface, reliable results, and excellent documentation. DataHarvester is now an essential part of our research toolkit.",
    author: "Emma Rodriguez",
    title: "Lead Researcher, Academia Institute",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover how DataHarvester is helping businesses and researchers streamline their data collection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="mb-4 text-4xl text-primary">"</div>
                <blockquote className="text-lg mb-6 italic">
                  {testimonial.quote}
                </blockquote>
                <div className="mt-auto">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
