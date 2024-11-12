import api from '../services/api'

const login = async (credentials) => {
    return await api.post('/user/signin', credentials).then((response) =>  response.data ).catch((err) => err)
}

export default {
    login
}