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
import { useRealtimeTasks, Task, NewTask } from "@/hooks/use-realtime-tasks";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const { user } = useAuth();
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
  const [showPreview, setShowPreview] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  const {
    tasks,
    loading: tasksLoading,
    addTask,
    updateTask,
  } = useRealtimeTasks(user?.uid);

  // Lọc các task mới tạo để hiển thị kết quả
  const currentTask = useMemo(() => {
    if (!currentTaskId) return null;
    return tasks.find((task) => task.id === currentTaskId) || null;
  }, [currentTaskId, tasks]);

  // Lọc các kết quả dựa trên task hiện tại
  const results = useMemo(() => {
    if (
      !currentTask ||
      currentTask.status !== "completed" ||
      !currentTask.result
    ) {
      return [];
    }

    try {
      // Trong thực tế, result sẽ là một tham chiếu đến Firebase Storage
      // Ở đây chúng ta giả định nó là một chuỗi JSON
      return JSON.parse(currentTask.result);
    } catch (e) {
      console.error("Không thể phân tích kết quả:", e);
      return [];
    }
  }, [currentTask]);

  // Handle website selection change
  const handleWebsiteChange = (value: string) => {
    setSelectedWebsite(value);
    setSelectedFields([]);
    setCustomParams({
      searchTerm: "",
      resultsLimit: "50",
      searchLocation: "",
    });
    setShowPreview(false);
    setCurrentTaskId(null);
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
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn một trang web để bắt đầu thu thập dữ liệu.",
        variant: "destructive",
      });
      return;
    }

    if (selectedFields.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất một trường dữ liệu để thu thập.",
        variant: "destructive",
      });
      return;
    }

    if (!customParams.searchTerm && selectedWebsite !== "yellowpages") {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập một từ khóa tìm kiếm.",
        variant: "destructive",
      });
      return;
    }

    setScraping(true);
    setProgress(0);
    setCurrentTaskId(null);

    try {
      // Tạo task mới trong Firestore
      const website =
        SUPPORTED_WEBSITES.find((w) => w.id === selectedWebsite)?.name ||
        selectedWebsite;
      const newTask: NewTask = {
        userId: user?.uid || "",
        website,
        status: "pending",
        fields: selectedFields,
        searchTerm: customParams.searchTerm,
        searchLocation: customParams.searchLocation,
        resultsLimit: parseInt(customParams.resultsLimit),
      };

      // Thêm task vào Firebase
      const taskId = await addTask(newTask);
      setCurrentTaskId(taskId);

      // Simulate progressing states
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 10;
        setProgress(currentProgress);

        if (currentProgress >= 100) {
          clearInterval(progressInterval);

          // Cập nhật task với kết quả giả lập
          const mockResults = generateMockResults(
            selectedWebsite,
            selectedFields,
            5
          );
          updateTask(taskId, {
            status: "completed",
            items: mockResults.length,
            result: JSON.stringify(mockResults),
          });

          setScraping(false);
          setShowPreview(true);
        }
      }, 500);
    } catch (error) {
      setScraping(false);
      toast({
        title: "Lỗi",
        description:
          "Không thể tạo nhiệm vụ thu thập dữ liệu. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  // Tạo dữ liệu giả lập dựa trên trang web và trường được chọn
  const generateMockResults = (
    website: string,
    fields: string[],
    count: number
  ) => {
    const websiteConfig = SUPPORTED_WEBSITES.find((w) => w.id === website);
    if (!websiteConfig) return [];

    return Array.from({ length: count }, (_, i) => {
      const result: Record<string, any> = { id: `result-${i + 1}` };

      fields.forEach((field) => {
        switch (field) {
          case "title":
          case "name":
            result[field] = `${websiteConfig.name} Item ${i + 1}`;
            break;
          case "price":
            result[field] = `$${
              Math.floor(Math.random() * 1000) + 10
            }.${Math.floor(Math.random() * 99)}`;
            break;
          case "rating":
            result[field] = `${(Math.random() * 5).toFixed(1)} / 5.0`;
            break;
          case "reviews":
            result[field] = Math.floor(Math.random() * 1000);
            break;
          case "description":
            result[field] = `This is a sample description for item ${
              i + 1
            } from ${websiteConfig.name}.`;
            break;
          case "company":
            result[field] = `Company ${String.fromCharCode(
              65 + (i % 26)
            )} Inc.`;
            break;
          case "location":
            result[field] = [
              "New York",
              "San Francisco",
              "Austin",
              "Miami",
              "Chicago",
            ][i % 5];
            break;
          default:
            result[field] = `Sample ${field} data`;
        }
      });

      return result;
    });
  };

  // Format kết quả để hiển thị trong bảng
  const formatResultValue = (value: any): string => {
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  // Tải xuống kết quả
  const downloadResults = (format: "csv" | "json" | "excel") => {
    if (!results.length) return;

    try {
      let content: string;
      let mimeType: string;
      let filename: string;

      if (format === "json") {
        content = JSON.stringify(results, null, 2);
        mimeType = "application/json";
        filename = `${selectedWebsite}_data.json`;
      } else if (format === "csv") {
        // Tạo header CSV
        const headers = Object.keys(results[0]);
        const csvContent = [
          headers.join(","),
          ...results.map((item) =>
            headers.map((header) => JSON.stringify(item[header])).join(",")
          ),
        ].join("\n");
        content = csvContent;
        mimeType = "text/csv";
        filename = `${selectedWebsite}_data.csv`;
      } else {
        // Excel (CSV với phần mở rộng .xlsx)
        const headers = Object.keys(results[0]);
        const csvContent = [
          headers.join(","),
          ...results.map((item) =>
            headers.map((header) => JSON.stringify(item[header])).join(",")
          ),
        ].join("\n");
        content = csvContent;
        mimeType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        filename = `${selectedWebsite}_data.xlsx`;
      }

      // Tạo và tải xuống tệp
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Tải xuống thành công",
        description: `Dữ liệu đã được tải xuống dưới dạng ${format.toUpperCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Lỗi tải xuống",
        description: "Không thể tạo tệp tải xuống. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  // Trạng thái cho phân trang
  const itemsPerPage = 10;
  const { currentPage, totalPages, currentItems, setPage } = usePagination(
    results,
    itemsPerPage
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">Thu thập dữ liệu</h1>
            <p className="text-muted-foreground">
              Chọn một trang web để thu thập dữ liệu, chọn các trường dữ liệu,
              và bắt đầu thu thập.
            </p>
          </div>

          <Tabs
            defaultValue="configure"
            value={scraping || showPreview ? "results" : "configure"}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="configure" disabled={scraping}>
                Cấu hình
              </TabsTrigger>
              <TabsTrigger value="results" disabled={!scraping && !showPreview}>
                Kết quả
              </TabsTrigger>
            </TabsList>

            {/* Tab Cấu hình */}
            <TabsContent value="configure" className="space-y-6 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Chọn trang web</CardTitle>
                  <CardDescription>
                    Chọn một trang web từ danh sách dưới đây để bắt đầu.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="website">Trang web</Label>
                      <Select
                        value={selectedWebsite}
                        onValueChange={handleWebsiteChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn một trang web" />
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
                  </div>
                </CardContent>
              </Card>

              {selectedWebsite && (
                <Card>
                  <CardHeader>
                    <CardTitle>Chọn trường dữ liệu</CardTitle>
                    <CardDescription>
                      Chọn các trường dữ liệu bạn muốn thu thập từ{" "}
                      {
                        SUPPORTED_WEBSITES.find((w) => w.id === selectedWebsite)
                          ?.name
                      }
                      .
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {SUPPORTED_WEBSITES.find(
                        (w) => w.id === selectedWebsite
                      )?.fields.map((field) => (
                        <div
                          className="flex items-center space-x-2"
                          key={field}
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
                  </CardContent>
                </Card>
              )}

              {selectedWebsite && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tham số tùy chỉnh</CardTitle>
                    <CardDescription>
                      Cung cấp thông tin bổ sung cho quá trình thu thập dữ liệu.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="searchTerm">Từ khóa tìm kiếm</Label>
                        <Input
                          id="searchTerm"
                          value={customParams.searchTerm}
                          onChange={(e) =>
                            updateParam("searchTerm", e.target.value)
                          }
                          placeholder={`Nhập từ khóa tìm kiếm cho ${
                            SUPPORTED_WEBSITES.find(
                              (w) => w.id === selectedWebsite
                            )?.name
                          }`}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="searchLocation">
                            Vị trí (tùy chọn)
                          </Label>
                          <Input
                            id="searchLocation"
                            value={customParams.searchLocation}
                            onChange={(e) =>
                              updateParam("searchLocation", e.target.value)
                            }
                            placeholder="Nhập vị trí tìm kiếm (nếu có)"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="resultsLimit">Giới hạn kết quả</Label>
                          <Input
                            id="resultsLimit"
                            type="number"
                            min="1"
                            max="1000"
                            value={customParams.resultsLimit}
                            onChange={(e) =>
                              updateParam("resultsLimit", e.target.value)
                            }
                            placeholder="Số lượng kết quả tối đa"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={startScraping}
                      disabled={
                        !selectedWebsite ||
                        selectedFields.length === 0 ||
                        (!customParams.searchTerm &&
                          selectedWebsite !== "yellowpages")
                      }
                    >
                      Bắt đầu thu thập dữ liệu
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>

            {/* Tab Kết quả */}
            <TabsContent value="results" className="space-y-6 mt-4">
              {scraping && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Đang thu thập dữ liệu...
                    </CardTitle>
                    <CardDescription>
                      Chúng tôi đang xử lý yêu cầu của bạn. Điều này có thể mất
                      một vài phút.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tiến trình</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {!scraping && showPreview && currentTask && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {currentTask.status === "completed" ? (
                          <span className="flex items-center text-green-600">
                            <div className="h-2 w-2 rounded-full bg-green-600 mr-2" />
                            Thu thập dữ liệu hoàn tất
                          </span>
                        ) : currentTask.status === "failed" ? (
                          <span className="flex items-center text-red-600">
                            <div className="h-2 w-2 rounded-full bg-red-600 mr-2" />
                            Thu thập dữ liệu thất bại
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Đang xử lý
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {currentTask.status === "completed"
                          ? `Đã thu thập được ${
                              currentTask.items || 0
                            } mục dữ liệu từ ${currentTask.website}.`
                          : currentTask.status === "failed"
                          ? `Quá trình thu thập dữ liệu từ ${
                              currentTask.website
                            } đã thất bại. ${
                              currentTask.error || "Vui lòng thử lại sau."
                            }`
                          : `Đang xử lý dữ liệu từ ${currentTask.website}...`}
                      </CardDescription>
                    </CardHeader>
                    {currentTask.status === "completed" && (
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            onClick={() => downloadResults("csv")}
                            variant="outline"
                            className="gap-2"
                          >
                            <FileType size={16} />
                            CSV
                          </Button>
                          <Button
                            onClick={() => downloadResults("json")}
                            variant="outline"
                            className="gap-2"
                          >
                            <FileJson size={16} />
                            JSON
                          </Button>
                          <Button
                            onClick={() => downloadResults("excel")}
                            variant="outline"
                            className="gap-2"
                          >
                            <FileSpreadsheet size={16} />
                            Excel
                          </Button>
                        </div>

                        {results.length > 0 && (
                          <div className="border rounded-md">
                            <Table>
                              <TableCaption>
                                Kết quả thu thập dữ liệu từ{" "}
                                {currentTask.website}
                              </TableCaption>
                              <TableHeader>
                                <TableRow>
                                  {Object.keys(results[0]).map((key) => (
                                    <TableHead key={key} className="capitalize">
                                      {key}
                                    </TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {currentItems.map((result, index) => (
                                  <TableRow key={`result-${index}`}>
                                    {Object.keys(results[0]).map((key) => (
                                      <TableCell key={`${index}-${key}`}>
                                        {formatResultValue(result[key])}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>

                            {totalPages > 1 && (
                              <div className="py-4">
                                <Pagination>
                                  <PaginationContent>
                                    <PaginationItem>
                                      <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          if (currentPage > 1)
                                            setPage(currentPage - 1);
                                        }}
                                        className={
                                          currentPage === 1
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                        }
                                      />
                                    </PaginationItem>

                                    {Array.from(
                                      { length: totalPages },
                                      (_, i) => i + 1
                                    ).map((page) => (
                                      <PaginationItem key={page}>
                                        <PaginationLink
                                          href="#"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setPage(page);
                                          }}
                                          isActive={page === currentPage}
                                        >
                                          {page}
                                        </PaginationLink>
                                      </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                      <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          if (currentPage < totalPages)
                                            setPage(currentPage + 1);
                                        }}
                                        className={
                                          currentPage === totalPages
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                        }
                                      />
                                    </PaginationItem>
                                  </PaginationContent>
                                </Pagination>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    )}
                    {currentTask.status === "failed" && (
                      <CardContent>
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Lỗi</AlertTitle>
                          <AlertDescription>
                            {currentTask.error ||
                              "Có lỗi xảy ra khi thu thập dữ liệu."}
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    )}
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowPreview(false);
                          setSelectedWebsite("");
                          setSelectedFields([]);
                        }}
                      >
                        Thu thập dữ liệu mới
                      </Button>
                      <Button
                        onClick={() => {
                          setShowPreview(false);
                        }}
                      >
                        Sửa đổi cấu hình hiện tại
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Scraper;
