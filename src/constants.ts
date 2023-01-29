

export const API_URL_SCHEME = "http://"
export const API_IP_PORT = "localhost:8080"
// export const API_IP_PORT = "1hblbjaep3.execute-api.us-east-1.amazonaws.com/stage"


if (process.env.NODE_ENV === 'production') {
    const API_URL_SCHEME = "https://"
    const API_IP_PORT = "api.1hblbjaep3.execute-api.us-east-1.amazonaws.com/stage"
} else {
    const API_URL_SCHEME = "http://"
    const API_IP_PORT = "localhost:8080"
}

export const API_URL = API_URL_SCHEME + API_IP_PORT
export const API_WS = "ws://" + API_IP_PORT + "/live/"
export const API_WS_BROADCAST = API_WS
export const API_IMAGES = API_URL + "/images/"
export const API_SUBMIT = API_URL + "/art/submit/"

export const REACT_APP_NOT_SECRET_CODE = 'abcdef'

console.log(process.env)

