import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { PRODUCT_CREATE_RESET } from '../../Redux/Constants/ProductConstants';
import { getCategories } from '../../functions/category';

import { getBrands } from '../../functions/brands';

import { createProduct } from './../../Redux/Actions/ProductActions';
import Toast from '../LoadingError/Toast';
import Message from '../LoadingError/Error';
import Loading from '../LoadingError/Loading';

const ToastObjects = {
  pauseOnFocusLoss: false,
  draggable: false,
  pauseOnHover: false,
  autoClose: 2000,
};
const AddProductMain = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [filepreview, setFilepreview] = useState('');

  /*name,
  price,
  description,
  image,
  countInStock,
  featured,
  state,
  categoryId,
  brand,
  size,
  price_offer,
  */

  const [brand, setBrand] = useState(0);
  const [featured, SetFeatured] = useState(0);

  const [brands, setBrands] = useState([]);
  const state = 1;

  const [categorias, setCategorias] = useState([]);

  const [categoryId, setCategoryId] = useState(0);

  const [form_data, set_form_data] = useState();

  const dispatch = useDispatch();

  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, product } = productCreate;

  useEffect(() => {
    if (product) {
      toast.success('Product Added', ToastObjects);
      dispatch({ type: PRODUCT_CREATE_RESET });

      setName('');
      setDescription('');
      setCountInStock(0);
      setImage('');
      setPrice(0);
    }

    const loadCategories = () => {
      getCategories().then((res) => {
        setCategorias(res.data);
      });
    };

    const loadBrands = () => {
      getBrands().then((res) => {
        setBrands(res.data);
      });
    };

    loadCategories();
    loadBrands();
  }, [product, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProduct(
        name,
        price,
        description,
        image,
        featured,
        categoryId,
        size,
        state
      )
    );
  };

  const send_image = (files) => {
    const formData = new FormData();
    formData.append('file', files);
    set_form_data(formData);
    console.log(formData);
  };

  return (
    <>
      <Toast />
      <section className="content-main" style={{ maxWidth: '1200px' }}>
        <form onSubmit={submitHandler}>
          <div className="content-header">
            <Link to="/products" className="btn btn-danger text-white">
              Ir a Productos
            </Link>
            <h2 className="content-title">Agregar Producto</h2>
            <div>
              <button type="submit" className="btn btn-primary">
                Publciar ahora
              </button>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-xl-8 col-lg-8">
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  {error && <Message variant="alert-danger">{error}</Message>}
                  {loading && <Loading />}
                  <div className="mb-4">
                    <label htmlFor="product_title" className="form-label">
                      Nombre de Producto
                    </label>
                    <input
                      type="text"
                      placeholder="Ingrese nombre"
                      className="form-control"
                      id="name"
                      name="name|"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="product_title" className="form-label">
                      Producto Destacado
                    </label>
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      value={featured}
                      onChange={(e) => SetFeatured(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="cat_id" className="form-label">
                      Categoría
                    </label>
                    <select name="categoryId" id="categoryId">
                      {/* categories */}
                      {categorias.map((cat) => (
                        <option
                          value={cat.id}
                          onChange={(e) => categoryId(e.target.value)}
                        >
                          {' '}
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="cat_id" className="form-label">
                      Marca
                    </label>
                    <select name="category-list" id="category-list">
                      {/* categories */}
                      {brands.map((brand) => (
                        <option
                          value={brand.id}
                          onChange={(e) => setBrand(e.target.value)}
                        >
                          {' '}
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="product_price" className="form-label">
                      Precio
                    </label>
                    <input
                      type="number"
                      placeholder="Ingrese precio"
                      className="form-control"
                      id="price"
                      name="price"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="product_price" className="form-label">
                      Tamaño
                    </label>
                    <input
                      placeholder="Ingrese Tamaño"
                      className="form-control"
                      id="tamano"
                      required
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="product_price" className="form-label">
                      Cantidad de Stock
                    </label>
                    <input
                      type="number"
                      placeholder="Ingrese nombre"
                      className="form-control"
                      id="product_price"
                      required
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Descripción</label>
                    <textarea
                      placeholder="Ingrese la descripción aquí"
                      className="form-control"
                      rows="7"
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Imágenes</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Subir imágen"
                      value={image}
                      required
                      onChange={(e) => setImage(e.target.value)}
                    />
                    <input
                      className="form-control mt-3"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        send_image(e.target.files[0]);
                      }}
                    />
                  </div>

                  <div className="mb-4">
                    <img class="img-preview" src={filepreview} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddProductMain;
