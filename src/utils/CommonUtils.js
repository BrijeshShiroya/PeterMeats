import { BASE_URL } from '../common/Globals';
import { GOOGLE_API_KEY } from '../utils/Global';

const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};
export default CommonUtils = {
    postData: async (data, SUB_URL, headers = defaultHeaders, body) => {
        const HTTP = BASE_URL + SUB_URL;
        console.log('HTTP', HTTP);
        console.log('headers', headers);
        console.log('data', data);
        console.log('body', body);
        return fetch(HTTP, {
            method: 'POST',
            headers,
            body: data ? JSON.stringify(data) : body,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
            });
    },
    getData: async (params, SUB_URL) => {
        console.log('SUB_URL', BASE_URL + SUB_URL)
        console.log('params', params)
        return fetch(BASE_URL + SUB_URL + '?' + params, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },

        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
            });
    },
    googleApi: async (origins, destinations) => {
        const apiURL = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${GOOGLE_API_KEY}`;
        console.log('apiURL', apiURL)
        return fetch(apiURL)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
            });
    },
    googlePath: async (origin, destination, mode = 'driving') => {
        const apiURL = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_API_KEY}&mode=${mode}`;
        console.log('apiURL', apiURL)
        return fetch(apiURL)
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
            });
    },
}
