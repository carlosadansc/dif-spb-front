import api from '../services/api'

const getBeneficiary = async (id, headers) => {
    return await api.get('/beneficiary/' + id, { headers } ).then((response) =>  response.data ).catch((err) => err)
}

const checkBeneficiaryExistsByCurp = async (curp, headers) => {
    return await api.get('/beneficiary/check-curp/' + curp, { headers } ).then((response) =>  response.data ).catch((err) => err)
}

const getBeneficiaries = async (params, headers) => {
    return await api.get('/beneficiaries', { params, headers } ).then((response) =>  response.data ).catch((err) => err)
}

const createBeneficiary = async (beneficiary, headers) => {
    return await api.post('/beneficiary/create', beneficiary, { headers }).then((response) =>  response.data ).catch((err) => err)
}

const updateBeneficiary = async (payload, headers) => {
    return await api.put('/beneficiary/update', payload, { headers }).then((response) =>  response.data ).catch((err) => err)
}

export default {
    getBeneficiary,
    getBeneficiaries,
    createBeneficiary,
    updateBeneficiary,
    checkBeneficiaryExistsByCurp,
}