import api from './api'

const getCategories = async (headers) => {
 return await api.get('/categories', { headers }).then((response) =>  response.data ).catch((err) => err)
}

const createCategory = async (category, headers) => {
    return await api.post('/category/create', category, { headers }).then((response) =>  response.data ).catch((err) => err)
}

const createProductOrService = async (product, headers) => {
    return await api.post('/category/create-product-or-service', product, { headers }).then((response) =>  response.data ).catch((err) => err)
}

export default {
    getCategories,
    createCategory,
    createProductOrService
}