import axios from 'axios';

export const getBrands = async () =>
  await axios.get(`${process.env.REACT_APP_API}/brand`);

export const getbrand = async (slug) =>
  await axios.get(`${process.env.REACT_APP_API}/brand/${slug}`);

export const removebrand = async (slug, authtoken) =>
  await axios.delete(`${process.env.REACT_APP_API}/brand/${slug}`, {
    headers: {
      authtoken,
    },
  });

export const updatebrand = async (slug, brand, authtoken) =>
  await axios.put(`${process.env.REACT_APP_API}/brand/${slug}`, brand, {
    headers: {
      authtoken,
    },
  });

export const createbrand = async (brand, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API}/brand`, brand, {
    headers: {
      authtoken,
    },
  });

export const getbrandSubs = async (_id) =>
  await axios.get(`${process.env.REACT_APP_API}/brand/subs/${_id}`);
