import api from './api'

const unwrap = (request) => request.then((response) => response.data)

const getCategories = async (headers) => {
 return unwrap(api.get('/categories', { headers }))
}

const createCategory = async (category, headers) => {
    return unwrap(api.post('/category/create', category, { headers }))
}

const createProductOrService = async (product, headers) => {
    return unwrap(api.post('/category/create-product-or-service', product, { headers }))
}

const quitProductOrService = async (product, headers) => {
    return unwrap(api.post('/category/quit-product-or-service', product, { headers }))
}

const updateCategory = async (category, update, headers) => {
    return unwrap(api.put('/category/update/' + category, update, { headers }))
}

export default {
    getCategories,
    createCategory,
    createProductOrService,
    quitProductOrService,
    updateCategory
}
