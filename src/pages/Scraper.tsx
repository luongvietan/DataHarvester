import { useState } from "react";
import { Header } from "@/components/Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  FileJson,
  FileSpreadsheet,
  FileType,
  Globe,
  AlertCircle,
  Loader2,
  Info,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { useAuth } from "@/context/AuthContext";
import { useMemo } from "react";
import { usePagination } from "@/hooks/use-pagination";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Websites supported for scraping
const SUPPORTED_WEBSITES = [
  {
    id: "amazon",
    name: "Amazon",
    fields: ["title", "price", "rating", "reviews", "description"],
  },
  {
    id: "ebay",
    name: "eBay",
    fields: ["title", "price", "condition", "location", "shipping"],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    fields: ["title", "company", "location", "description", "requirements"],
  },
  {
    id: "google",
    name: "Google Search",
    fields: ["title", "url", "description", "relatedLinks"],
  },
  {
    id: "tripadvisor",
    name: "Tripadvisor",
    fields: ["name", "rating", "reviews", "address", "amenities"],
  },
  {
    id: "indeed",
    name: "Indeed",
    fields: ["title", "company", "location", "salary", "description"],
  },
  {
    id: "yellowpages",
    name: "Yellow Pages",
    fields: ["name", "phone", "address", "category", "website"],
  },
  {
    id: "etsy",
    name: "Etsy",
    fields: ["title", "price", "shop", "rating", "shipping"],
  },
  {
    id: "craigslist",
    name: "Craigslist",
    fields: ["title", "price", "location", "date", "description"],
  },
  {
    id: "twitter",
    name: "Twitter/X",
    fields: ["tweet", "username", "date", "likes", "retweets"],
  },
];

const Scraper = () => {
  const { user } = useFirebaseAuth();
  const { toast } = useToast();
  const [selectedWebsite, setSelectedWebsite] = useState<string>("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [customParams, setCustomParams] = useState<Record<string, string>>({
    searchTerm: "",
    resultsLimit: "50",
    searchLocation: "",
  });
  const [scraping, setScraping] = useState(false);
  const [progress, setProgress] = useState(0);

  // Define type for scraping results
  type ScrapingResult = Record<string, string | number>;

  const [results, setResults] = useState<ScrapingResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("configure");

  // Handle website selection change
  const handleWebsiteChange = (value: string) => {
    setSelectedWebsite(value);
    setSelectedFields([]);
    setCustomParams({
      searchTerm: "",
      resultsLimit: "50",
      searchLocation: "",
    });
    setError(null);
  };

  // Toggle field selection
  const toggleField = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  // Update custom parameter
  const updateParam = (key: string, value: string) => {
    setCustomParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Start scraping process
  const startScraping = async () => {
    if (!selectedWebsite) {
      setError("Please select a website to start scraping.");
      return;
    }

    if (selectedFields.length === 0) {
      setError("Please select at least one data field to collect.");
      return;
    }

    if (!customParams.searchTerm && selectedWebsite !== "yellowpages") {
      setError("Please enter a search term.");
      return;
    }

    setScraping(true);
    setError(null);
    setProgress(0);
    setResults([]);
    setActiveTab("results");

    try {
      // Simulate scraping progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        // Wait 500ms between progress updates
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Generate mock results
      const mockResults = Array.from({ length: 5 }, (_, i) => {
        const website = SUPPORTED_WEBSITES.find(
          (w) => w.id === selectedWebsite
        );
        const result: ScrapingResult = { id: `result-${i + 1}` };

        selectedFields.forEach((field) => {
          switch (field) {
            case "title":
              result[field] = `Sample ${website?.name} Item ${i + 1}`;
              break;
            case "price":
              result[field] = `$${(Math.random() * 100).toFixed(2)}`;
              break;
            case "rating":
              result[field] = `${(Math.random() * 5).toFixed(1)} / 5`;
              break;
            case "reviews":
              result[field] = Math.floor(Math.random() * 1000);
              break;
            default:
              result[field] = `Sample ${field} data for item ${i + 1}`;
          }
        });

        return result;
      });

      setResults(mockResults);
      toast({
        title: "Scraping completed",
        description: `Collected ${mockResults.length} data items from ${selectedWebsite}.`,
      });
    } catch (err) {
      setError(
        "An error occurred during the scraping process. Please try again later."
      );
      toast({
        title: "Scraping error",
        description: "Unable to complete the data scraping process.",
        variant: "destructive",
      });
    } finally {
      setScraping(false);
    }
  };

  // Download results in different formats
  const downloadResults = (format: "csv" | "json" | "excel") => {
    if (results.length === 0) return;

    let content = "";
    let filename = `${selectedWebsite}_data`;

    if (format === "json") {
      content = JSON.stringify(results, null, 2);
      filename += ".json";
    } else if (format === "csv") {
      // Convert to CSV
      const headers = Object.keys(results[0]).join(",");
      const rows = results.map((row) => Object.values(row).join(","));
      content = [headers, ...rows].join("\n");
      filename += ".csv";
    } else {
      // In a real app, we'd use a library to create Excel files
      // For now, provide CSV as a fallback
      const headers = Object.keys(results[0]).join(",");
      const rows = results.map((row) => Object.values(row).join(","));
      content = [headers, ...rows].join("\n");
      filename += ".xlsx";
    }

    // Create download link
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get available fields for selected website
  const availableFields = selectedWebsite
    ? SUPPORTED_WEBSITES.find((w) => w.id === selectedWebsite)?.fields || []
    : [];

  // Get website display name
  const websiteName = selectedWebsite
    ? SUPPORTED_WEBSITES.find((w) => w.id === selectedWebsite)?.name
    : "";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Data Scraper</h1>
        <p className="text-muted-foreground mb-8">
          Choose a website and options to start collecting data
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="configure">Configure Scraper</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="configure">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Select Website</CardTitle>
                  <CardDescription>
                    Choose a website to scrape data from
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Select
                      value={selectedWebsite}
                      onValueChange={handleWebsiteChange}
                    >
                      <SelectTrigger id="website">
                        <SelectValue placeholder="Choose a website" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORTED_WEBSITES.map((website) => (
                          <SelectItem key={website.id} value={website.id}>
                            {website.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedWebsite && (
                    <>
                      <div className="space-y-2">
                        <Label>Data Fields</Label>
                        <div className="grid grid-cols-2 gap-4">
                          {availableFields.map((field) => (
                            <div
                              key={field}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`field-${field}`}
                                checked={selectedFields.includes(field)}
                                onCheckedChange={() => toggleField(field)}
                              />
                              <Label
                                htmlFor={`field-${field}`}
                                className="capitalize"
                              >
                                {field}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {selectedWebsite && (
                <Card>
                  <CardHeader>
                    <CardTitle>Scraping Options</CardTitle>
                    <CardDescription>
                      Configure parameters for data collection from{" "}
                      {websiteName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="searchTerm">Search Term</Label>
                      <Input
                        id="searchTerm"
                        value={customParams.searchTerm}
                        onChange={(e) =>
                          updateParam("searchTerm", e.target.value)
                        }
                        placeholder={`Enter search term for ${websiteName}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resultsLimit">Results Limit</Label>
                      <Input
                        id="resultsLimit"
                        type="number"
                        min="1"
                        max="200"
                        value={customParams.resultsLimit}
                        onChange={(e) =>
                          updateParam("resultsLimit", e.target.value)
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum 200 results per scrape
                      </p>
                    </div>

                    {["amazon", "ebay", "craigslist", "indeed"].includes(
                      selectedWebsite
                    ) && (
                      <div className="space-y-2">
                        <Label htmlFor="searchLocation">
                          Location (optional)
                        </Label>
                        <Input
                          id="searchLocation"
                          value={customParams.searchLocation}
                          onChange={(e) =>
                            updateParam("searchLocation", e.target.value)
                          }
                          placeholder="E.g., New York, US"
                        />
                      </div>
                    )}

                    {selectedWebsite === "amazon" && (
                      <div className="space-y-2">
                        <Label>Amazon Notice</Label>
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Caution</AlertTitle>
                          <AlertDescription>
                            Amazon has sophisticated anti-bot systems. Data
                            scraping may be limited.
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={startScraping}
                      disabled={scraping || selectedFields.length === 0}
                      className="w-full"
                    >
                      {scraping ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Start Scraping"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Scraping Results</CardTitle>
                <CardDescription>
                  {results.length > 0
                    ? `Collected ${results.length} data items from ${websiteName}`
                    : "Choose a website and configure the scraper to see results here"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {scraping ? (
                  <div className="py-8 space-y-4">
                    <Progress value={progress} className="w-full h-2" />
                    <p className="text-center text-muted-foreground">
                      Scraping data from {websiteName}... {progress}%
                    </p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {Object.keys(results[0]).map((header) => (
                            <TableHead key={header} className="capitalize">
                              {header}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {Object.values(row).map((value, cellIndex) => (
                              <TableCell key={`${rowIndex}-${cellIndex}`}>
                                {value}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Globe className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
                    <h3 className="text-lg font-medium">No results yet</h3>
                    <p className="text-muted-foreground max-w-md">
                      Configure the scraper and start collecting data to see
                      results here
                    </p>
                  </div>
                )}
              </CardContent>
              {results.length > 0 && (
                <CardFooter className="flex gap-4 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={() => downloadResults("csv")}
                  >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Download CSV
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => downloadResults("json")}
                  >
                    <FileJson className="mr-2 h-4 w-4" />
                    Download JSON
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => downloadResults("excel")}
                  >
                    <FileType className="mr-2 h-4 w-4" />
                    Download Excel
                  </Button>
                </CardFooter>
              )}
            </Card>

            {results.length > 0 && (
              <Alert className="mt-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  Data has been collected and stored in your account. You can
                  access it again from your Dashboard.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Scraper;
