import React, { useEffect, useState } from "react";
// 1. IMPORT useParams và useNavigate
import { useNavigate, useParams } from "react-router-dom";
import { productApi } from "../../api/product.api";
import { categoryApi } from "../../api/category.api";
import "./ProductList.css";

export default function ProductList() {
    const navigate = useNavigate();

    // 2. LẤY ID DANH MỤC TỪ URL (Ví dụ: /menu/5 -> categoryId = 5)
    const { categoryId: paramCategoryId } = useParams();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    // 3. KHỞI TẠO STATE: Nếu trên URL có ID thì lấy ID đó, không thì là "all"
    const [selectedCategory, setSelectedCategory] = useState(paramCategoryId || "all");
    const [searchText, setSearchText] = useState("");

    // Pagination states
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // --- LOAD DANH MỤC (Chỉ lấy Active) ---
    const loadCategories = async () => {
        try {
            const res = await categoryApi.getActive();
            setCategories(res.data.data.items || []);
        } catch (err) {
            console.error("Lỗi tải danh mục:", err);
        }
    };

    // --- LOAD SẢN PHẨM ---
    const loadProducts = async () => {
        try {
            let res;
            // Nếu đang chọn "Tất cả"
            if (selectedCategory === "all") {
                // searchAll: tìm trong tất cả sản phẩm active
                res = await productApi.searchAll(searchText, page, 3);
            } else {
                // getByCategory: tìm theo ID danh mục
                res = await productApi.getByCategory(selectedCategory, searchText, page, 6);
            }

            const data = res.data.data;
            setProducts(data.items || []);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error("Lỗi tải sản phẩm:", err);
            setProducts([]); // Clear list nếu lỗi
        }
    };

    // --- [QUAN TRỌNG] ĐỒNG BỘ URL VÀO STATE ---
    // Khi URL thay đổi (VD: bấm back/forward hoặc bấm từ Home), cập nhật selectedCategory
    useEffect(() => {
        if (paramCategoryId) {
            setSelectedCategory(paramCategoryId);
        } else {
            setSelectedCategory("all");
        }
    }, [paramCategoryId]);

    // --- XỬ LÝ KHI THAY ĐỔI FILTER ---
    // Khi đổi danh mục hoặc từ khoá tìm kiếm -> Reset về trang 1 và load lại
    useEffect(() => {
        setPage(1);
        loadProducts();
    }, [selectedCategory, searchText]);

    // Khi đổi trang (Page) -> Load lại (không reset page)
    useEffect(() => {
        loadProducts();
    }, [page]);

    // Chạy 1 lần đầu tiên để lấy danh sách Category sidebar
    useEffect(() => {
        loadCategories();
    }, []);

    return (
        <div className="showcase-wrapper">

            {/* --- SIDEBAR --- */}
            <aside className="showcase-sidebar">

                {/* SEARCH BOX */}
                <input
                    type="text"
                    className="sidebar-search"
                    placeholder="🔍 Tìm sản phẩm..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                <h3 className="sidebar-title">Danh mục</h3>

                {/* NÚT TẤT CẢ */}
                <div
                    className={`sidebar-item ${selectedCategory === "all" ? "active" : ""}`}
                    onClick={() => {
                        // Cập nhật State
                        setSelectedCategory("all");
                        // Cập nhật URL về trang gốc /productlist
                        navigate("/productlist");
                    }}
                >
                    Tất cả bảo hiểm
                </div>

                {/* LIST DANH MỤC TỪ API */}
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        // So sánh String để đảm bảo chính xác
                        className={`sidebar-item ${String(selectedCategory) === String(cat.id) ? "active" : ""}`}
                        onClick={() => {
                            // Cập nhật State
                            setSelectedCategory(String(cat.id));
                            // Cập nhật URL sang dạng /menu/ID
                            navigate(`/menu/${cat.id}`);
                        }}
                    >
                        {cat.name}
                    </div>
                ))}
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="showcase-main">
                <h2 className="main-title">
                    {selectedCategory === "all"
                        ? "Tất cả bảo hiểm"
                        : categories.find((c) => String(c.id) === String(selectedCategory))?.name || "Danh sách sản phẩm"}
                </h2>

                {/* PRODUCT GRID */}
                <div className="product-grid-new">
                    {products.map((p) => (
                        <div
                            key={p.id}
                            className="product-card-new"
                            onClick={() => navigate(`/Product-Detail/${p.id}`)}
                        >
                            <img src="https://picsum.photos/200" className="product-thumb" />

                            <div className="product-info">
                                <div className="product-title">{p.name}</div>
                                <div className="product-description">
                                    {p.description?.length > 80
                                        ? p.description.slice(0, 80) + "..."
                                        : p.description}
                                </div>
                            </div>

                            <button className="btn-detail">Xem chi tiết</button>
                        </div>
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="empty-state">
                        <p>Không tìm thấy sản phẩm nào phù hợp.</p>
                    </div>
                )}

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="pagination-wrapper">
                        <button
                            className={`pagination-btn ${page === 1 ? "disabled" : ""}`}
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            ◀
                        </button>

                        <span className="pagination-info">
                            Trang {page} / {totalPages}
                        </span>

                        <button
                            className={`pagination-btn ${page === totalPages ? "disabled" : ""}`}
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            ▶
                        </button>
                    </div>
                )}

            </main>
        </div>
    );
}