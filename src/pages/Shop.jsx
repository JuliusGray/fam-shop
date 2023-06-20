import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import ProductList from "../components/UI/ProductList";
import useGetData from "../custom-hooks/useGetData";
import "../styles/shop.css";

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: products, loading } = useGetData("products");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    setSelectedCategory("");
  };

  const handleCategoryFilter = (e) => {
    const selectedCategory = e.target.value;
    setSelectedCategory(selectedCategory);
  };

  const getFilteredProducts = () => {
    let filteredProducts = products;

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (item) => item.category === selectedCategory
      );
    }

    if (searchTerm) {
      filteredProducts = filteredProducts.filter((item) =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredProducts;
  };

  return (
    <Helmet title="Магазин">
      <CommonSection title="Продукты" />
      <section>
        <Container>
          <Row>
            <Col lg="3" md="6">
              <div className="filter__widget">
                <select
                  value={selectedCategory}
                  onChange={handleCategoryFilter}
                >
                  <option value="">Категории</option>
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
            {/* <Col lg="3" md="6" className="text-end">
              <div className="filter__widget">
                <select>
                  <option value="По популярности">По популярности</option>
                  <option value="Сначала дешевые">Сначала дешевые</option>
                  <option value="Сначала дорогие">Сначала дорогие</option>
                  <option value="По рейтингу">По рейтингу</option>
                  <option value="По размеру скидки">По размеру скидки</option>
                </select>
              </div>
            </Col> */}
            <Col lg="6" md="12">
              <div className="search__box">
                <input
                  type="text"
                  placeholder="Поиск...."
                  onChange={handleSearch}
                />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="pt-0">
        <Container>
          <Row>
            {loading ? (
              <h1 className="text-center fs-4">Загрузка...</h1>
            ) : products.length === 0 ? (
              <h1 className="text-center fs-4">Продукты не найдены!</h1>
            ) : (
              <ProductList data={getFilteredProducts()} />
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Shop;
