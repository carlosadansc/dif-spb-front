import api from '../services/api'

const createAssessment = async (beneficiaryId, assessment, headers) => {
    return await api.post(`/socioeconomic-assessment/${beneficiaryId}/create`, assessment, { headers }).then((response) => response.data).catch((err) => err)
}

const getAssessmentsByBeneficiary = async (beneficiaryId, headers) => {
    return await api.get(`/socioeconomic-assessment/beneficiary/${beneficiaryId}`, { headers }).then((response) => response.data).catch((err) => err)
}

const getLatestAssessment = async (beneficiaryId, headers) => {
    return await api.get(`/socioeconomic-assessment/latest/${beneficiaryId}`, { headers }).then((response) => response.data).catch((err) => err)
}

const getAssessmentById = async (id, headers) => {
    return await api.get(`/socioeconomic-assessment/${id}`, { headers }).then((response) => response.data).catch((err) => err)
}

const updateAssessment = async (id, assessment, headers) => {
    return await api.put(`/socioeconomic-assessment/update/${id}`, assessment, { headers }).then((response) => response.data).catch((err) => err)
}

const deleteAssessment = async (id, headers) => {
    return await api.delete(`/socioeconomic-assessment/delete/${id}`, { headers }).then((response) => response.data).catch((err) => err)
}

const compareAssessments = async (id1, id2, headers) => {
    return await api.get(`/socioeconomic-assessment/compare/${id1}/${id2}`, { headers }).then((response) => response.data).catch((err) => err)
}

export default {
    createAssessment,
    getAssessmentsByBeneficiary,
    getLatestAssessment,
    getAssessmentById,
    updateAssessment,
    deleteAssessment,
    compareAssessments
}
