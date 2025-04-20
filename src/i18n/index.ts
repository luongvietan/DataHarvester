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
      "dashboard.welcome": "Chào mừng, {{name}}!",
      "dashboard.stats.totalTasks": "Tổng số nhiệm vụ",
      "dashboard.stats.activeTasks": "Nhiệm vụ đang chạy",
      "dashboard.stats.completedTasks": "Nhiệm vụ hoàn thành",
      "dashboard.stats.pendingRequests": "Yêu cầu đang chờ",
      "dashboard.recentTasks": "Nhiệm vụ gần đây",
      "dashboard.newTask": "Nhiệm vụ mới",
      "dashboard.viewAll": "Xem tất cả",

      // Scraper
      "scraper.title": "Thu thập dữ liệu",
      "scraper.website": "Chọn trang web",
      "scraper.fields": "Chọn dữ liệu cần thu thập",
      "scraper.params": "Tham số tìm kiếm",
      "scraper.start": "Bắt đầu thu thập",
      "scraper.results": "Kết quả",
      "scraper.download": "Tải xuống",

      // Thông báo
      "notifications.taskComplete": "Nhiệm vụ hoàn thành",
      "notifications.taskFailed": "Nhiệm vụ thất bại",
      "notifications.welcome": "Chào mừng đến với DataHarvester",

      // Lỗi
      "errors.general": "Đã xảy ra lỗi",
      "errors.auth.invalidEmail": "Email không hợp lệ",
      "errors.auth.wrongPassword": "Mật khẩu không chính xác",
      "errors.auth.emailInUse": "Email đã được sử dụng",
      "errors.auth.weakPassword": "Mật khẩu quá yếu",
      "errors.network": "Lỗi kết nối mạng",

      // Bảng
      "table.noData": "Không có dữ liệu",
      "table.loading": "Đang tải...",
      "table.pagination.next": "Tiếp",
      "table.pagination.prev": "Trước",
      "table.pagination.showing":
        "Hiển thị {{from}} đến {{to}} trong tổng số {{total}} dòng",
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
      "dashboard.welcome": "Welcome, {{name}}!",
      "dashboard.stats.totalTasks": "Total Tasks",
      "dashboard.stats.activeTasks": "Active Tasks",
      "dashboard.stats.completedTasks": "Completed Tasks",
      "dashboard.stats.pendingRequests": "Pending Requests",
      "dashboard.recentTasks": "Recent Tasks",
      "dashboard.newTask": "New Task",
      "dashboard.viewAll": "View All",

      // Scraper
      "scraper.title": "Data Scraper",
      "scraper.website": "Select Website",
      "scraper.fields": "Select Data Fields",
      "scraper.params": "Search Parameters",
      "scraper.start": "Start Scraping",
      "scraper.results": "Results",
      "scraper.download": "Download",

      // Notifications
      "notifications.taskComplete": "Task Complete",
      "notifications.taskFailed": "Task Failed",
      "notifications.welcome": "Welcome to DataHarvester",

      // Errors
      "errors.general": "An error occurred",
      "errors.auth.invalidEmail": "Invalid email",
      "errors.auth.wrongPassword": "Incorrect password",
      "errors.auth.emailInUse": "Email already in use",
      "errors.auth.weakPassword": "Password is too weak",
      "errors.network": "Network connection error",

      // Table
      "table.noData": "No data",
      "table.loading": "Loading...",
      "table.pagination.next": "Next",
      "table.pagination.prev": "Previous",
      "table.pagination.showing":
        "Showing {{from}} to {{to}} of {{total}} rows",
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
