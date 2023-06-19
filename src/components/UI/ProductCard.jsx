import React from "react";

import { motion } from "framer-motion";
import "../../styles/product-card.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../redux/slices/cartSlice";

const ProductCard = ({ item }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const addToCart = () => {
    const availableInDB = item.qut;
    const alreadyInCart = cartItems.find((cartItem) => cartItem.id === item.id);

    if (availableInDB === 0) {
      toast.error("Товара нет в наличии.");
      return;
    }

    if (alreadyInCart && alreadyInCart.quantity >= 10) {
      toast.warning("Вы уже добавили максимальное количество товара в корзину.");
      return;
    }

    if (alreadyInCart) {
      const totalQuantity = alreadyInCart.quantity + 1;
      if (totalQuantity <= availableInDB) {
        dispatch(
          cartActions.updateItem({
            id: item.id,
            quantity: totalQuantity,
          })
        );
        toast.success(
          "Товар успешно добавлен в корзину. Вы можете продолжить покупки или перейти к оформлению заказа."
        );
      } else {
        toast.warning(
          "Доступное количество товара недостаточно для добавления в корзину."
        );
      }
    } else {
      if (1 <= availableInDB) {
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
      } else {
        toast.warning(
          "Доступное количество товара недостаточно для добавления в корзину."
        );
      }
    }
  };

  const renderAddToCartButton = () => {
    if (item.qut === 0) {
      return <p>Товара нет в наличии</p>;
    } else {
      return (
        <div className="product-card__bottom d-flex align-items-center justify-content-between p-2">
          <span className="product-card__price">{item.price}₽</span>
          <motion.span whileTap={{ scale: 1.5 }} onClick={addToCart}>
            <i class="ri-add-line"></i>
          </motion.span>
        </div>
      );
    }
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
      {renderAddToCartButton()}
    </div>
  );
};

export default ProductCard;
