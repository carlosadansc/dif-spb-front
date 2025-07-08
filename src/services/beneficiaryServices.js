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

const deleteFamily = async (beneficiaryId, familyId, headers) => {
    return await api.delete(`/beneficiary/${beneficiaryId}/family-delete/${familyId}`, { headers }).then((response) =>  response.data ).catch((err) => {throw err})
}

const getBeneficiaryFamily = async(beneficiaryId, headers) => {
    return await api.get(`/beneficiary/${beneficiaryId}/family`, { headers }).then((response) =>  response.data ).catch((err) => {throw err})
}

const getBeneficiaryFamilyNames = async (beneficiaryId, headers) => {
    return await api.get(`/beneficiary/${beneficiaryId}/family-names`, { headers }).then((response) =>  response.data ).catch((err) => {throw err})
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

const uploadImage = async (image, headers) => {
    return await api.post('/image/upload', image, { headers }).then((response) =>  response.data ).catch((err) => {throw err})
}

const deleteImage = async (filePath, headers) => {
    return await api.delete('/image/delete', { 
      data: { filePath },
      headers: headers 
    }).then((response) => response.data).catch((err) => { throw err });
}

export default {
    getBeneficiary,
    getBeneficiaries,
    createBeneficiary,
    updateBeneficiary,
    checkBeneficiaryExistsByCurp,
    createFamily,
    deleteFamily,
    getBeneficiariesCount,
    getBeneficiaryFamily,
    getBeneficiaryFamilyNames,
    getFamilyByBeneficiary,
    generateProvisionalCurp,
    getBeneficiariesByDelegation,
    getBeneficiariesBySex,
    uploadImage,
    deleteImage 
}