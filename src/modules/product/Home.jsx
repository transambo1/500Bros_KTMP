import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoryApi } from "../../api/category.api";
import "./Home.css";
import Banner from "../../components/layout/Banner";

export default function Home() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            // 2. Gọi hàm mới getActive() thay vì gọi api.get thủ công
            const res = await categoryApi.getActive();

            setCategories(res.data.data.items || []);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="home-container">
            <Banner images={["https://picsum.photos/seed/picsum/200/300", "https://picsum.photos/200/300?grayscale"]} />

            <section className="category-section">
                <h2 className="section-title">Danh mục bảo hiểm phổ biến</h2>

                <div className="category-grid">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="category-card shadow-soft"
                        >
                            <img src="https://picsum.photos/200" className="category-img" />

                            <div className="card-content">
                                <h3>{cat.name}</h3>
                                <p>{cat.description || "Không có mô tả"}</p>

                                <button
                                    className="btn-detail"
                                    onClick={() => navigate(`/menu/${cat.id}`)}
                                >
                                    Xem chi tiết
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
