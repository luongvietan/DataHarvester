import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
  addDoc,
  deleteDoc,
  serverTimestamp,
  DocumentReference,
} from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";
import { useApiError } from "./use-api-error";

// Kiểu dữ liệu task
export type Task = {
  id: string;
  userId: string;
  website: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  notified?: boolean;
  createdAt: Date;
  completedAt?: Date;
  items?: number;
  result?: string;
  fields?: string[];
  searchTerm?: string;
  searchLocation?: string;
  resultsLimit?: number;
  error?: string;
};

// Kiểu dữ liệu cho task mới
export type NewTask = Omit<Task, "id" | "createdAt" | "completedAt">;

export function useRealtimeTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { handleError } = useApiError();

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Tạo query lấy các task của user
    const tasksRef = collection(db, "scrapingTasks");
    const q = query(tasksRef, where("userId", "==", userId));

    // Đăng ký lắng nghe sự thay đổi
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const updatedTasks: Task[] = [];
        const newCompletedTasks: Task[] = [];

        snapshot.forEach((doc) => {
          const taskData = doc.data();
          const task = {
            id: doc.id,
            ...taskData,
            createdAt:
              taskData.createdAt instanceof Date
                ? taskData.createdAt
                : taskData.createdAt instanceof Timestamp
                ? new Date(taskData.createdAt.seconds * 1000)
                : new Date(),
            completedAt: taskData.completedAt
              ? taskData.completedAt instanceof Date
                ? taskData.completedAt
                : taskData.completedAt instanceof Timestamp
                ? new Date(taskData.completedAt.seconds * 1000)
                : undefined
              : undefined,
          } as Task;

          updatedTasks.push(task);

          // Kiểm tra xem task mới hoàn thành chưa được thông báo
          if (task.status === "completed" && !task.notified) {
            newCompletedTasks.push(task);

            // Cập nhật trạng thái đã thông báo
            try {
              updateDoc(doc.ref, { notified: true });
            } catch (err) {
              console.error("Error updating notification status:", err);
            }
          }
        });

        // Sắp xếp theo thời gian tạo mới nhất
        updatedTasks.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        setTasks(updatedTasks);
        setLoading(false);

        // Hiển thị thông báo cho task mới hoàn thành
        if (newCompletedTasks.length === 1) {
          toast({
            title: "Nhiệm vụ hoàn thành",
            description: `Dữ liệu từ ${newCompletedTasks[0].website} đã sẵn sàng để tải xuống.`,
          });
        } else if (newCompletedTasks.length > 1) {
          toast({
            title: "Nhiệm vụ hoàn thành",
            description: `${newCompletedTasks.length} nhiệm vụ đã hoàn thành và sẵn sàng để tải xuống.`,
          });
        }
      },
      (error) => {
        handleError(error, "Không thể tải dữ liệu nhiệm vụ");
        setLoading(false);
      }
    );

    // Hủy đăng ký khi component unmount
    return () => unsubscribe();
  }, [userId, toast, handleError]);

  // Thêm task mới
  const addTask = useCallback(
    async (taskData: NewTask): Promise<string> => {
      if (!userId) throw new Error("Người dùng chưa đăng nhập");

      try {
        const tasksRef = collection(db, "scrapingTasks");
        const docRef = await addDoc(tasksRef, {
          ...taskData,
          createdAt: serverTimestamp(),
          userId,
          status: "pending", // Đảm bảo luôn bắt đầu với trạng thái "pending"
          notified: false,
        });

        toast({
          title: "Nhiệm vụ đã được tạo",
          description:
            "Nhiệm vụ thu thập dữ liệu của bạn đã được thêm vào hàng đợi.",
        });

        return docRef.id;
      } catch (error) {
        handleError(error, "Không thể tạo nhiệm vụ mới");
        throw error;
      }
    },
    [userId, toast, handleError]
  );

  // Cập nhật task
  const updateTask = useCallback(
    async (taskId: string, updates: Partial<Task>): Promise<void> => {
      if (!userId) throw new Error("Người dùng chưa đăng nhập");

      try {
        const taskRef = doc(db, "scrapingTasks", taskId);

        // Đảm bảo người dùng chỉ cập nhật task của chính họ
        const task = tasks.find((t) => t.id === taskId);
        if (!task || task.userId !== userId) {
          throw new Error("Không có quyền cập nhật nhiệm vụ này");
        }

        const updateData: Record<string, unknown> = { ...updates };

        // Nếu cập nhật trạng thái thành "completed", tự động thêm completedAt
        if (updates.status === "completed" && !updates.completedAt) {
          updateData.completedAt = serverTimestamp();
        }

        await updateDoc(taskRef, updateData);

        toast({
          title: "Nhiệm vụ đã được cập nhật",
          description: "Các thay đổi đã được lưu thành công.",
        });
      } catch (error) {
        handleError(error, "Không thể cập nhật nhiệm vụ");
        throw error;
      }
    },
    [userId, tasks, toast, handleError]
  );

  // Xóa task
  const deleteTask = useCallback(
    async (taskId: string): Promise<void> => {
      if (!userId) throw new Error("Người dùng chưa đăng nhập");

      try {
        const taskRef = doc(db, "scrapingTasks", taskId);

        // Đảm bảo người dùng chỉ xóa task của chính họ
        const task = tasks.find((t) => t.id === taskId);
        if (!task || task.userId !== userId) {
          throw new Error("Không có quyền xóa nhiệm vụ này");
        }

        await deleteDoc(taskRef);

        toast({
          title: "Nhiệm vụ đã được xóa",
          description: "Nhiệm vụ đã được xóa thành công khỏi hệ thống.",
        });
      } catch (error) {
        handleError(error, "Không thể xóa nhiệm vụ");
        throw error;
      }
    },
    [userId, tasks, toast, handleError]
  );

  // Lấy task theo ID
  const getTaskById = useCallback(
    (taskId: string): Task | undefined => {
      return tasks.find((task) => task.id === taskId);
    },
    [tasks]
  );

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    getTaskById,
  };
}
