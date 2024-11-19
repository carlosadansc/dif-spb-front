import api from '../services/api'

const headers =  {'Authorization': 'Bearer ' + localStorage.getItem("authToken")}

const getContributionItemsByCategory = async (params) => {
    return await api.get('/contribution-item/by-category', { params, headers } ).then((response) =>  response.data ).catch((err) => err)
}

export default {
    getBeneficiary,
    getBeneficiaries,
    createBeneficiary,
    updateBeneficiary,
    deleteBeneficiary
}