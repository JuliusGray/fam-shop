import React, { useState } from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { toast } from "react-toastify";
import { db, storage } from "../firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AddProducts = () => {
  const [enterTitle, setTitle] = useState("");
  const [enterShortDesc, setShortDesc] = useState("");
  const [enterDesc, setDesc] = useState("");
  const [enterCategory, setCategory] = useState("");
  const [enterPrice, setPrice] = useState("");
  const [enterProdImg, setProdImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isImageUploaded, setImageUploaded] = useState(false);

  const navigate = useNavigate();

  const addProd = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = collection(db, "products");

      const storageRef = ref(
        storage,
        `productImages/${Date.now() + "_" + enterProdImg.name}`
      );

      const uploadTask = uploadBytesResumable(storageRef, enterProdImg);

      uploadTask.on(
        "state_changed",
        null,
        () => {
          toast.error("изображение не загружено!");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) => {
            await addDoc(docRef, {
              productName: enterTitle,
              shortDesc: enterShortDesc,
              desc: enterDesc,
              category: enterCategory,
              price: enterPrice,
              imgUrl: downloadUrl,
              rating: "0"
            });
          });
        }
      );
      setImageUploaded(true);
      toast.success("Товар добавлен!");
      navigate("/dashboard/all-products");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Товар не добавлен!");
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
            {loading ? (
              <h4 className="py-5">Loading....</h4>
            ) : (
              <>
                <h4 className="mb-5">Добавить товар</h4>
                <Form onSubmit={addProd}>
                  <FormGroup className="form__group">
                    <span>Название товара</span>
                    <input
                      type="text"
                      placeholder="Введите название"
                      value={enterTitle}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </FormGroup>

                  <FormGroup className="form__group">
                    <span>Короткое описание товара</span>
                    <input
                      type="text"
                      placeholder="Введите описание..."
                      value={enterShortDesc}
                      onChange={(e) => setShortDesc(e.target.value)}
                      required
                    />
                  </FormGroup>

                  <FormGroup className="form__group">
                    <span>Описание товара</span>
                    <input
                      type="text"
                      placeholder="Введите описание..."
                      value={enterDesc}
                      onChange={(e) => setDesc(e.target.value)}
                      required
                    />
                  </FormGroup>

                  <div className="d-flex align-items-center justify-content-between gap-5">
                    <FormGroup className="form__group">
                      <span>Цена</span>
                      <input
                        type="number"
                        placeholder="0₽"
                        value={enterPrice}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </FormGroup>

                    <FormGroup className="form__group w-50">
                      <span>Категория</span>
                      <select
                        className="w-100"
                        value={enterCategory}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Категория</option>
                        <option value="Хлеб и выпечка">Хлеб и выпечка</option>
                        <option value="Фрукты и овощи">Фрукты и овощи</option>
                        <option value="Мясо, птица, колбаса">
                          Мясо, птица, колбаса
                        </option>
                        <option value="Молоко, сыр, яйцо">
                          Молоко, сыр, яйцо
                        </option>
                        <option value="Бакалея">Бакалея</option>
                        <option value="Рыба и морепродукты">
                          Рыба и морепродукты
                        </option>
                        <option value="Кондитерские изделия">
                          Кондитерские изделия
                        </option>
                        <option value="Чай, кофе, какао">
                          Чай, кофе, какао
                        </option>
                      </select>
                    </FormGroup>
                  </div>

                  <div>
                    <FormGroup className="form__group">
                      <span>Картинка товара</span>
                      <input
                        type="file"
                        onChange={(e) => setProdImg(e.target.files[0])}
                        required
                      />
                    </FormGroup>
                  </div>
                  <button className="buy__btn" type="submit">
                    Добавить товар
                  </button>
                </Form>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AddProducts;
