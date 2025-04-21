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
  BarChart4,
  Sparkles,
  Database,
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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const variants: Record<
    string,
    {
      variant: "default" | "destructive" | "outline" | "secondary";
      icon: React.ReactNode;
      className?: string;
    }
  > = {
    completed: {
      variant: "default",
      icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
      className: "bg-gradient-to-r from-emerald-500 to-green-600 text-white",
    },
    in_progress: {
      variant: "secondary",
      icon: <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />,
      className: "bg-gradient-to-r from-blue-400 to-indigo-500 text-white",
    },
    failed: {
      variant: "destructive",
      icon: <XCircle className="h-3.5 w-3.5 mr-1" />,
      className: "bg-gradient-to-r from-red-500 to-rose-600",
    },
    pending: {
      variant: "outline",
      icon: <Clock className="h-3.5 w-3.5 mr-1" />,
      className: "border-2",
    },
  };

  const { variant, icon, className } = variants[status] || variants.pending;

  const getStatusText = () => {
    if (status === "completed") return t("task.status.completed");
    if (status === "in_progress") return t("task.status.in_progress");
    if (status === "failed") return t("task.status.failed");
    if (status === "pending") return t("task.status.pending");
    return status.replace("_", " ");
  };

  return (
    <Badge variant={variant} className={`flex items-center ${className}`}>
      {icon}
      {getStatusText()}
    </Badge>
  );
};

const Dashboard = () => {
  const { t } = useTranslation();
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
      header: t("table.taskName"),
      accessor: "website",
      id: "website",
    },
    {
      header: t("table.status"),
      accessor: (task: Task) => <TaskStatusBadge status={task.status} />,
      id: "status",
    },
    {
      header: t("table.createdDate"),
      accessor: (task: Task) => task.createdAt.toLocaleDateString(),
      id: "date",
    },
    {
      header: t("table.items"),
      accessor: (task: Task) => task.items || 0,
      id: "items",
    },
    {
      header: t("table.actions"),
      accessor: (task: Task) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={task.status !== "completed"}
          >
            <Download className="h-4 w-4 mr-1" /> {t("action.download")}
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" /> {t("action.view")}
          </Button>
        </div>
      ),
      id: "actions",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              {t("nav.dashboard")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("dashboard.welcome", {
                name: user?.displayName || user?.email?.split("@")[0] || "User",
              })}
            </p>
          </div>

          <div className="flex items-center mt-4 md:mt-0 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
            <Avatar className="h-10 w-10 mr-4 border-2 border-primary">
              <AvatarFallback className="bg-gradient-to-br from-primary to-blue-700 text-white">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className="text-xs text-muted-foreground flex items-center">
                <Sparkles className="h-3 w-3 mr-1 text-yellow-500" />{" "}
                {t("plan.free")}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">{t("table.loading")}</span>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="mb-8 p-1 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
              <TabsTrigger value="overview" className="rounded-md">
                <BarChart3 className="h-4 w-4 mr-2" />
                {t("dashboard.tabs.overview")}
              </TabsTrigger>
              <TabsTrigger value="tasks" className="rounded-md">
                <Database className="h-4 w-4 mr-2" />
                {t("dashboard.tabs.tasks")}
              </TabsTrigger>
              <TabsTrigger value="requests" className="rounded-md">
                <MailPlus className="h-4 w-4 mr-2" />
                {t("dashboard.tabs.requests")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <div className="h-1 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                      {t("dashboard.stats.totalTasks")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalTasks}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("dashboard.stats.totalTasksDesc")}
                    </p>
                    <div className="mt-3">
                      <Progress value={100} className="h-1.5 rounded-full" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 text-blue-500 animate-spin" />
                      {t("dashboard.stats.activeTasks")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-500">
                      {stats.activeTasks}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("dashboard.stats.activeTasksDesc")}
                    </p>
                    <div className="mt-3">
                      <Progress
                        value={
                          (stats.activeTasks / Math.max(stats.totalTasks, 1)) *
                          100
                        }
                        className="h-1.5 rounded-full bg-blue-100 dark:bg-blue-900"
                        indicatorClassName="bg-gradient-to-r from-blue-400 to-blue-600"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <div className="h-1 bg-gradient-to-r from-emerald-400 to-green-600"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      {t("dashboard.stats.completedTasks")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-500">
                      {stats.completedTasks}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("dashboard.stats.completedTasksDesc")}
                    </p>
                    <div className="mt-3">
                      <Progress
                        value={
                          (stats.completedTasks /
                            Math.max(stats.totalTasks, 1)) *
                          100
                        }
                        className="h-1.5 rounded-full bg-green-100 dark:bg-green-900"
                        indicatorClassName="bg-gradient-to-r from-emerald-400 to-green-600"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <div className="h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                      <FileSpreadsheet className="h-4 w-4 mr-2 text-purple-500" />
                      {t("dashboard.stats.dataCollected")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-500">
                      {stats.totalDataItems}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("dashboard.stats.dataCollectedDesc")}
                    </p>
                    <div className="mt-3">
                      <Progress
                        value={100}
                        className="h-1.5 rounded-full bg-purple-100 dark:bg-purple-900"
                        indicatorClassName="bg-gradient-to-r from-purple-400 to-purple-600"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & Recent Tasks */}
              <div className="grid gap-6 md:grid-cols-7">
                <div className="md:col-span-5">
                  <Card className="border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-primary" />
                          {t("dashboard.recentTasks")}
                        </CardTitle>
                        <CardDescription>
                          {t("dashboard.recentTasksDesc")}
                        </CardDescription>
                      </div>
                      <Button
                        asChild
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                      >
                        <Link to="/scraper">
                          <Plus className="mr-2 h-4 w-4" />
                          {t("dashboard.newTask")}
                        </Link>
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <DataTable
                        data={tasks}
                        columns={columns}
                        isLoading={loading}
                        emptyMessage={t("dashboard.emptyTasksList")}
                      />
                    </CardContent>
                    <CardFooter>
                      <Link
                        to="/scraper"
                        className="text-xs text-primary hover:text-primary/80 flex items-center"
                      >
                        {t("dashboard.viewAll")}
                        <svg
                          className="h-3 w-3 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </CardFooter>
                  </Card>
                </div>

                <div className="md:col-span-2">
                  {/* Quick Actions */}
                  <Card className="mb-6 border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-lg">
                        <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
                        {t("dashboard.quickActions")}
                      </CardTitle>
                      <CardDescription>
                        {t("dashboard.quickActionsDesc")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <Button
                        className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                        asChild
                      >
                        <Link to="/scraper">
                          <PlusCircle className="mr-2 h-4.5 w-4.5" />
                          {t("dashboard.createTask")}
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950"
                        asChild
                      >
                        <Link to="/custom-request">
                          <MailPlus className="mr-2 h-4.5 w-4.5 text-blue-500" />
                          {t("dashboard.customRequest")}
                        </Link>
                      </Button>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full shadow-sm bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                          <FileSpreadsheet className="h-4 w-4 text-green-600" />
                          <span className="sr-only">CSV</span>
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full shadow-sm bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                          <BarChart3 className="h-4 w-4 text-blue-600" />
                          <span className="sr-only">Chart</span>
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full shadow-sm bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                          <FileType className="h-4 w-4 text-amber-600" />
                          <span className="sr-only">JSON</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Notifications */}
                  <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-lg">
                        <Bell className="h-5 w-5 mr-2 text-amber-500" />
                        {t("dashboard.notifications")}
                      </CardTitle>
                      <CardDescription>
                        {t("dashboard.notificationsDesc")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[220px] pr-4">
                        <div className="space-y-4">
                          <div className="flex items-start gap-4 rounded-lg border p-3 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                            <CheckCircle2 className="h-5 w-5 mt-0.5 text-green-500" />
                            <div>
                              <p className="text-sm font-medium">
                                {t("notifications.taskComplete")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {t("notifications.taskCompleteDesc", {
                                  name: "Amazon",
                                  count: 243,
                                })}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {t("time.hoursAgo", { count: 2 })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-4 rounded-lg border p-3 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                            <Loader2 className="h-5 w-5 mt-0.5 text-blue-500 animate-spin" />
                            <div>
                              <p className="text-sm font-medium">
                                {t("notifications.taskInProgress")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {t("notifications.taskInProgressDesc", {
                                  name: "LinkedIn",
                                })}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {t("time.hoursAgo", { count: 6 })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-4 rounded-lg border p-3 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                            <Bell className="h-5 w-5 mt-0.5 text-amber-500" />
                            <div>
                              <p className="text-sm font-medium">
                                {t("notifications.reminder")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {t("notifications.pendingTasksReminder", {
                                  count: 2,
                                })}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {t("time.daysAgo", { count: 1 })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-primary hover:text-primary/80 hover:bg-blue-50 dark:hover:bg-blue-950"
                      >
                        {t("dashboard.viewAllNotifications")}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tasks">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2 text-primary" />
                    {t("dashboard.taskManagement")}
                  </CardTitle>
                  <CardDescription>
                    {t("dashboard.taskManagementDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                    <Database className="h-12 w-12 mb-4 text-muted-foreground/50" />
                    <p>{t("dashboard.comingSoon")}</p>
                    <Button
                      className="mt-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                      asChild
                    >
                      <Link to="/scraper">
                        <Plus className="mr-2 h-4 w-4" />
                        {t("dashboard.createNewTask")}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MailPlus className="h-5 w-5 mr-2 text-primary" />
                    {t("dashboard.customRequests")}
                  </CardTitle>
                  <CardDescription>
                    {t("dashboard.customRequestsDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                    <MailPlus className="h-12 w-12 mb-4 text-muted-foreground/50" />
                    <p>{t("dashboard.noRequests")}</p>
                    <Button
                      className="mt-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                      asChild
                    >
                      <Link to="/custom-request">
                        <Plus className="mr-2 h-4 w-4" />
                        {t("dashboard.createNewRequest")}
                      </Link>
                    </Button>
                  </div>
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
  const { t } = useTranslation();
  const variants: Record<
    string,
    {
      variant: "default" | "destructive" | "outline" | "secondary";
      icon: React.ReactNode;
      className?: string;
    }
  > = {
    completed: {
      variant: "default",
      icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" />,
      className: "bg-gradient-to-r from-emerald-500 to-green-600 text-white",
    },
    in_progress: {
      variant: "secondary",
      icon: <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />,
      className: "bg-gradient-to-r from-blue-400 to-indigo-500 text-white",
    },
    failed: {
      variant: "destructive",
      icon: <XCircle className="h-3.5 w-3.5 mr-1" />,
      className: "bg-gradient-to-r from-red-500 to-rose-600",
    },
    pending: {
      variant: "outline",
      icon: <Clock className="h-3.5 w-3.5 mr-1" />,
      className: "border-2",
    },
  };

  const { variant, icon, className } = variants[status] || variants.pending;

  return (
    <Badge variant={variant} className={`flex items-center ${className}`}>
      {icon}
      {status === "completed"
        ? t("task.status.completed")
        : status === "in_progress"
        ? t("task.status.in_progress")
        : status === "failed"
        ? t("task.status.failed")
        : status === "pending"
        ? t("task.status.pending")
        : status}
    </Badge>
  );
};

export default Dashboard;
