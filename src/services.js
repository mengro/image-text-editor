import axios from 'axios'

const API_PATH = 'https://apigwdev.gegejia.com/item-admin-mng'

export const uploadImageAction = `${API_PATH}/file/imageUpload`

export function uploadImage(data) {
  return axios.post('/file/imageUpload', data)
}