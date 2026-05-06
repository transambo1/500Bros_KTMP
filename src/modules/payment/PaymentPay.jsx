import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { paymentApi } from "../../api/payment.api"; // Đảm bảo bạn đã tạo file api này
import "./PaymentPay.css";

const BANK_LIST = [
    "Ngân hàng TMCP Ngoại thương (Vietcombank)",
    "Ngân hàng TMCP Kỹ thương (Techcombank)",
    "Ngân hàng TMCP Quân đội (MB Bank)",
    "Ngân hàng TMCP Công Thương (VietinBank)",
    "Ngân hàng TMCP Đầu tư và Phát triển (BIDV)",
    "Ngân hàng TMCP Á Châu (ACB)"
];

export default function PaymentPay() {
    const { id } = useParams(); // id này chính là paymentId từ URL
    const navigate = useNavigate();
    const location = useLocation();

    // 1. Lấy dữ liệu từ state (nếu có)
    const stateData = location.state || {};

    // 2. Nếu có state thì lưu vào localStorage để dự phòng, nếu không có (do F5) thì lôi từ localStorage ra
    if (stateData.app && stateData.paymentId) {
        localStorage.setItem("mock_payment_app", JSON.stringify(stateData.app));
        localStorage.setItem("mock_payment_id", stateData.paymentId);
        localStorage.setItem("mock_payment_amount", stateData.amount);
        localStorage.setItem("mock_payment_applicant", JSON.stringify(stateData.applicant));
    }

    // 3. Khôi phục dữ liệu
    const app = stateData.app || JSON.parse(localStorage.getItem("mock_payment_app"));
    const paymentId = stateData.paymentId || localStorage.getItem("9027663059098992767");
    const amount = stateData.amount || localStorage.getItem("mock_payment_amount");
    const applicant = stateData.applicant || JSON.parse(localStorage.getItem("mock_payment_applicant"));

    const [selectedBank, setSelectedBank] = useState(BANK_LIST[0]);
    const [accountNumber, setAccountNumber] = useState("");
    const [accountOwner, setAccountOwner] = useState("");
    const [loading, setLoading] = useState(false);

    // Bây giờ check điều kiện này sẽ cực kỳ an toàn
    if (!app || !paymentId) {
        return (
            <div className="payment-error" style={{ textAlign: 'center', marginTop: '50px' }}>
                <h3>Không tìm thấy phiên thanh toán!</h3>
                <p>Vui lòng quay lại trang chi tiết hồ sơ để thực hiện lại.</p>
                <button className="btn-secondary" onClick={() => navigate(-1)}>← Quay lại</button>
            </div>
        );
    }

    const formatMoney = (v) =>
        v !== null && v !== undefined
            ? Number(v).toLocaleString("vi-VN") + " VND"
            : "0 VND";

    const handleAccountNumberChange = (e) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return;
        setAccountNumber(value);
        if (value.length > 0) {
            setAccountOwner("CONG TY BAO HIEM 500BROS");
        } else {
            setAccountOwner("");
        }
    };

    // Hàm gọi Mock Callback của Backend để duyệt hồ sơ
    const handleConfirmPayment = async () => {
        try {
            setLoading(true);
            // Gọi API Mock Callback mà bạn đã viết trong Java
            // Endpoint này sẽ set Payment SUCCESS và Application APPROVED
            await paymentApi.handleZaloPayCallback(paymentId, "success");

            alert("Xác nhận thanh toán thành công! Hồ sơ của bạn đã được phê duyệt.");
            navigate(`/application/${app.id}`); // Quay lại trang chi tiết để xem trạng thái mới
        } catch (err) {
            console.error("Lỗi xác nhận:", err);
            alert("Có lỗi xảy ra khi xác nhận thanh toán!!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-container">
            <div className="payment-header">
                <h2>Thanh toán Hồ sơ #{app.id}</h2>
                <p>Vui lòng nhập thông tin ngân hàng để tiến hành mô phỏng thanh toán.</p>
            </div>
            <div className="payment-grid">
                {/* CỘT 1: THÔNG TIN HỒ SƠ */}
                <div className="payment-card summary-card">
                    <h3>Thông tin đơn hàng</h3>
                    <div className="info-row">
                        <span className="label">Mã hồ sơ:</span>
                        <span className="value bold">#{app.id}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Sản phẩm:</span>
                        <span className="value">{app.productName || "-"}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Người yêu cầu:</span>
                        <span className="value">{applicant || "-"}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Mã thanh toán (ID):</span>
                        <span className="value">#{paymentId}</span>
                    </div>
                    <div className="payment-note" style={{marginTop: 'auto'}}>
                        <small>* Dữ liệu thanh toán được khởi tạo thực tế từ hệ thống.</small>
                    </div>
                    <hr />
                    <div className="info-row total-row">
                        <span className="label">Tổng thanh toán:</span>
                        <span className="value money highlight">{formatMoney(amount)}</span>
                    </div>
                </div>

                {/* CỘT 2: THÔNG TIN CHUYỂN KHOẢN MÔ PHỎNG */}
                <div className="payment-card bank-card">
                    <h3>Thông tin ngân hàng</h3>

                    <div className="bank-details">
                        <div className="info-row">
                            <span className="label">Ngân hàng:</span>
                            <div className="value">
                                <select
                                    className="form-control"
                                    value={selectedBank}
                                    onChange={(e) => setSelectedBank(e.target.value)}
                                >
                                    {BANK_LIST.map((bank, index) => (
                                        <option key={index} value={bank}>{bank}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="info-row">
                            <span className="label">Số tài khoản:</span>
                            <div className="value">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập số tài khoản..."
                                    value={accountNumber}
                                    onChange={handleAccountNumberChange}
                                />
                            </div>
                        </div>

                        <div className="info-row">
                            <span className="label">Chủ tài khoản:</span>
                            <span className="value bold account-owner">
                {accountOwner || <span className="placeholder-text">Sẽ hiển thị khi nhập STK...</span>}
              </span>
                        </div>

                        <div className="info-row">
                            <span className="label">Số tiền:</span>
                            <span className="value money">{formatMoney(amount)}</span>
                        </div>

                        <div className="info-row">
                            <span className="label">Nội dung CK:</span>
                            <span className="value transfer-content">THANH TOAN HO SO {app.id}</span>
                        </div>
                    </div>

                    <div className="payment-note">
                        <small>
                            * Lưu ý: Đây là trang mô phỏng thanh toán. Khi nhấn xác nhận, hệ thống sẽ gọi API Callback để cập nhật trạng thái hồ sơ của bạn.
                        </small>
                    </div>
                </div>
            </div>

            <div className="payment-actions">
                <button className="btn-secondary" onClick={() => navigate(-1)} disabled={loading}>
                    ← Quay lại
                </button>
                <button
                    className="btn-primary"
                    onClick={handleConfirmPayment}
                    disabled={!accountNumber || loading}
                >
                    {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
                </button>
            </div>
        </div>
    );
}