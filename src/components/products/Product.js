
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteProduct, listImagesProducts } from "../../Redux/Actions/ProductActions";
import { getImageByProduct } from "../../functions/getImages.js";

const Product = (props) => {
  const { product } = props;
 
  const id =product.id;
  const dispatch = useDispatch();

  const deletehandler = (id) => {
    if (window.confirm("Are you sure??")) {
      dispatch(deleteProduct(id));
    }
  };

 
 
  const leerimages =   (id) => {
    let imagen;
    //dispatch(listImagesProducts(id));
    if (id>0) {
      getImageByProduct(id).then((res) => {
        imagen = (res.data[0].image);
        console.log(imagen);
      });
    }

    
  
    if (imagen!==''){
      return 'b2d53c71b63699f0c85c14f565046ac5.jpg';
    }
   
  } 
 

  return (
    <>
      <div className="col-md-6 col-sm-6 col-lg-3 mb-5">
        <div className="card card-product-grid shadow-sm">
          <Link to="#" className="img-wrap">
            <img src={`images/products/${leerimages(product.id)}`} alt="Producto" o />
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
