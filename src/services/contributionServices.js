import api from '../services/api'


const createContribution = async (contribution, headers) => {
    return await api.post('/contribution/create', contribution, { headers }).then((response) =>  response.data ).catch((err) => err)
}

const getContributionItemsByCategory = async (params, headers) => {
    return await api.get('/contribution-item/by-category', { params, headers } ).then((response) =>  response.data ).catch((err) => err)
}

export default {
    getContributionItemsByCategory,
    createContribution
}