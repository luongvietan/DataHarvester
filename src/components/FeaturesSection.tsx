import {
  Database,
  Download,
  FileSpreadsheet,
  FileText,
  Grid,
  MessageSquare,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      title: t("features.prebuilt.title"),
      description: t("features.prebuilt.desc"),
      icon: Database,
    },
    {
      title: t("features.custom.title"),
      description: t("features.custom.desc"),
      icon: MessageSquare,
    },
    {
      title: t("features.export.title"),
      description: t("features.export.desc"),
      icon: FileSpreadsheet,
    },
    {
      title: t("features.dashboard.title"),
      description: t("features.dashboard.desc"),
      icon: Grid,
    },
    {
      title: t("features.docs.title"),
      description: t("features.docs.desc"),
      icon: FileText,
    },
    {
      title: t("features.bulk.title"),
      description: t("features.bulk.desc"),
      icon: Download,
    },
  ];

  return (
    <section id="features" className="py-20 px-4 md:px-6 lg:px-8 bg-muted/50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {t("features.title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border border-border/50 bg-card transition-all duration-300 hover:shadow-md hover:border-border"
            >
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
