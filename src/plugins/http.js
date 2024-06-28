import axios from 'axios';

const mainUrl = 'http://167.99.138.67:1111'

const http = {
    post: (url, data) => {
        return axios.post(mainUrl + url, data);
    },
    get: (url) => {
        return axios.get(mainUrl + url)
            .then(res => res.data)
            .catch(error => {
                console.error('Error fetching data:', error);
                throw error;
            });
    }
};
export default http;
