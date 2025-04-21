import { useState, FormEvent } from "react";
import { Header } from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Check,
  Loader2,
  Mail,
  MessageSquare,
  Send,
  User,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { user } = useFirebaseAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!formData.name.trim()) {
      setError(t("contact.name") + " " + t("contact.required"));
      return;
    }

    if (!formData.email.trim()) {
      setError(t("contact.email") + " " + t("contact.required"));
      return;
    }

    if (!formData.message.trim()) {
      setError(t("contact.message") + " " + t("contact.required"));
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real application, we would send this data to a backend API
      // For demonstration, we'll simulate a successful submission after a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);

      toast({
        title: t("contact.success.title"),
        description: t("contact.success.desc"),
      });
    } catch (err) {
      console.error("Error sending message:", err);
      setError(t("errors.general"));

      toast({
        title: t("contact.error"),
        description: t("errors.general"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 animate-fade-in">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{t("contact.title")}</h1>
          <p className="text-muted-foreground mb-8">{t("contact.subtitle")}</p>

          {success ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Check className="mr-2 h-5 w-5" />
                  {t("contact.success.title")}
                </CardTitle>
                <CardDescription>{t("contact.success.desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{t("contact.success.detail")}</p>
                <Alert>
                  <MessageSquare className="h-4 w-4" />
                  <AlertTitle>{t("contact.success.whatsNext")}</AlertTitle>
                  <AlertDescription>
                    {t("contact.success.whatsNextDesc")}
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setSuccess(false)}>
                  {t("contact.success.sendAnother")}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{t("contact.form.title")}</CardTitle>
                <CardDescription>{t("contact.form.desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        {t("contact.name")}{" "}
                        <span className="text-red-500">
                          {t("contact.required")}
                        </span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder={t("contact.namePlaceholder")}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {t("contact.email")}{" "}
                        <span className="text-red-500">
                          {t("contact.required")}
                        </span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={t("contact.emailPlaceholder")}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">{t("contact.subject")}</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t("contact.subjectPlaceholder")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      {t("contact.message")}{" "}
                      <span className="text-red-500">
                        {t("contact.required")}
                      </span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t("contact.messagePlaceholder")}
                      rows={6}
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>{t("contact.error")}</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("contact.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {t("contact.submit")}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-medium mb-2">
                {t("contact.emailUs")}
              </h3>
              <p className="text-muted-foreground mb-4">
                {t("contact.generalInquiries")}
              </p>
              <p className="text-sm">{t("contact.emailSupport")}</p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-medium mb-2">Custom Scraping</h3>
              <p className="text-muted-foreground mb-4">
                Need a specialized scraping solution?
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="/custom-request">Request Custom Scraping</a>
              </Button>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-medium mb-2">Documentation</h3>
              <p className="text-muted-foreground mb-4">
                Check our guides and API documentation
              </p>
              <Button variant="outline" className="w-full">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
