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
  FileText,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

// Validate a URL
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

type CustomRequestStatus =
  | "submitted"
  | "in_review"
  | "accepted"
  | "rejected"
  | "completed";

type CustomRequestItem = {
  id: string;
  userId: string;
  websiteUrl: string;
  description: string;
  email: string;
  attachments: string[];
  status: CustomRequestStatus;
  createdAt: Date;
  updatedAt: Date;
};

const CustomRequest = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
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
  const [previousRequests, setPreviousRequests] = useState<CustomRequestItem[]>(
    []
  );
  const [loadingRequests, setLoadingRequests] = useState(true);

  // Load user's previous custom requests
  useEffect(() => {
    if (!user?.uid) {
      setPreviousRequests([]);
      setLoadingRequests(false);
      return;
    }

    const requestsRef = collection(db, "customRequests");
    const q = query(
      requestsRef,
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const requests: CustomRequestItem[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          requests.push({
            id: doc.id,
            userId: data.userId,
            websiteUrl: data.websiteUrl,
            description: data.description,
            email: data.email,
            attachments: data.attachments || [],
            status: data.status,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          });
        });
        setPreviousRequests(requests);
        setLoadingRequests(false);
      },
      (error) => {
        console.error("Error fetching custom requests:", error);
        setLoadingRequests(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

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
          `Các tệp ${oversizedFiles
            .map((f) => f.name)
            .join(", ")} vượt quá giới hạn 5MB.`
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
      setError("Vui lòng nhập URL trang web.");
      return;
    }

    if (!isValidUrl(formData.websiteUrl)) {
      setError("Vui lòng nhập URL hợp lệ (bao gồm http:// hoặc https://)");
      return;
    }

    if (!formData.description) {
      setError("Vui lòng mô tả dữ liệu bạn muốn thu thập.");
      return;
    }

    if (!formData.email) {
      setError("Vui lòng nhập email của bạn.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Trong thực tế, ở đây bạn sẽ:
      // 1. Tải tệp lên Firebase Storage
      // 2. Lấy URL tải xuống cho các tệp
      // 3. Lưu thông tin yêu cầu trong Firestore

      // Lưu trữ yêu cầu thực tế trong Firestore
      const requestRef = await addDoc(collection(db, "customRequests"), {
        userId: user?.uid,
        websiteUrl: formData.websiteUrl,
        description: formData.description,
        email: formData.email,
        attachments: [], // Đây sẽ là URL tải xuống tệp
        status: "submitted",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setRequestId(requestRef.id);
      setSuccess(true);

      toast({
        title: "Yêu cầu đã được gửi",
        description: `Yêu cầu của bạn đã được nhận với ID ${requestRef.id}.`,
      });
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu:", err);
      setError("Đã xảy ra lỗi khi gửi yêu cầu của bạn. Vui lòng thử lại sau.");

      toast({
        title: "Lỗi yêu cầu",
        description: "Không thể gửi yêu cầu tùy chỉnh. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chuyển đổi trạng thái thành văn bản có thể đọc
  const getStatusText = (status: CustomRequestStatus) => {
    switch (status) {
      case "submitted":
        return "Đã gửi";
      case "in_review":
        return "Đang xem xét";
      case "accepted":
        return "Đã chấp nhận";
      case "rejected":
        return "Đã từ chối";
      case "completed":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  // Chuyển đổi trạng thái thành màu sắc
  const getStatusColor = (status: CustomRequestStatus) => {
    switch (status) {
      case "submitted":
        return "text-blue-500 bg-blue-100 dark:bg-blue-900/30";
      case "in_review":
        return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30";
      case "accepted":
        return "text-green-500 bg-green-100 dark:bg-green-900/30";
      case "rejected":
        return "text-red-500 bg-red-100 dark:bg-red-900/30";
      case "completed":
        return "text-purple-500 bg-purple-100 dark:bg-purple-900/30";
      default:
        return "text-gray-500 bg-gray-100 dark:bg-gray-800";
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 animate-fade-in">
        <Button variant="ghost" className="mb-8" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại Bảng điều khiển
          </Link>
        </Button>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">
            Yêu cầu thu thập dữ liệu tùy chỉnh
          </h1>
          <p className="text-muted-foreground mb-8">
            Gửi chi tiết về trang web và dữ liệu bạn muốn thu thập
          </p>

          {success ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-primary flex items-center justify-center">
                  <Check className="mr-2 h-5 w-5" />
                  Yêu cầu đã được gửi thành công!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4 bg-muted/50">
                  <p className="font-medium mb-2">Thông tin yêu cầu của bạn:</p>
                  <p>
                    <span className="font-medium">ID yêu cầu:</span> {requestId}
                  </p>
                  <p>
                    <span className="font-medium">Trang web:</span>{" "}
                    {formData.websiteUrl}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {formData.email}
                  </p>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Các bước tiếp theo</AlertTitle>
                  <AlertDescription>
                    Đội ngũ của chúng tôi sẽ xem xét yêu cầu của bạn và liên hệ
                    qua email trong vòng 24-48 giờ. Bạn cũng có thể theo dõi
                    trạng thái yêu cầu trong phần "Yêu cầu" trên Bảng điều khiển
                    của bạn.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={() => navigate("/dashboard")}>
                  Quay lại Bảng điều khiển
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              {previousRequests.length > 0 && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Yêu cầu gần đây của bạn</CardTitle>
                    <CardDescription>
                      Các yêu cầu tùy chỉnh bạn đã gửi trước đây
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loadingRequests ? (
                        <div className="flex justify-center p-4">
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                      ) : (
                        previousRequests.map((request) => (
                          <div
                            key={request.id}
                            className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                          >
                            <div className="flex items-start gap-3">
                              <div className="bg-muted p-2 rounded">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium truncate max-w-xs">
                                  {request.websiteUrl}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(request.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div
                              className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                                request.status
                              )}`}
                            >
                              {getStatusText(request.status)}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Biểu mẫu yêu cầu tùy chỉnh</CardTitle>
                  <CardDescription>
                    Cung cấp thông tin chi tiết về dữ liệu bạn muốn thu thập
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="websiteUrl">
                        URL trang web <span className="text-red-500">*</span>
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
                        Nhập URL đầy đủ, bao gồm http:// hoặc https://
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Mô tả dữ liệu <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Mô tả chi tiết về dữ liệu bạn muốn thu thập (ví dụ: tên sản phẩm, giá, đánh giá...)"
                        rows={5}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email liên hệ <span className="text-red-500">*</span>
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
                      <Label htmlFor="file">Tệp đính kèm (tùy chọn)</Label>
                      <div className="border rounded-lg p-4 bg-muted/20">
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor="file-upload"
                            className="w-full cursor-pointer"
                          >
                            <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed rounded-lg border-muted-foreground/25 hover:border-primary/50 transition-colors">
                              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm font-medium">
                                Kéo thả tệp vào đây hoặc nhấp để duyệt
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Hỗ trợ PNG, JPG, PDF (tối đa 5MB mỗi tệp)
                              </p>
                            </div>
                            <input
                              id="file-upload"
                              type="file"
                              accept=".png,.jpg,.jpeg,.pdf"
                              multiple
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {files.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm font-medium">Tệp đã chọn:</p>
                            {files.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-background/80 p-2 rounded-md"
                              >
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm truncate max-w-xs">
                                    {file.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    ({(file.size / 1024).toFixed(0)} KB)
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFile(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Lỗi</AlertTitle>
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
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Gửi yêu cầu
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomRequest;
