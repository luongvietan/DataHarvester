import { Header } from "@/components/Header";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  FileType,
  Globe,
  PlusCircle,
  MailPlus,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Bell,
  Eye,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeTasks, Task } from "@/hooks/use-realtime-tasks";
import { DataTable } from "@/components/DataTable";

// Fake data for demonstration
const DEMO_TASKS = [
  {
    id: "task1",
    website: "Amazon",
    status: "completed",
    created: "2023-10-15",
    items: 243,
  },
  {
    id: "task2",
    website: "eBay",
    status: "completed",
    created: "2023-10-18",
    items: 112,
  },
  {
    id: "task3",
    website: "LinkedIn",
    status: "in_progress",
    created: "2023-10-20",
    items: 45,
  },
  {
    id: "task4",
    website: "Twitter/X",
    status: "failed",
    created: "2023-10-22",
    items: 0,
  },
  {
    id: "task5",
    website: "Tripadvisor",
    status: "pending",
    created: "2023-10-23",
    items: 0,
  },
];

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<
    string,
    {
      variant: "default" | "destructive" | "outline" | "secondary";
      icon: React.ReactNode;
    }
  > = {
    completed: {
      variant: "default",
      icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
    },
    in_progress: {
      variant: "secondary",
      icon: <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />,
    },
    failed: {
      variant: "destructive",
      icon: <XCircle className="h-3.5 w-3.5 mr-1" />,
    },
    pending: {
      variant: "outline",
      icon: <Clock className="h-3.5 w-3.5 mr-1" />,
    },
  };

  const { variant, icon } = variants[status] || variants.pending;

  return (
    <Badge variant={variant} className="flex items-center">
      {icon}
      {status.replace("_", " ")}
    </Badge>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, loading } = useRealtimeTasks(user?.uid);
  const [stats, setStats] = useState({
    totalTasks: 0,
    activeTasks: 0,
    completedTasks: 0,
    pendingRequests: 0,
    totalDataItems: 0,
  });

  // Cập nhật thống kê khi tasks thay đổi
  useEffect(() => {
    if (tasks) {
      setStats({
        totalTasks: tasks.length,
        activeTasks: tasks.filter((task) => task.status === "in_progress")
          .length,
        completedTasks: tasks.filter((task) => task.status === "completed")
          .length,
        pendingRequests: 0, // Cần thêm logic cho custom requests
        totalDataItems: tasks.reduce(
          (total, task) => total + (task.items || 0),
          0
        ),
      });
    }
  }, [tasks]);

  // Get first letter of user's email for avatar
  const userInitial = user?.email ? user.email[0].toUpperCase() : "U";

  // Cấu hình cột cho bảng dữ liệu
  const columns = [
    {
      header: "Tên nhiệm vụ",
      accessor: "website",
      id: "website",
    },
    {
      header: "Trạng thái",
      accessor: (task: Task) => <TaskStatusBadge status={task.status} />,
      id: "status",
    },
    {
      header: "Ngày tạo",
      accessor: (task: Task) => task.createdAt.toLocaleDateString(),
      id: "date",
    },
    {
      header: "Số mục",
      accessor: (task: Task) => task.items || 0,
      id: "items",
    },
    {
      header: "Thao tác",
      accessor: (task: Task) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={task.status !== "completed"}
          >
            <Download className="h-4 w-4 mr-1" /> Tải xuống
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" /> Xem
          </Button>
        </div>
      ),
      id: "actions",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back,{" "}
              {user?.displayName || user?.email?.split("@")[0] || "User"}
            </p>
          </div>

          <div className="flex items-center mt-4 md:mt-0">
            <Avatar className="h-10 w-10 mr-4">
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className="text-xs text-muted-foreground">Free Plan</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading data...</span>
          </div>
        ) : (
          <Tabs defaultValue="overview">
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalTasks}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      All scraping tasks
                    </p>
                    <div className="mt-2">
                      <Progress value={100} className="h-1" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-500">
                      {stats.activeTasks}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tasks in progress
                    </p>
                    <div className="mt-2">
                      <Progress
                        value={(stats.activeTasks / stats.totalTasks) * 100}
                        className="h-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Completed Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-500">
                      {stats.completedTasks}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Finished tasks
                    </p>
                    <div className="mt-2">
                      <Progress
                        value={(stats.completedTasks / stats.totalTasks) * 100}
                        className="h-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Data Collected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {stats.totalDataItems}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total data items
                    </p>
                    <div className="mt-2">
                      <Progress value={80} className="h-1" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & Recent Tasks */}
              <div className="grid gap-6 md:grid-cols-7">
                <div className="md:col-span-5">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="space-y-1">
                        <CardTitle>Nhiệm vụ gần đây</CardTitle>
                        <CardDescription>
                          Quản lý và theo dõi các nhiệm vụ gỡ cào dữ liệu của
                          bạn
                        </CardDescription>
                      </div>
                      <Button asChild size="sm">
                        <Link to="/scraper">
                          <Plus className="mr-2 h-4 w-4" />
                          Nhiệm vụ mới
                        </Link>
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <DataTable
                        data={tasks}
                        columns={columns}
                        isLoading={loading}
                        emptyMessage="Chưa có nhiệm vụ nào. Hãy tạo nhiệm vụ đầu tiên của bạn!"
                      />
                    </CardContent>
                    <CardFooter>
                      <Link
                        to="/scraper"
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Xem tất cả nhiệm vụ
                      </Link>
                    </CardFooter>
                  </Card>
                </div>

                <div>
                  {/* Quick Actions */}
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>
                        Start a new task or custom request
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <Button className="w-full justify-start" asChild>
                        <Link to="/scraper">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Start New Scraping Task
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link to="/custom-request">
                          <MailPlus className="mr-2 h-4 w-4" />
                          Submit Custom Request
                        </Link>
                      </Button>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                          <span className="sr-only">CSV</span>
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          <BarChart3 className="h-4 w-4" />
                          <span className="sr-only">Chart</span>
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          <FileType className="h-4 w-4" />
                          <span className="sr-only">JSON</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Notifications */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>
                        Updates about your tasks and requests
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[220px]">
                        <div className="space-y-4">
                          <div className="flex items-start gap-4 rounded-lg border p-3">
                            <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-500" />
                            <div>
                              <p className="text-sm font-medium">
                                Task completed
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Amazon scraping task completed with 243 data
                                items
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                2 hours ago
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-4 rounded-lg border p-3">
                            <Loader2 className="h-5 w-5 mt-0.5 text-blue-500 animate-spin" />
                            <div>
                              <p className="text-sm font-medium">
                                Task in progress
                              </p>
                              <p className="text-xs text-muted-foreground">
                                LinkedIn scraping task is being processed
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                6 hours ago
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-4 rounded-lg border p-3">
                            <Bell className="h-5 w-5 mt-0.5 text-yellow-500" />
                            <div>
                              <p className="text-sm font-medium">Reminder</p>
                              <p className="text-xs text-muted-foreground">
                                You have 2 pending tasks
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                1 day ago
                              </p>
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" className="w-full">
                        View All Notifications
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tasks">
              <Card>
                <CardHeader>
                  <CardTitle>Task Management</CardTitle>
                  <CardDescription>
                    View and manage all your scraping tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">
                    Full functionality coming soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Requests</CardTitle>
                  <CardDescription>
                    Track the status of your custom scraping requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">
                    Full functionality coming soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

// Component hiển thị trạng thái task
const TaskStatusBadge = ({ status }: { status: Task["status"] }) => {
  const variants: Record<Task["status"], { class: string; label: string }> = {
    pending: { class: "bg-yellow-100 text-yellow-800", label: "Đang chờ" },
    in_progress: { class: "bg-blue-100 text-blue-800", label: "Đang xử lý" },
    completed: { class: "bg-green-100 text-green-800", label: "Hoàn thành" },
    failed: { class: "bg-red-100 text-red-800", label: "Thất bại" },
  };

  const { class: className, label } = variants[status];

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>
      {label}
    </span>
  );
};

export default Dashboard;
