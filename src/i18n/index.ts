import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

// Tài nguyên dịch mặc định
const resources = {
  vi: {
    translation: {
      // Chung
      "app.name": "DataHarvester",
      "app.tagline": "Thu thập dữ liệu dễ dàng và hiệu quả",
      "theme.dark": "Chế độ tối",
      "theme.light": "Chế độ sáng",

      // Đăng nhập/đăng ký
      "auth.login": "Đăng nhập",
      "auth.signup": "Đăng ký",
      "auth.logout": "Đăng xuất",
      "auth.forgotPassword": "Quên mật khẩu",
      "auth.email": "Email",
      "auth.password": "Mật khẩu",
      "auth.confirmPassword": "Xác nhận mật khẩu",
      "auth.name": "Họ tên",
      "auth.loginSuccess": "Đăng nhập thành công",
      "auth.loginSuccessDesc":
        "Bạn đang được chuyển hướng đến bảng điều khiển.",
      "auth.loginFailed": "Đăng nhập thất bại",
      "auth.signupSuccess": "Đăng ký thành công",
      "auth.signupSuccessDesc":
        "Một email xác thực đã được gửi đến địa chỉ email của bạn.",
      "auth.signupFailed": "Đăng ký thất bại",
      "auth.passwordsDontMatch": "Mật khẩu không khớp",
      "auth.passwordsDontMatchDesc":
        "Vui lòng kiểm tra mật khẩu xác nhận của bạn.",
      "auth.verifyEmail": "Xác thực email của bạn",
      "auth.verifyEmailDesc":
        "Chúng tôi đã gửi một email xác thực đến email của bạn. Vui lòng kiểm tra hộp thư đến và nhấp vào liên kết để xác thực tài khoản của bạn.",
      "auth.didntReceiveEmail": "Không nhận được email?",
      "auth.resendVerification": "Gửi lại email xác thực",
      "auth.emailResent": "Email đã được gửi lại",
      "auth.emailResentDesc": "Vui lòng kiểm tra hộp thư đến của bạn.",
      "auth.emailNotResent": "Không thể gửi lại email",
      "auth.emailNotResentDesc": "Vui lòng thử lại sau.",
      "auth.alreadyHaveAccount": "Đã có tài khoản?",
      "auth.dontHaveAccount": "Chưa có tài khoản?",
      "auth.backToSignup": "Quay lại đăng ký",
      "auth.goToLogin": "Đi đến đăng nhập",
      "auth.resetPasswordTitle": "Đặt lại mật khẩu",
      "auth.resetPasswordDesc":
        "Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.",
      "auth.resetEmailSent": "Email đặt lại đã được gửi",
      "auth.resetEmailSentDesc":
        "Vui lòng kiểm tra hộp thư đến của bạn để đặt lại mật khẩu.",
      "auth.resetRequestFailed": "Yêu cầu thất bại",
      "auth.emailSent": "Email đã được gửi!",
      "auth.sendResetLink": "Gửi liên kết đặt lại mật khẩu",
      "auth.sending": "Đang gửi...",
      "auth.sendToAnotherEmail": "Gửi lại đến email khác",
      "auth.backToLogin": "Quay lại đăng nhập",
      "auth.processing": "Đang xử lý...",
      "auth.emailVerificationRequired":
        "Vui lòng xác thực email của bạn trước khi đăng nhập. Kiểm tra hộp thư đến của bạn.",

      // Navigation
      "nav.home": "Trang chủ",
      "nav.features": "Tính năng",
      "nav.pricing": "Bảng giá",
      "nav.contact": "Liên hệ",
      "nav.dashboard": "Bảng điều khiển",
      "nav.profile": "Hồ sơ",
      "nav.scraper": "Thu thập dữ liệu",

      // Trang chủ
      "home.hero.title": "Thu thập dữ liệu dễ dàng với DataHarvester",
      "home.hero.subtitle":
        "Gỡ cào dữ liệu từ các trang web phổ biến hoặc yêu cầu giải pháp tùy chỉnh một cách dễ dàng.",
      "home.hero.getStarted": "Bắt đầu ngay",
      "home.hero.learnMore": "Tìm hiểu thêm",

      // Tính năng
      "features.title": "Tính năng nổi bật",
      "features.prebuilt.title": "Các công cụ thu thập dữ liệu có sẵn",
      "features.prebuilt.desc":
        "Sử dụng các công cụ thu thập dữ liệu cho các trang web phổ biến",
      "features.custom.title": "Yêu cầu tùy chỉnh",
      "features.custom.desc":
        "Gửi yêu cầu thu thập dữ liệu tùy chỉnh qua biểu mẫu",
      "features.export.title": "Xuất dữ liệu đa dạng",
      "features.export.desc":
        "Xuất dữ liệu dưới nhiều định dạng như CSV, JSON, Excel",
      "features.dashboard.title": "Bảng điều khiển thân thiện",
      "features.dashboard.desc":
        "Quản lý công việc thu thập dữ liệu trực quan và hiệu quả",

      // Dashboard
      "dashboard.welcome": "Xin chào, {{name}}!",
      "dashboard.stats.totalTasks": "Tổng nhiệm vụ",
      "dashboard.stats.totalTasksDesc": "Tất cả nhiệm vụ thu thập",
      "dashboard.stats.activeTasks": "Nhiệm vụ đang chạy",
      "dashboard.stats.activeTasksDesc": "Đang trong tiến trình",
      "dashboard.stats.completedTasks": "Nhiệm vụ hoàn thành",
      "dashboard.stats.completedTasksDesc": "Nhiệm vụ đã hoàn tất",
      "dashboard.stats.dataCollected": "Dữ liệu thu thập",
      "dashboard.stats.dataCollectedDesc": "Tổng số mục dữ liệu",
      "dashboard.recentTasks": "Nhiệm vụ gần đây",
      "dashboard.recentTasksDesc":
        "Quản lý và theo dõi các nhiệm vụ thu thập dữ liệu của bạn",
      "dashboard.newTask": "Nhiệm vụ mới",
      "dashboard.viewAll": "Xem tất cả",
      "dashboard.emptyTasksList":
        "Chưa có nhiệm vụ nào. Hãy tạo nhiệm vụ đầu tiên của bạn!",
      "dashboard.quickActions": "Thao tác nhanh",
      "dashboard.quickActionsDesc": "Bắt đầu nhiệm vụ mới hoặc tạo yêu cầu",
      "dashboard.createTask": "Tạo nhiệm vụ thu thập",
      "dashboard.customRequest": "Gửi yêu cầu tùy chỉnh",
      "dashboard.notifications": "Thông báo",
      "dashboard.notificationsDesc": "Cập nhật về nhiệm vụ và yêu cầu",
      "dashboard.viewAllNotifications": "Xem tất cả thông báo",
      "dashboard.taskManagement": "Quản lý nhiệm vụ",
      "dashboard.taskManagementDesc":
        "Xem và quản lý tất cả các nhiệm vụ thu thập dữ liệu",
      "dashboard.comingSoon": "Tính năng đầy đủ sẽ sớm ra mắt",
      "dashboard.createNewTask": "Tạo nhiệm vụ mới",
      "dashboard.customRequests": "Yêu cầu tùy chỉnh",
      "dashboard.customRequestsDesc":
        "Gửi yêu cầu để chúng tôi giúp bạn thu thập dữ liệu phức tạp",
      "dashboard.noRequests":
        "Chưa có yêu cầu nào. Hãy gửi yêu cầu đầu tiên của bạn.",
      "dashboard.createNewRequest": "Tạo yêu cầu mới",
      "dashboard.tabs.overview": "Tổng quan",
      "dashboard.tabs.tasks": "Nhiệm vụ",
      "dashboard.tabs.requests": "Yêu cầu",

      // Thông báo
      "notifications.taskComplete": "Nhiệm vụ hoàn thành",
      "notifications.taskCompleteDesc":
        "Nhiệm vụ thu thập {{name}} đã hoàn thành với {{count}} mục dữ liệu",
      "notifications.taskInProgress": "Nhiệm vụ đang xử lý",
      "notifications.taskInProgressDesc":
        "Nhiệm vụ thu thập {{name}} đang được xử lý",
      "notifications.taskFailed": "Nhiệm vụ thất bại",
      "notifications.reminder": "Nhắc nhở",
      "notifications.pendingTasksReminder":
        "Bạn có {{count}} nhiệm vụ đang chờ xử lý",
      "notifications.welcome": "Chào mừng đến với DataHarvester",

      // Thời gian
      "time.hoursAgo": "{{count}} giờ trước",
      "time.daysAgo": "{{count}} ngày trước",

      // Trạng thái nhiệm vụ
      "task.status.completed": "Hoàn thành",
      "task.status.in_progress": "Đang xử lý",
      "task.status.failed": "Thất bại",
      "task.status.pending": "Đang chờ",

      // Hành động
      "action.download": "Tải xuống",
      "action.view": "Xem",

      // Bảng
      "table.taskName": "Tên nhiệm vụ",
      "table.status": "Trạng thái",
      "table.createdDate": "Ngày tạo",
      "table.items": "Số mục",
      "table.actions": "Thao tác",
      "table.noData": "Không có dữ liệu",
      "table.loading": "Đang tải...",
      "table.pagination.next": "Tiếp",
      "table.pagination.prev": "Trước",
      "table.pagination.showing":
        "Hiển thị {{from}} đến {{to}} trong tổng số {{total}} dòng",

      // Plan
      "plan.free": "Gói miễn phí",

      // Lỗi
      "errors.general": "Đã xảy ra lỗi",
      "errors.auth.invalidEmail": "Email không hợp lệ",
      "errors.auth.wrongPassword": "Mật khẩu không chính xác",
      "errors.auth.emailInUse": "Email đã được sử dụng",
      "errors.auth.weakPassword": "Mật khẩu quá yếu",
      "errors.network": "Lỗi kết nối mạng",
    },
  },
  en: {
    translation: {
      // Common
      "app.name": "DataHarvester",
      "app.tagline": "Harvest data effortlessly",
      "theme.dark": "Dark mode",
      "theme.light": "Light mode",

      // Auth
      "auth.login": "Log In",
      "auth.signup": "Sign Up",
      "auth.logout": "Log Out",
      "auth.forgotPassword": "Forgot Password",
      "auth.email": "Email",
      "auth.password": "Password",
      "auth.confirmPassword": "Confirm Password",
      "auth.name": "Full Name",
      "auth.loginSuccess": "Login Successful",
      "auth.loginSuccessDesc": "You are being redirected to the dashboard.",
      "auth.loginFailed": "Login Failed",
      "auth.signupSuccess": "Sign Up Successful",
      "auth.signupSuccessDesc":
        "A verification email has been sent to your email address.",
      "auth.signupFailed": "Sign Up Failed",
      "auth.passwordsDontMatch": "Passwords Don't Match",
      "auth.passwordsDontMatchDesc": "Please check your confirmation password.",
      "auth.verifyEmail": "Verify Your Email",
      "auth.verifyEmailDesc":
        "We've sent a verification email to your email address. Please check your inbox and click the link to verify your account.",
      "auth.didntReceiveEmail": "Didn't receive the email?",
      "auth.resendVerification": "Resend Verification Email",
      "auth.emailResent": "Email Resent",
      "auth.emailResentDesc": "Please check your inbox.",
      "auth.emailNotResent": "Unable to Resend Email",
      "auth.emailNotResentDesc": "Please try again later.",
      "auth.alreadyHaveAccount": "Already have an account?",
      "auth.dontHaveAccount": "Don't have an account?",
      "auth.backToSignup": "Back to Sign Up",
      "auth.goToLogin": "Go to Login",
      "auth.resetPasswordTitle": "Reset Password",
      "auth.resetPasswordDesc":
        "Enter your email and we'll send you a link to reset your password.",
      "auth.resetEmailSent": "Reset Email Sent",
      "auth.resetEmailSentDesc":
        "Please check your inbox to reset your password.",
      "auth.resetRequestFailed": "Reset Request Failed",
      "auth.emailSent": "Email Sent!",
      "auth.sendResetLink": "Send Reset Link",
      "auth.sending": "Sending...",
      "auth.sendToAnotherEmail": "Send to Another Email",
      "auth.backToLogin": "Back to Login",
      "auth.processing": "Processing...",
      "auth.emailVerificationRequired":
        "Please verify your email before logging in. Check your inbox.",

      // Navigation
      "nav.home": "Home",
      "nav.features": "Features",
      "nav.pricing": "Pricing",
      "nav.contact": "Contact",
      "nav.dashboard": "Dashboard",
      "nav.profile": "Profile",
      "nav.scraper": "Data Scraper",

      // Home
      "home.hero.title": "Harvest Data Effortlessly with DataHarvester",
      "home.hero.subtitle":
        "Scrape data from popular websites or request custom solutions with ease.",
      "home.hero.getStarted": "Get Started",
      "home.hero.learnMore": "Learn More",

      // Features
      "features.title": "Key Features",
      "features.prebuilt.title": "Pre-built Scrapers",
      "features.prebuilt.desc": "Use ready-made scrapers for popular websites",
      "features.custom.title": "Custom Requests",
      "features.custom.desc": "Submit custom scraping requests via form",
      "features.export.title": "Multiple Export Formats",
      "features.export.desc": "Export data in CSV, JSON, Excel formats",
      "features.dashboard.title": "User-friendly Dashboard",
      "features.dashboard.desc":
        "Manage scraping tasks visually and efficiently",

      // Dashboard
      "dashboard.welcome": "Welcome back, {{name}}!",
      "dashboard.stats.totalTasks": "Total Tasks",
      "dashboard.stats.totalTasksDesc": "All scraping tasks",
      "dashboard.stats.activeTasks": "Active Tasks",
      "dashboard.stats.activeTasksDesc": "Tasks in progress",
      "dashboard.stats.completedTasks": "Completed Tasks",
      "dashboard.stats.completedTasksDesc": "Finished tasks",
      "dashboard.stats.dataCollected": "Data Collected",
      "dashboard.stats.dataCollectedDesc": "Total data items",
      "dashboard.recentTasks": "Recent Tasks",
      "dashboard.recentTasksDesc": "Manage and track your data scraping tasks",
      "dashboard.newTask": "New Task",
      "dashboard.viewAll": "View All",
      "dashboard.emptyTasksList": "No tasks yet. Create your first task!",
      "dashboard.quickActions": "Quick Actions",
      "dashboard.quickActionsDesc": "Start a new task or submit a request",
      "dashboard.createTask": "Create Scraping Task",
      "dashboard.customRequest": "Submit Custom Request",
      "dashboard.notifications": "Notifications",
      "dashboard.notificationsDesc": "Updates about your tasks and requests",
      "dashboard.viewAllNotifications": "View All Notifications",
      "dashboard.taskManagement": "Task Management",
      "dashboard.taskManagementDesc": "View and manage all your scraping tasks",
      "dashboard.comingSoon": "Full functionality coming soon",
      "dashboard.createNewTask": "Create New Task",
      "dashboard.customRequests": "Custom Requests",
      "dashboard.customRequestsDesc":
        "Submit requests for complex data scraping needs",
      "dashboard.noRequests": "No requests yet. Submit your first request.",
      "dashboard.createNewRequest": "Create New Request",
      "dashboard.tabs.overview": "Overview",
      "dashboard.tabs.tasks": "Tasks",
      "dashboard.tabs.requests": "Requests",

      // Notifications
      "notifications.taskComplete": "Task Completed",
      "notifications.taskCompleteDesc":
        "{{name}} scraping task completed with {{count}} data items",
      "notifications.taskInProgress": "Task In Progress",
      "notifications.taskInProgressDesc":
        "{{name}} scraping task is being processed",
      "notifications.taskFailed": "Task Failed",
      "notifications.reminder": "Reminder",
      "notifications.pendingTasksReminder": "You have {{count}} pending tasks",
      "notifications.welcome": "Welcome to DataHarvester",

      // Time
      "time.hoursAgo": "{{count}} hours ago",
      "time.daysAgo": "{{count}} days ago",

      // Task Status
      "task.status.completed": "Completed",
      "task.status.in_progress": "In Progress",
      "task.status.failed": "Failed",
      "task.status.pending": "Pending",

      // Actions
      "action.download": "Download",
      "action.view": "View",

      // Table
      "table.taskName": "Task Name",
      "table.status": "Status",
      "table.createdDate": "Created Date",
      "table.items": "Items",
      "table.actions": "Actions",
      "table.noData": "No data",
      "table.loading": "Loading...",
      "table.pagination.next": "Next",
      "table.pagination.prev": "Previous",
      "table.pagination.showing":
        "Showing {{from}} to {{to}} of {{total}} rows",

      // Plan
      "plan.free": "Free Plan",

      // Errors
      "errors.general": "An error occurred",
      "errors.auth.invalidEmail": "Invalid email",
      "errors.auth.wrongPassword": "Incorrect password",
      "errors.auth.emailInUse": "Email already in use",
      "errors.auth.weakPassword": "Password is too weak",
      "errors.network": "Network connection error",
    },
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "vi",
    debug: process.env.NODE_ENV !== "production",

    interpolation: {
      escapeValue: false, // React đã xử lý XSS
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
