import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CreateCategory from "./CreateCategory";
import { listCategories } from "../../Redux/Actions/CategoryActions";

import CategoriesTable from "./CategoriesTable";

const MainCategories = () => {
  const dispatch = useDispatch();
  const categoryList = useSelector((state) => state.categoryList);
  const { loading, error, categories } = categoryList;
  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);


  return (
    <section className="content-main">
      <div className="content-header">
        <h2 className="content-title">Categories</h2>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row">
            {/* Create category */}
            <CreateCategory />
            {/* Categories table */}
            <CategoriesTable />
          </div>
        </div>
      </div>

      {/* categories */}
      {categories.map((category) => (
                <p>category.name</p>
              ))}
    </section>
  );
};

export default MainCategories;
