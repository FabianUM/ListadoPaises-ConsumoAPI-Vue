import axios from 'axios';

const pixabayClient = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params: {
    key: '44696009-5bfacdd58d329ad04d666cc32', // Reemplaza con tu API key de Pixabay
  },
});

export default pixabayClient;
