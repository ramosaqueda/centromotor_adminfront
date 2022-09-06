import axios from 'axios';
export const getImageByProduct = async (id) =>
  await axios.get(`http://localhost:5000/api/productimages/${id}`);
 