// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

function Header({ cartCount, currentUser, setCurrentUser }) {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const categories = [
        { key: "All", label: "Tất cả" },
        { key: "Bảo hiểm Cá nhân", label: "Bảo hiểm Cá nhân" },
        { key: "Bảo hiểm Y tế ", label: "Bảo hiểm  Y tế " },
        { key: "Bảo hiểm Sức khỏe", label: "Bảo hiểm Sức khỏe" },
        { key: "Bảo hiểm Công ty", label: "Bảo hiểm Công ty" }
    ];

    // src/components/Header.jsx (chỉ cần ensure)
    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem("currentUser"); // key chuẩn
        navigate("/");
    };


    return (
        <header className="header">
            <div className="header-left">
                <img src="/Images/Logo.png" alt="MEOWCHICK Logo" />
            </div>

            <div className="header-right">
                <div><button onClick={() => navigate("/")}>Trang chủ</button></div>
                <div
                    className="menu-dropdown"
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                    style={{ position: "relative" }}
                >
                    <button>Bảo hiểm</button>
                    {showDropdown && (
                        <div className="dropdown-content">
                            {categories.map((c) => (
                                <Link
                                    key={c.key}
                                    to={`/menu/${encodeURIComponent(c.key)}`}
                                >
                                    <img src={c.img} />
                                    {c.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                <div><button onClick={() => navigate("/")}>Tin tức</button></div>
                <div><button onClick={() => navigate("/")}>Chi nhánh</button></div>
                <div><button onClick={() => navigate("/")}>Về chúng tôi</button></div>

                {/* Hiển thị giỏ hàng chỉ khi user không phải admin */}


                {currentUser?.role === "admin" && (
                    <div>
                        <button onClick={() => navigate("/claim-list")}>
                            Quản lý bồi thường
                        </button>

                        <button onClick={() => navigate("/seller-orders")}>
                            Quản lý hợp đồng
                        </button>

                        <button onClick={() => navigate("/manage-products")}>
                            Quản lí bảo hiểm
                        </button>
                    </div>
                )
                }

                <div className="user-actions">
                    {currentUser ? (
                        <div className="user-menu" style={{ position: "relative" }}>
                            <div
                                onClick={() => setShowMenu(!showMenu)}
                                style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                            >
                                <FaUserCircle size={22} style={{ marginRight: "6px" }} />
                                <span>{currentUser.username}</span>
                            </div>

                            {showMenu && (
                                <div
                                    className="dropdown"
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        right: 0,
                                        background: "#fff",
                                        border: "1px solid #ccc",
                                        padding: "10px",
                                        borderRadius: "5px",
                                        marginTop: "5px",
                                        minWidth: "150px",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    <button
                                        onClick={() => navigate("/order-history")}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            width: "100%",
                                            textAlign: "left",
                                            marginBottom: "5px",
                                            color: "black"
                                        }}
                                    >
                                        Lịch sử Bảo hiểm
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            width: "100%",
                                            textAlign: "left",
                                            color: "black",
                                        }}
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/Login">Đăng nhập</Link>
                    )}
                </div>
            </div >
        </header >
    );
}

export default Header;

