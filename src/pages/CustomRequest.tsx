import { useState, FormEvent, ChangeEvent } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowLeft,
  Upload,
  Globe,
  AlertCircle,
  Check,
  X,
  Loader2,
  Send,
  Info,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { Link, useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Validate a URL
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

const CustomRequest = () => {
  const { user } = useFirebaseAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    websiteUrl: "",
    description: "",
    email: user?.email || "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);

  // Handle input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);

      // Check file size (max 5MB per file)
      const oversizedFiles = fileArray.filter(
        (file) => file.size > 5 * 1024 * 1024
      );
      if (oversizedFiles.length > 0) {
        setError(
          `Files ${oversizedFiles
            .map((f) => f.name)
            .join(", ")} exceed the 5MB limit.`
        );
        return;
      }

      setFiles((prev) => [...prev, ...fileArray]);
      e.target.value = ""; // Reset input to allow selecting same file again
    }
  };

  // Remove a file from the list
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate input
    if (!formData.websiteUrl) {
      setError("Please enter a website URL.");
      return;
    }

    if (!isValidUrl(formData.websiteUrl)) {
      setError("Please enter a valid URL (including http:// or https://)");
      return;
    }

    if (!formData.description) {
      setError("Please describe the data you want to collect.");
      return;
    }

    if (!formData.email) {
      setError("Please enter your email.");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, here you would:
      // 1. Upload files to Firebase Storage
      // 2. Get download URLs for the files
      // 3. Store request info in Firestore

      // For now, we'll simulate this process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Sample code for storing in Firestore (commented out in demo)
      // const requestRef = await addDoc(collection(db, "customRequests"), {
      //   userId: user?.uid,
      //   websiteUrl: formData.websiteUrl,
      //   description: formData.description,
      //   email: formData.email,
      //   attachments: [], // This would be file download URLs
      //   status: "submitted",
      //   createdAt: serverTimestamp()
      // });

      // Fake requestId
      const fakeRequestId =
        "REQ-" + Math.random().toString(36).substring(2, 10).toUpperCase();
      setRequestId(fakeRequestId);
      setSuccess(true);

      toast({
        title: "Request Submitted",
        description: `Your request has been received with ID ${fakeRequestId}.`,
      });
    } catch (err) {
      console.error("Error submitting request:", err);
      setError(
        "An error occurred while submitting your request. Please try again later."
      );

      toast({
        title: "Request Error",
        description: "Unable to submit custom request. Please try again.",
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
        <Button variant="ghost" className="mb-8" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Custom Scraping Request</h1>
          <p className="text-muted-foreground mb-8">
            Submit details about the website and data you want to collect
          </p>

          {success ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-primary flex items-center justify-center">
                  <Check className="mr-2 h-5 w-5" />
                  Request submitted successfully!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4 bg-muted/50">
                  <p className="font-medium mb-2">Your request information:</p>
                  <p>
                    <span className="font-medium">Request ID:</span> {requestId}
                  </p>
                  <p>
                    <span className="font-medium">Website:</span>{" "}
                    {formData.websiteUrl}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {formData.email}
                  </p>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Next Steps</AlertTitle>
                  <AlertDescription>
                    Our team will review your request and contact you via email
                    within 24-48 hours. You can also track the status of your
                    request in the "Requests" section of your Dashboard.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={() => navigate("/dashboard")}>
                  Return to Dashboard
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Custom Request Form</CardTitle>
                <CardDescription>
                  Provide detailed information about the data you want to
                  collect
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">
                      Website URL <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="websiteUrl"
                        name="websiteUrl"
                        value={formData.websiteUrl}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter the full URL, including http:// or https://
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Data Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Detailed description of the data you want to collect (e.g., product names, prices, reviews...)"
                      rows={5}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Contact Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">Attachments (optional)</Label>
                    <div className="border rounded-lg p-4 bg-muted/20">
                      <div className="flex items-center justify-center w-full">
                        <label
                          htmlFor="file-upload"
                          className="w-full cursor-pointer"
                        >
                          <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed rounded-lg border-muted-foreground/25 hover:border-primary/50 transition-colors">
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">
                              Drag and drop files here or click to browse
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Supports PNG, JPG, PDF (max 5MB per file)
                            </p>
                          </div>
                          <Input
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            accept=".png,.jpg,.jpeg,.pdf"
                            className="hidden"
                            multiple
                          />
                        </label>
                      </div>

                      {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium">
                            Selected files ({files.length}):
                          </p>
                          <ul className="space-y-2">
                            {files.map((file, index) => (
                              <li
                                key={index}
                                className="flex items-center justify-between text-sm p-2 border rounded bg-background"
                              >
                                <span className="truncate max-w-xs">
                                  {file.name}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFile(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomRequest;
