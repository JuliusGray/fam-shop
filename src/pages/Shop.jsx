import React, { useState } from "react";

import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col } from "reactstrap";

import "../styles/shop.css";

import products from "../assets/data/products";
import ProductList from "../components/UI/ProductList";
import useGetData from "../custom-hooks/useGetData";

const Shop = () => {
  // const [productsData, setProductsData] = useState(products);
  const { data: products, loading } = useGetData("products");

  // const handleFilter = (e) => {
  //   const filterValue = e.target.value;
  //   if (filterValue === "Хлеб и выпечка") {
  //     const filteredProducts = products.filter(
  //       (item) => item.category === "Хлеб и выпечка"
  //     );

  //     setProductsData(filteredProducts);
  //   }
  //   if (filterValue === "Фрукты и овощи") {
  //     const filteredProducts = products.filter(
  //       (item) => item.category === "Фрукты и овощи"
  //     );

  //     setProductsData(filteredProducts);
  //   }
  //   if (filterValue === "Молоко, сыр, яйцо") {
  //     const filteredProducts = products.filter(
  //       (item) => item.category === "Молоко, сыр, яйцо"
  //     );

  //     setProductsData(filteredProducts);
  //   }
  // };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;

    const searchedProducts = products.filter((item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setProductsData(searchedProducts);
  };

  return (
    <Helmet title="Магазин">
      <CommonSection title="Продукты" />
      <section>
        <Container>
          <Row>
            <Col lg="3" md="6">
              <div className="filter__widget">
                <select onChange={handleFilter}>
                  <option>Категории</option>
                  <option value="Хлеб и выпечка">Хлеб и выпечка</option>
                  <option value="Фрукты и овощи">Фрукты и овощи</option>
                  <option value="Мясо, птица, колбаса">
                    Мясо, птица, колбаса
                  </option>
                  <option value="Молоко, сыр, яйцо">Молоко, сыр, яйцо</option>
                  <option value="Бакалея">Бакалея</option>
                  <option value="Рыба и морепродукты">
                    Рыба и морепродукты
                  </option>
                  <option value="Кондитерские изделия">
                    Кондитерские изделия
                  </option>
                  <option value="Чай, кофе, какао">Чай, кофе, какао</option>
                </select>
              </div>
            </Col>
            <Col lg="3" md="6" className="text-end">
              <div className="filter__widget">
                <select>
                  {/* <option>Сортировать:</option> */}
                  <option value="По популярности">По популярности</option>
                  <option value="Сначала дешевые">Сначала дешевые</option>
                  <option value="Сначала дорогие">Сначала дорогие</option>
                  <option value="По рейтингу">По рейтингу</option>
                  <option value="По размеру скидки">По размеру скидки</option>
                </select>
              </div>
            </Col>
            <Col lg="6" md="12">
              <div className="search__box">
                <input
                  type="text"
                  placeholder="Поиск...."
                  onChange={handleSearch}
                />
                <span>
                  <i class="ri-search-line"></i>
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="pt-0">
        <Container>
          <Row>
            {products.length === 0 ? (
              <h1 className="text-center fs-4">Продукты не найдены!</h1>
            ) : (
              <ProductList data={products} />
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Shop;
