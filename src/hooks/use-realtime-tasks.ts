
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
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
};

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

  return { tasks, loading };
}
