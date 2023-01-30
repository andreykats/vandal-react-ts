export const API_URL = process.env.REACT_APP_DOMAIN || "NOT_SET"
export const API_WS = process.env.REACT_APP_SOCKET || "NOT_SET"
export const API_WS_BROADCAST = API_WS
export const API_IMAGES = process.env.REACT_APP_S3_IMAGES || "NOT_SET"
export const API_SUBMIT = API_URL + "/art/submit/"
console.log(process.env)

