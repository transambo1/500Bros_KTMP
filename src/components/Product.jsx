import React from "react";
import { Link } from "react-router-dom";

function Product({ product, onAdd }) {
    const { id, name, price, img, description, claim } = product;

    return (
        <>
            <div className="product-card">
                <img src={img} alt={name} />
                {/* Bọc thông tin sản phẩm vào một div */}
                <div className="product-info">
                    <h3>{name}</h3>
                    <p>{description}</p>
                    <span>Giá trị đền bù lên đến:{claim.toLocaleString()} VND</span>
                    <p>{price.toLocaleString()} VND</p>
                </div>
                <button className="add-to-cart-btn">
                    <Link to={`/Product-Detail/${product.id}`}>Xem chi tiết</Link>
                </button>
            </div>

        </>
    );
}

export default Product;