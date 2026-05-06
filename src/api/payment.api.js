import api from "./axiosClient";
import axiosClient from "./axiosClient"; // Hoặc tên file config axios của bạn

export const paymentApi = {
  create: (applicationId, method = "VNPAY") =>
    api.post("/api/payments", {
      applicationId: String(applicationId),  // ⭐ FIX QUAN TRỌNG
      method: method,
    }),

    handleZaloPayCallback: (paymentId, status) => {
        // Chúng ta gửi một Object JSON giống như cấu trúc mà Backend đang đợi ở JSONObject
        const mockData = {
            paymentId: paymentId,
            status: status
        };

        // Gọi đến endpoint callback mà bạn đã viết ở Backend
        // Đảm bảo axios đã được import trong file này
        return axiosClient.post("/api/payments/zalopay/callback", mockData);
    },
};
