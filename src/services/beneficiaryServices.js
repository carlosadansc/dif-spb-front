import api from '../services/api'

const getBeneficiary = async (id, headers) => {
    return await api.get('/beneficiary/' + id, { headers } ).then((response) =>  response.data ).catch((err) => err)
}

const getBeneficiaries = async (params, headers) => {
    return await api.get('/beneficiaries', { params, headers } ).then((response) =>  response.data ).catch((err) => err)
}

const createBeneficiary = async (beneficiary, headers) => {
    return await api.post('/beneficiary/create', beneficiary, { headers }).then((response) =>  response.data ).catch((err) => err)
}

const updateBeneficiary = async (beneficiary, headers) => {
    return await api.put('/beneficiary', beneficiary).then((response) =>  response.data ).catch((err) => err)
}

const deleteBeneficiary = async (id, headers) => {
    return await api.delete('/beneficiary/' + id).then((response) =>  response.data ).catch((err) => err)
}

export default {
    getBeneficiary,
    getBeneficiaries,
    createBeneficiary,
    updateBeneficiary,
    deleteBeneficiary
}