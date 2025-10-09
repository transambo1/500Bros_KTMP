import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // 👉 nhớ import file CSS nhé
import Banner from "./Banner";
export default function Home() {
    const navigate = useNavigate();
    const bannerImages = ["/Images/nhantho1.jpg", "/Images/nhantho.jpg", "/Images/image.png"];
    const categories = [
        {
            name: "Bảo hiểm Cá nhân",
            img: "/Images/Logo.png",
            desc: "Giải pháp bảo vệ toàn diện cho bạn và gia đình.",
        },
        {
            name: "Bảo hiểm Y tế",
            img: "/Images/Logo.png",
            desc: "Đảm bảo chi phí khám chữa bệnh khi rủi ro xảy ra.",
        },
        {
            name: "Bảo hiểm Sức khỏe",
            img: "/Images/Logo.png",
            desc: "Giúp bạn an tâm chăm sóc sức khỏe lâu dài.",
        },
        {
            name: "Bảo hiểm Công ty",
            img: "/Images/Logo.png",
            desc: "Bảo vệ nhân viên và tài sản doanh nghiệp của bạn.",
        },
    ];

    return (
        <div className="home-container">
            {/* Banner giới thiệu */}
            <Banner images={bannerImages} />

            {/* Danh mục bảo hiểm */}
            <section className="category-section">
                <h2>Danh mục bảo hiểm phổ biến</h2>

                <div className="category-grid">
                    {categories.map((category) => (
                        <div
                            key={category.name}
                            className="category-card"
                            onClick={() =>
                                navigate(`/menu/${encodeURIComponent(category.name)}`)
                            }
                        >
                            <img src={category.img} alt={category.name} />
                            <div className="card-content">
                                <h3>{category.name}</h3>
                                <p>{category.desc}</p>
                                <button
                                    onClick={() =>
                                        navigate(`/menu/${encodeURIComponent(category.name)}`)
                                    }
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Lý do chọn */}
            <section className="why-choose">
                <h2>Vì sao chọn Bảo Hiểm An Tâm?</h2>
                <p>
                    Chúng tôi hợp tác với nhiều công ty bảo hiểm hàng đầu, cung cấp các
                    gói bảo hiểm minh bạch, dễ hiểu và đáng tin cậy. Hãy an tâm vì sự an
                    toàn của bạn và người thân được đặt lên hàng đầu.
                </p>
            </section>
        </div>
    );
}
