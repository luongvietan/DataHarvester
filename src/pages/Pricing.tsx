
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Star, BadgeDollarSign, Database, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Limited access to built-in scrapers. Cap on requests and data export.",
    features: [
      "Access to selected pre-built scrapers",
      "Limited monthly requests or data rows",
      "Basic support (email only)",
      "Community resources",
    ],
    highlight: false,
    icon: <BadgeDollarSign className="text-primary" size={28} />,
    action: {
      text: "Get Started",
      to: "/signup",
      variant: "outline" as const,
    },
  },
  {
    name: "Basic",
    price: "$10–$20",
    period: "/month",
    description: "More power for SMBs – higher limits for built-in scrapers.",
    features: [
      "Increased request/data quota",
      "Wider pre-built scraper selection",
      "Periodic feature updates",
      "Standard support",
    ],
    highlight: false,
    icon: <Database className="text-accent" size={28} />,
    action: {
      text: "Choose Basic",
      to: "/signup",
      variant: "default" as const,
    },
  },
  {
    name: "Pro",
    price: "$50–$100",
    period: "/month",
    description: "All Basic features, add limited custom crawler tasks & priority support.",
    features: [
      "All Basic features",
      "Limited custom crawl requests",
      "Higher data limits",
      "Priority support",
      "Early access to new features",
    ],
    highlight: true,
    icon: <Star className="text-yellow-500" size={28} />,
    action: {
      text: "Go Pro",
      to: "/signup",
      variant: "default" as const,
    },
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions & support for enterprise-scale and integrations.",
    features: [
      "Unlimited large-scale crawling",
      "Dedicated infrastructure & SLAs",
      "Customized integrations",
      "Personalized onboarding",
      "Enterprise-level security & support",
    ],
    highlight: false,
    icon: <ShieldCheck className="text-green-500" size={28} />,
    action: {
      text: "Contact Sales",
      to: "/contact",
      variant: "default" as const,
    },
  },
  {
    name: "Custom Crawler",
    price: "$50–$100",
    period: "/scraper",
    description: "Build one-off scrapers for unsupported websites, priced by site complexity.",
    features: [
      "Custom scraper development",
      "Anti-crawl/complex structure supported",
      "One-time pricing per site",
      "Use with any plan",
    ],
    highlight: false,
    icon: <Wrench className="text-purple-500" size={28} />,
    action: {
      text: "Request Custom",
      to: "/contact",
      variant: "outline" as const,
    },
  },
];

export default function Pricing() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-10 bg-background animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold mb-3 text-center">
        DataHarvester Pricing Plans
      </h1>
      <CardDescription className="max-w-2xl mx-auto mb-10 text-center">
        Find a plan that fits your data needs — upgrade anytime as your business grows.<br />
        For custom requirements, please get in touch.
      </CardDescription>
      <section className="w-full max-w-6xl grid gap-7 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-12">
        {plans.map((plan, idx) => (
          <Card
            key={plan.name}
            className={`
              flex flex-col border
              ${
                plan.highlight
                  ? "border-primary shadow-xl ring-2 ring-primary/30 scale-105 z-10"
                  : "border-border shadow"
              }
              bg-card text-card-foreground relative transition-transform hover:scale-105
            `}
          >
            <CardHeader className="flex flex-col items-center pb-2 pt-6">
              <div className="mb-3">{plan.icon}</div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                {plan.name}
                {plan.highlight && (
                  <Badge variant="default" className="ml-1 bg-primary text-primary-foreground uppercase">
                    Best Value
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-end gap-1 mt-4 mb-2">
                <span className="text-3xl font-semibold">{plan.price}</span>
                {plan.period && (
                  <span className="text-base text-muted-foreground">{plan.period}</span>
                )}
              </div>
              <CardDescription className="text-center mt-2 mb-4">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="grow">
              <ul className="flex flex-col gap-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-1 text-green-500" size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-center items-center pb-6 pt-2">
              <Button
                asChild
                variant={plan.action.variant}
                size="lg"
                className={`${plan.highlight ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""} w-full`}
              >
                <Link to={plan.action.to}>{plan.action.text}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>
      <div className="text-xs text-center text-muted-foreground mb-2">
        All prices are in USD. For more details or large-scale custom requirements, contact our sales team.
      </div>
    </main>
  );
}
