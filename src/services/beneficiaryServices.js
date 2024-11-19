import api from '../services/api'

const headers =  {'Authorization': 'Bearer ' + localStorage.getItem("authToken")}

const getBeneficiary = async (id) => {
    return await api.get('/beneficiary/' + id, { headers } ).then((response) =>  response.data ).catch((err) => err)
}

const getBeneficiaries = async (params) => {
    return await api.get('/beneficiaries', { params, headers } ).then((response) =>  response.data ).catch((err) => err)
}

const createBeneficiary = async (beneficiary) => {
    return await api.post('/beneficiary/create', beneficiary, { headers }).then((response) =>  response.data ).catch((err) => err)
}

const updateBeneficiary = async (beneficiary) => {
    return await api.put('/beneficiary', beneficiary).then((response) =>  response.data ).catch((err) => err)
}

const deleteBeneficiary = async (id) => {
    return await api.delete('/beneficiary/' + id).then((response) =>  response.data ).catch((err) => err)
}

export default {
    getBeneficiary,
    getBeneficiaries,
    createBeneficiary,
    updateBeneficiary,
    deleteBeneficiary
}