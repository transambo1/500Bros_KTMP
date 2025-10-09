// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, useParams } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import SellerOrders from "./components/SellerOrders";
import OrderHistory from "./components/OrderHistory";
import Checkout from "./components/Checkout";
import Home from "./components/Home";
import ManageProducts from "./components/manage/ManageProducts";
import ClaimList from "./components/manage/ClaimList";
import "./App.css";

function App() {
  // ==========================
  // 👤 Quản lý người dùng (key: "currentUser")
  // ==========================
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [searchTerm, setSearchTerm] = useState("");

  // ==========================
  // 🛒 Quản lý giỏ hàng
  // ==========================
  const [cart, setCart] = useState([]);

  // Khi user login → load giỏ hàng theo user
  useEffect(() => {
    if (currentUser) {
      try {
        const key = `cart_${encodeURIComponent(currentUser.username)}`;
        const raw = localStorage.getItem(key);
        setCart(raw ? JSON.parse(raw) : []);
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      } catch (err) {
        console.error("Load cart error:", err);
        setCart([]);
      }
    } else {
      setCart([]); // logout thì clear cart
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  // Lưu giỏ hàng mỗi khi thay đổi (nếu có user)
  useEffect(() => {
    if (currentUser) {
      const key = `cart_${encodeURIComponent(currentUser.username)}`;
      try {
        localStorage.setItem(key, JSON.stringify(cart));
      } catch (err) {
        console.error("Save cart error:", err);
      }
    } else {
      // nếu không có user, bạn có thể lưu tạm local cart (optional)
      localStorage.setItem("my_cart", JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  const handleAdd = (product) => {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx === -1) {
        return [...prev, { ...product, quantity: 1 }];
      }
      return prev.map((p) =>
        p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
      );
    });
  };

  const handleRemove = (productId) => {
    setCart((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleChangeQuantity = (productId, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((p) => p.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, quantity: qty } : p
        )
      );
    }
  };

  function MenuWrapper({ onAdd }) {
    const { category } = useParams();
    return <ProductList onAdd={onAdd} defaultCategory={category} />;
  }



  return (
    <div className="app">
      <Header
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
      />

      <main className="routes-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productlist" element={<ProductList onAdd={handleAdd} searchTerm={searchTerm} />} />
          <Route path="/menu/:category" element={<MenuWrapper onAdd={handleAdd} />} />
          <Route path="/menu" element={<ProductList onAdd={handleAdd} />} />
          <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Product-Detail/:id" element={<ProductDetail onAdd={handleAdd} />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/seller-orders" element={<SellerOrders />} />
          <Route path="/manage-products" element={<ManageProducts />} />
          <Route path="/claim-list" element={<ClaimList />} />
          <Route path="/cart" element={<Cart cart={cart} onRemove={handleRemove}
            onChangeQuantity={handleChangeQuantity}
            currentUser={currentUser}      // <<< truyền currentUser vào Cart
          />
          }
          />
          <Route path="/checkout" element={<Checkout cart={cart} currentUser={currentUser} setCart={setCart} />} /></Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
