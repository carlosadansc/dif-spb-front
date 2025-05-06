import api from '../services/api'

const getBeneficiary = async (id, headers) => {
    return await api.get('/beneficiary/' + id, { headers } ).then((response) =>  response.data ).catch((err) => {throw err})
}

const checkBeneficiaryExistsByCurp = async (curp, headers) => {
    return await api.get('/beneficiary/check-curp/' + curp, { headers } ).then((response) =>  response.data ).catch((err) => {throw err})
}

const getBeneficiaries = async (params, headers) => {
    return await api.get('/beneficiaries', { params, headers } ).then((response) =>  response.data ).catch((err) => {throw err})
}

const getBeneficiariesCount = async (params, headers) => {
    return await api.get('/beneficiaries/count', { params, headers } ).then((response) =>  response.data ).catch((err) => {throw err})
}

const createBeneficiary = async (beneficiary, headers) => {
    return await api.post('/beneficiary/create', beneficiary, { headers }).then((response) =>  response.data ).catch((err) => {throw err})
}

const updateBeneficiary = async (payload, headers) => {
    return await api.put('/beneficiary/update', payload, { headers }).then((response) =>  response.data ).catch((err) => {throw err})
}

const createFamily = async (beneficiaryId, family, headers) => {
    return await api.post(`/beneficiary/${beneficiaryId}/family-create/`, family, { headers }).then((response) =>  response.data ).catch((err) => {throw err})
}

const getBeneficiaryFamilies = async (beneficiaryId, headers) => {
    return await api.get(`/beneficiary/${beneficiaryId}/family`, { headers }).then((response) =>  response.data ).catch((err) => {throw err})
}

const getFamilyByBeneficiary = async (id, headers) => {
    return await api.get(`/family/by-beneficiary/${id}`, { headers }).then((response) =>  response.data ).catch((err) => {throw err})
}

const generateProvisionalCurp = async (headers) => {
    return await api.get('/generate-curp', { headers }).then((response) =>  response.data ).catch((err) => {throw err})
}

const getBeneficiariesByDelegation = async (headers) => {
    return await api.get('/beneficiaries/by-delegations', { headers }).then((response) =>  response.data ).catch((err) => {throw err})
}

const getBeneficiariesBySex = async (headers) => {
    return await api.get('/beneficiaries/by-sex', { headers }).then((response) =>  response.data ).catch((err) => {throw err})
}

export default {
    getBeneficiary,
    getBeneficiaries,
    createBeneficiary,
    updateBeneficiary,
    checkBeneficiaryExistsByCurp,
    createFamily,
    getBeneficiariesCount,
    getBeneficiaryFamilies,
    getFamilyByBeneficiary,
    generateProvisionalCurp,
    getBeneficiariesByDelegation,
    getBeneficiariesBySex,
    
}