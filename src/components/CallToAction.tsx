import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";

export function CallToAction() {
  const { user } = useFirebaseAuth();

  // Điều hướng dựa trên trạng thái đăng nhập
  const getStartedPath = user ? "/dashboard" : "/signup";

  return (
    <section id="contact" className="py-20 px-4 md:px-6 lg:px-8 bg-primary/5">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to Start Harvesting Data?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of businesses and researchers who use DataHarvester
            to collect and analyze web data efficiently and ethically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to={getStartedPath}>Get Started for Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Request a Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
