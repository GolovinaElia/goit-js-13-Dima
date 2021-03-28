import axios from 'axios'

const url = `https://pixabay.com/api/?image_type=photo&orientation=horizontal`;

export default function getResponse (query, page) {
    return axios.get(`${url}&q=${query}&page=${page}&per_page=12&key=15900106-2c235e732bb321ca7ec900d93`)
}