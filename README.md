# DataHarvester - Thu thập dữ liệu một cách hiệu quả

DataHarvester là một ứng dụng web hiện đại cho phép người dùng thu thập dữ liệu từ các trang web phổ biến và yêu cầu giải pháp thu thập dữ liệu tùy chỉnh thông qua biểu mẫu liên hệ.

## Tính năng chính

- **Thu thập dữ liệu từ các trang web phổ biến**: Amazon, eBay, LinkedIn, Google Search, Tripadvisor và nhiều trang khác
- **Tùy chỉnh các trường dữ liệu**: Chọn chính xác dữ liệu bạn muốn thu thập (tiêu đề, giá, đánh giá, v.v.)
- **Bảng điều khiển quản lý**: Theo dõi và quản lý các nhiệm vụ thu thập dữ liệu
- **Yêu cầu tùy chỉnh**: Gửi yêu cầu cho dữ liệu phức tạp từ các trang web không được hỗ trợ sẵn
- **Xuất dữ liệu đa dạng**: Tải xuống dữ liệu dưới dạng CSV, JSON hoặc Excel
- **Hỗ trợ đa ngôn ngữ**: Tiếng Anh và tiếng Việt
- **Chế độ sáng/tối**: Giao diện người dùng linh hoạt thân thiện với mắt

## Công nghệ sử dụng

- **Frontend**: React, TypeScript, Vite
- **UI Component**: shadcn/ui, Tailwind CSS, Lucide Icons
- **State Management**: Context API và React Query
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Hosting**: Firebase Hosting

## Hướng dẫn cài đặt

### Yêu cầu

- Node.js (phiên bản 16 trở lên)
- npm hoặc yarn

### Các bước cài đặt

```sh
# Bước 1: Clone repository
git clone <URL_GIT_CỦA_BẠN>

# Bước 2: Di chuyển đến thư mục dự án
cd dataharvester

# Bước 3: Cài đặt các dependencies
npm install
# hoặc
yarn install

# Bước 4: Khởi động server phát triển
npm run dev
# hoặc
yarn dev
```

## Cấu trúc dự án

```
src/
├── components/        # Thành phần UI tái sử dụng
├── context/           # React Context cho trạng thái ứng dụng
├── hooks/             # Custom React hooks
├── i18n/              # Tài nguyên đa ngôn ngữ
├── lib/               # Các functions và tiện ích
├── pages/             # Các trang ứng dụng
```

## Ghi chú phát triển

### Firebase Setup

Để thiết lập Firebase cho dự án:

1. Tạo một dự án Firebase mới tại [Firebase Console](https://console.firebase.google.com/)
2. Bật tính năng Authentication và Firestore
3. Cập nhật thông tin cấu hình Firebase trong `src/lib/firebase.ts`
4. Triển khai Firestore rules từ tệp `firestore.rules`

### Tính năng đang phát triển

- Tích hợp thanh toán để hỗ trợ các gói nâng cao
- API Scraper tùy chỉnh cho các trang web phức tạp
- Phân tích dữ liệu và trực quan hóa
- Lên lịch thu thập dữ liệu tự động

## Giấy phép

Dự án này được cấp phép theo [MIT License](LICENSE).

## Liên hệ và hỗ trợ

Nếu bạn có bất kỳ câu hỏi nào, vui lòng gửi email đến [support@dataharvester.com](mailto:support@dataharvester.com) hoặc sử dụng biểu mẫu liên hệ trên trang web của chúng tôi.
