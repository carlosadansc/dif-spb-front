import api from '../services/api'


const createContribution = async (contribution, headers) => {
    return await api.post('/contribution/create', contribution, { headers }).then((response) =>  response.data ).catch((err) => err)
}

const getContributionItemsByCategory = async (params, headers) => {
    return await api.get('/contribution-item/by-category', { params, headers } ).then((response) =>  response.data ).catch((err) => err)
}

const getCategories = async (headers) => {
    return await api.get('/contribution-item-categories', { headers } ).then((response) =>  response.data ).catch((err) => err)
}

const getContributionYears = async (headers) => {
    return await api.get('/contribution/years', { headers } ).then((response) =>  response.data ).catch((err) => err)
}

const getSummaryByCategory = async (params, headers) => {
    return await api.get('/contribution/summary-by-category', { params, headers } ).then((response) =>  response.data ).catch((err) => err)
}

const getContributionItemSummary = async (params, headers) => {
    return await api.get('/contribution/contribution-item-summary-by-category', { params, headers } ).then((response) =>  response.data ).catch((err) => err)
}

export default {
    getContributionItemsByCategory,
    createContribution,
    getCategories, 
    getContributionYears,
    getSummaryByCategory,
    getContributionItemSummary 
}