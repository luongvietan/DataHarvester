import { useToast } from "@/components/ui/use-toast";

type ErrorWithCode = {
  code?: string;
  message: string;
};

export const useApiError = () => {
  const { toast } = useToast();

  const handleError = (error: unknown, customMessage = "Có lỗi xảy ra") => {
    console.error(error);

    // Xử lý lỗi Firebase Auth
    if ((error as ErrorWithCode).code?.startsWith("auth/")) {
      const errorCode = (error as ErrorWithCode).code;
      const errorMap: Record<string, string> = {
        "auth/user-not-found": "Không tìm thấy tài khoản với email này",
        "auth/wrong-password": "Mật khẩu không chính xác",
        "auth/email-already-in-use": "Email này đã được sử dụng",
        "auth/weak-password": "Mật khẩu quá yếu",
        "auth/invalid-email": "Email không hợp lệ",
        "auth/operation-not-allowed": "Thao tác này không được phép",
        "auth/account-exists-with-different-credential":
          "Tài khoản đã tồn tại với phương thức đăng nhập khác",
        "auth/requires-recent-login":
          "Vui lòng đăng nhập lại để thực hiện thao tác này",
      };

      toast({
        title: "Lỗi xác thực",
        description: errorCode
          ? errorMap[errorCode] || (error as ErrorWithCode).message
          : customMessage,
        variant: "destructive",
      });
      return;
    }

    // Xử lý lỗi Firestore
    if ((error as ErrorWithCode).code?.startsWith("firestore/")) {
      toast({
        title: "Lỗi cơ sở dữ liệu",
        description: (error as ErrorWithCode).message || customMessage,
        variant: "destructive",
      });
      return;
    }

    // Xử lý lỗi network
    if (
      error instanceof TypeError &&
      (error.message.includes("fetch") || error.message.includes("network"))
    ) {
      toast({
        title: "Lỗi kết nối",
        description: "Kiểm tra kết nối internet của bạn và thử lại",
        variant: "destructive",
      });
      return;
    }

    // Lỗi mặc định
    toast({
      title: "Lỗi",
      description: (error as Error)?.message || customMessage,
      variant: "destructive",
    });
  };

  return { handleError };
};
