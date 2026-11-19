import api from '../services/api'

const unwrap = (request) => request.then((response) => response.data)

const createContribution = async (contribution, headers) => {
    return unwrap(api.post('/contribution/create', contribution, { headers }))
}

const getProductOrServicesByCategory = async (params, headers) => {
    return unwrap(api.get('/product-or-service/by-category', { params, headers }))
}

const getContributionsByBeneficiary = async (id, headers) => {
    return unwrap(api.get(`/contribution/by-beneficiary/${id}`, { headers }))
}

const getContributionsByBeneficiaryForExport = async (id, headers) => {
    return unwrap(api.get(`/contribution/by-beneficiary/${id}/export`, { headers }))
}

const getCategories = async (headers) => {
    return unwrap(api.get('/categories', { headers }))
}

const getContributionYears = async (headers) => {
    return unwrap(api.get('/contribution/years', { headers }))
}

const getContributionSummary = async (params, headers) => {
    return unwrap(api.get('/contribution/summary', { params, headers }))
}

const getContributionSummaryByCategory = async (params, headers) => {
    return unwrap(api.get('/contribution/summary-by-category', { params, headers }))
}

const getAllContributions = async (headers) => {
    return unwrap(api.get('/contribution/get-all', { headers }))
}

const getContribution = async (id, headers) => {
    return unwrap(api.get(`/contribution/${id}`, { headers }))
}

export default {
    getProductOrServicesByCategory,
    getContributionsByBeneficiary,
    getContributionsByBeneficiaryForExport,
    createContribution,
    getCategories, 
    getContributionYears,
    getContributionSummary,
    getContributionSummaryByCategory,
    getAllContributions,
    getContribution
}
