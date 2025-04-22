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
import { Check, Star, BadgeDollarSign, Wrench, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description:
      "Limited access to built-in scrapers with basic functionality for simple data needs.",
    features: [
      "Access to selected pre-built scrapers",
      "Limited monthly requests or data rows",
      "Basic support (email only)",
      "Community resources",
      "Standard update frequency",
    ],
    highlight: false,
    icon: <BadgeDollarSign className="text-primary" size={32} />,
    action: {
      text: "Get Started",
      to: "/signup",
      variant: "outline" as const,
    },
    bgClass: "bg-card",
  },
  {
    name: "Pro",
    price: "$30–$80",
    period: "/month",
    description:
      "Complete solution for businesses with higher data needs and premium support.",
    features: [
      "Unlimited data extraction",
      "All pre-built scrapers included",
      "Custom crawl requests",
      "Priority support",
      "Early access to new features",
      "Higher API request limits",
    ],
    highlight: true,
    icon: <Star className="text-yellow-500" size={32} />,
    action: {
      text: "Go Pro",
      to: "/signup",
      variant: "default" as const,
    },
    bgClass: "bg-primary/5",
  },
  {
    name: "Custom",
    price: "Custom",
    period: "",
    description:
      "Tailored solutions for enterprise needs or custom scraper development.",
    features: [
      "Enterprise-level support & SLAs",
      "Custom scraper development",
      "Anti-crawl/complex structure support",
      "Personalized onboarding",
      "Dedicated infrastructure",
      "Custom integrations available",
    ],
    highlight: false,
    icon: <Wrench className="text-purple-500" size={32} />,
    action: {
      text: "Contact Us",
      to: "/contact",
      variant: "outline" as const,
    },
    bgClass: "bg-card",
  },
];

// Bảng so sánh tính năng
const featureComparison = [
  {
    feature: "Data extraction limit",
    free: "500 rows/day",
    pro: "Unlimited",
    custom: "Unlimited",
  },
  {
    feature: "Pre-built scrapers",
    free: "Limited selection",
    pro: "Full access",
    custom: "Full access + custom",
  },
  {
    feature: "Support level",
    free: "Email only",
    pro: "Priority",
    custom: "Dedicated team",
  },
  {
    feature: "API requests",
    free: "100/day",
    pro: "10,000/day",
    custom: "Custom limits",
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex flex-col items-center justify-center px-4 py-10 bg-background animate-fade-in flex-1">
        <div className="max-w-6xl w-full mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 text-center">
            Chọn gói phù hợp cho bạn
          </h1>
          <CardDescription className="max-w-2xl mx-auto mb-10 text-center text-lg">
            Tìm gói phù hợp với nhu cầu dữ liệu của bạn — nâng cấp bất kỳ lúc
            nào khi doanh nghiệp phát triển.
          </CardDescription>

          {/* Pricing cards */}
          <section className="w-full grid gap-6 grid-cols-1 md:grid-cols-3 mb-16">
            {plans.map((plan, idx) => (
              <Card
                key={plan.name}
                className={`
                  flex flex-col border rounded-xl
                  ${
                    plan.highlight
                      ? "border-primary shadow-xl ring-1 ring-primary scale-105 z-10"
                      : "border-border shadow-md"
                  }
                  ${
                    plan.bgClass
                  } text-card-foreground relative transition-all duration-300 hover:shadow-lg
                `}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <Badge
                      variant="default"
                      className="bg-primary text-primary-foreground uppercase px-4 py-1 text-xs font-semibold"
                    >
                      Phổ biến nhất
                    </Badge>
                  </div>
                )}
                <CardHeader className="flex flex-col items-center pb-2 pt-8">
                  <div className="mb-4 p-3 rounded-full bg-background">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    {plan.name}
                  </CardTitle>
                  <div className="flex items-end gap-1 mt-4 mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-base text-muted-foreground mb-1">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-center mt-2 mb-4 min-h-[60px]">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grow px-6">
                  <ul className="flex flex-col gap-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm"
                      >
                        <Check
                          className="mt-0.5 text-green-500 flex-shrink-0"
                          size={18}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-center items-center pb-8 pt-6 px-6">
                  <Button
                    asChild
                    variant={plan.action.variant}
                    size="lg"
                    className={`${
                      plan.highlight
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : ""
                    } w-full py-6 text-lg font-medium rounded-lg`}
                  >
                    <Link to={plan.action.to}>{plan.action.text}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </section>

          {/* Feature comparison table */}
          <section className="w-full mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">
              So sánh tính năng các gói
            </h2>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-4 font-medium">Tính năng</th>
                    <th className="text-center p-4 font-medium">Free</th>
                    <th className="text-center p-4 font-medium bg-primary/5">
                      Pro
                    </th>
                    <th className="text-center p-4 font-medium">Custom</th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map((item, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-card" : "bg-background"}
                    >
                      <td className="p-4 border-t border-border">
                        {item.feature}
                      </td>
                      <td className="p-4 text-center border-t border-border">
                        {item.free}
                      </td>
                      <td className="p-4 text-center border-t border-border bg-primary/5">
                        {item.pro}
                      </td>
                      <td className="p-4 text-center border-t border-border">
                        {item.custom}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="w-full mb-12">
            <div className="flex items-center gap-2 justify-center mb-6">
              <Info size={20} className="text-muted-foreground" />
              <h2 className="text-2xl font-bold text-center">
                Câu hỏi thường gặp
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">
                  Tôi có thể đổi gói sau khi đăng ký không?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Có, bạn có thể nâng cấp hoặc hạ cấp gói của mình bất kỳ lúc
                  nào thông qua trang cài đặt tài khoản.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-2">
                  Có thời gian dùng thử không?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tất cả các gói Pro đều có thời gian dùng thử 14 ngày với đầy
                  đủ tính năng.
                </p>
              </Card>
            </div>
          </section>
        </div>

        <div className="text-sm text-center text-muted-foreground mb-4">
          Tất cả giá được tính bằng USD. Liên hệ với đội ngũ bán hàng của chúng
          tôi để biết thêm chi tiết.
        </div>
      </main>
    </div>
  );
}
