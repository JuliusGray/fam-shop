import React from "react";

import { motion } from "framer-motion";
import "../../styles/product-card.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useDispatch } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";

const ProductCard = ({ item }) => {
  const dispatch = useDispatch();

  const addToCard = () => {
    dispatch(
      cartActions.addItem({
        id: item.id,
        productName: item.productName,
        price: item.price,
        imgUrl: item.imgUrl,
      })
    );
    toast.success(
      "Товар успешно добавлен в корзину. Вы можете продолжить покупки или перейти к оформлению заказа."
    );
  };

  return (
    <div className="product-card">
      <div className="product-card__img">
        <Link to={`/shop/${item.id}`} className="product-card__img">
          <img src={item.imgUrl} alt="" />
        </Link>
      </div>
      <div className="product-card__info">
        <h3 className="product-card__name">
          <Link to={`/shop/${item.id}`}>
            {item.productName.length > 24
              ? `${item.productName.slice(0, 24)}...`
              : item.productName}
          </Link>
        </h3>
        <span className="product-card__category">{item.category}</span>
      </div>
      <div className="product-card__bottom d-flex align-items-center justify-content-between p-2">
        <span className="product-card__price">{item.price}₽</span>
        <motion.span whileTap={{ scale: 1.5 }} onClick={addToCard}>
          <i class="ri-add-line"></i>
        </motion.span>
      </div>
    </div>
  );
};

export default ProductCard;
