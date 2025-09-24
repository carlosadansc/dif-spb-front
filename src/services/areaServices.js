import api from './api';

/**
 * Obtiene todas las áreas
 * @param {Object} headers - Headers de autenticación
 * @returns {Promise<Array>} Lista de áreas
 */
const getAreas = async (headers) => {
    try {
        const response = await api.get('/areas', { headers });
        return response.data.data; // Access data property from response
    } catch (err) {
        console.error('Error fetching areas:', err);
        throw err.response?.data?.errors || ['Error al obtener las áreas'];
    }
}

/**
 * Crea una nueva área
 * @param {Object} area - Datos del área a crear
 * @param {Object} headers - Headers de autenticación
 * @returns {Promise<Object>} Área creada
 */
const createArea = async (area, headers) => {
    try {
        const response = await api.post('/area/create', area, { headers });
        return response.data.data; // Access data property from response
    } catch (err) {
        console.error('Error creating area:', err);
        throw err.response?.data?.errors || ['Error al crear el área'];
    }
}

/**
 * Actualiza un área existente
 * @param {string} id - ID del área a actualizar
 * @param {Object} area - Datos actualizados del área
 * @param {Object} headers - Headers de autenticación
 * @returns {Promise<Object>} Área actualizada
 */
const updateArea = async (id, area, headers) => {
    try {
        const response = await api.put(`/area/update/${id}`, area, { headers });
        return response.data.data; // Access data property from response
    } catch (err) {
        console.error(`Error updating area with id ${id}:`, err);
        throw err.response?.data?.errors || ['Error al actualizar el área'];
    }
}

/**
 * Elimina un área (borrado lógico)
 * @param {string} id - ID del área a eliminar
 * @param {Object} headers - Headers de autenticación
 * @returns {Promise<Object>} Respuesta del servidor
 */
const deleteArea = async (id, headers) => {
    try {
        const response = await api.delete(`/area/delete/${id}`, { headers });
        return response.data; // Return full response for delete operation
    } catch (err) {
        console.error(`Error deleting area with id ${id}:`, err);
        throw err.response?.data?.errors || ['Error al eliminar el área'];
    }
}

export default {
    getAreas,
    createArea,
    updateArea,
    deleteArea,
}
