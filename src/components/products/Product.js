import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { deleteProduct } from '../../Redux/Actions/ProductActions';
import { getImageByProduct } from '../../functions/getImages.js';

const Product = (props) => {
  const { product } = props;
  const [images, setImages] = useState([]);

  const id = product.id;
  const dispatch = useDispatch();

  const deletehandler = (id) => {
    if (window.confirm('Are you sure??')) {
      dispatch(deleteProduct(id));
    }
  };

  useEffect(() => {
    const obtieneImages = async () => {
      await getImageByProduct(id).then((res) => {
        setImages(res.data);
      });
    };

    obtieneImages();
  }, []);

  const leerimages = () => {
    if (images[0] !== undefined) {
      return images[0].image;
    } else {
      return 'No_Preview_image_2.png';
    }
  };
  return (
    <>
      <div className="col-md-6 col-sm-6 col-lg-3 mb-5">
        <div className="card card-product-grid shadow-sm">
          <Link to="#" className="img-wrap">
            <img src={`images/products/${leerimages()}`} alt="Producto" />
          </Link>
          <div className="info-wrap">
            <Link to="#" className="title text-truncate">
              {product.name}
            </Link>
            <div className="price mb-2">${product.price}</div>
            <div className="row">
              <Link
                to={`/product/${product._id}/edit`}
                className="btn btn-sm btn-outline-success p-2 pb-3 col-md-6"
              >
                <i className="fas fa-pen"></i>
              </Link>
              <Link
                to="#"
                onClick={() => deletehandler(product._id)}
                className="btn btn-sm btn-outline-danger p-2 pb-3 col-md-6"
              >
                <i className="fas fa-trash-alt"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
