import api from '../services/api'

const unwrap = (request) => request.then((response) => response.data)

const createAssessment = async (beneficiaryId, assessment, headers) => {
    return unwrap(api.post(`/socioeconomic-assessment/${beneficiaryId}/create`, assessment, { headers }))
}

const getAssessmentsByBeneficiary = async (beneficiaryId, headers) => {
    return unwrap(api.get(`/socioeconomic-assessment/beneficiary/${beneficiaryId}`, { headers }))
}

const getLatestAssessment = async (beneficiaryId, headers) => {
    return unwrap(api.get(`/socioeconomic-assessment/latest/${beneficiaryId}`, { headers }))
}

const getAssessmentById = async (id, headers) => {
    return unwrap(api.get(`/socioeconomic-assessment/${id}`, { headers }))
}

const updateAssessment = async (id, assessment, headers) => {
    return unwrap(api.put(`/socioeconomic-assessment/update/${id}`, assessment, { headers }))
}

const deleteAssessment = async (id, headers) => {
    return unwrap(api.delete(`/socioeconomic-assessment/delete/${id}`, { headers }))
}

const compareAssessments = async (id1, id2, headers) => {
    return unwrap(api.get(`/socioeconomic-assessment/compare/${id1}/${id2}`, { headers }))
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
