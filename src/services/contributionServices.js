import api from '../services/api'


const createContribution = async (contribution, headers) => {
    return await api.post('/contribution/create', contribution, { headers }).then((response) =>  response.data ).catch((err) => err)
}

const getProductOrServicesByCategory = async (params, headers) => {
    return await api.get('/product-or-service/by-category', { params, headers } ).then((response) =>  response.data ).catch((err) => err)
}

const getContributionsByBeneficiary = async (id, headers) => {
    return await api.get(`/contribution/by-beneficiary/${id}`, { headers } ).then((response) =>  response.data ).catch((err) => err)
}

const getCategories = async (headers) => {
    return await api.get('/categories', { headers } ).then((response) =>  response.data ).catch((err) => err)
}

const getContributionYears = async (headers) => {
    return await api.get('/contribution/years', { headers } ).then((response) =>  response.data ).catch((err) => err)
}

const getContributionSummary = async (params, headers) => {
    return await api.get('/contribution/summary', { params, headers } ).then((response) =>  response.data ).catch((err) => err)
}

const getContributionSummaryByCategory = async (params, headers) => {
    return await api.get('/contribution/summary-by-category', { params, headers } ).then((response) =>  response.data ).catch((err) => err)
}

const getAllContributions = async (headers) => {
    return await api.get('/contribution/get-all', { headers } ).then((response) =>  response.data ).catch((err) => err)
}

export default {
    getProductOrServicesByCategory,
    getContributionsByBeneficiary,
    createContribution,
    getCategories, 
    getContributionYears,
    getContributionSummary,
    getContributionSummaryByCategory,
    getAllContributions 
}