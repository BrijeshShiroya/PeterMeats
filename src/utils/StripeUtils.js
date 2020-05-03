const BASE_URL = "https://api.stripe.com/v1/";
const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
}

export default StripeUtils = {
    postData: async (data, headers = defaultHeaders, SUB_URL) => {
        const HTTP = BASE_URL + SUB_URL;
        console.log('HTTP', HTTP);
        console.log('data', data)
        console.log('headers', headers)
        return fetch(HTTP, {
            method: 'POST',
            headers,
            body: data,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
            });
    },
}
