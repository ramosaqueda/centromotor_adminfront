import axios from 'axios';
class UploadService {
  getImages() {}

  senImages(name, file) {
    const form = new FormData();
    form.append('name', name);
    form.append('file', file, 'fomr-data');
    return axios.post(`${process.env.REACT_APP_API}/upload/`, form);
  }
}

export default new UploadService();
