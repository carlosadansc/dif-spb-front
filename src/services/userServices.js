import api from '../services/api'

const getUsers = async (headers) => {
    return await api.get('/users', { headers }).then((response) =>  response.data ).catch((err) => err)
}

const login = async (credentials) => {
    return await api.post('/user/signin', credentials).then((response) =>  response.data ).catch((err) => err)
}

export default {
    login,
    getUsers
}