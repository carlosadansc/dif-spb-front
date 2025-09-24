import api from '../services/api'

const getUsers = async (headers) => {
    try {
        const response = await api.get('/users', { headers });
        return response.data;
    } catch (err) {
        throw err;
    }
}

const login = async (credentials) => {
    try {
        const response = await api.post('/user/signin', credentials);
        // La respuesta de un login exitoso (202) tiene la forma { data: { token, user }, errors: [] }
        if (response.data && response.data.data) {
            return response.data.data; // Devuelve { token, user }
        }
        // Si la estructura no es la esperada, crea un error consistente
        const err = new Error('Formato de respuesta inesperado del servidor');
        err.response = { data: { errors: [{ detail: 'Respuesta no válida del servidor.' }] } };
        throw err;
    } catch (err) {
        // Si el error viene de axios con una respuesta del servidor (4xx, 5xx)
        if (err.response) {
            console.error('Error en el servicio de login (respuesta del servidor):', err.response.data);
            throw err; // Relanza el error para que el componente lo maneje
        }
        // Para otros errores (red, configuración, etc.)
        console.error('Error en el servicio de login (sin respuesta del servidor):', err.message);
        // Crea un error genérico pero con la estructura esperada para no romper el UI
        const genericError = new Error('No se pudo conectar con el servidor. Por favor, intente más tarde.');
        genericError.response = { data: { errors: [{ detail: genericError.message }] } };
        throw genericError;
    }
};

const createUser = async (userData, headers) => {
    try {
        const response = await api.post('/user/signup', userData, { headers });
        return response.data;
    } catch (err) {
        throw err;
    }
};

const updateUser = async (id, update, headers) => {
    try {
        // No enviar la contraseña si está vacía
        if (update.password === '' || update.password === null) {
            delete update.password;
        }
        const response = await api.put(`/user/${id}`, update, { headers });
        return response.data;
    } catch (err) {
        throw err;
    }
};

const deleteUser = async (id, headers) => {
    try {
        const response = await api.delete(`/user/${id}`, { headers });
        return response.data;
    } catch (err) {
        throw err;
    }
};

const toggleUserStatus = async (id, active, headers) => {
    try {
        const response = await api.patch(
            `/user/${id}/status`, 
            { active },
            { headers }
        );
        return response.data;
    } catch (err) {
        throw err;
    }
};

const changePassword = async (id, currentPassword, newPassword, headers) => {
    try {
        const response = await api.post(
            `/user/${id}/change-password`,
            { currentPassword, newPassword },
            { headers }
        );
        return response.data;
    } catch (err) {
        throw err;
    }
};

const getUser = async (id, headers) => {
    try {
        const response = await api.get(`/user/${id}`, { headers });
        return response.data;
    } catch (err) {
        throw err;
    }
};

export default {
    login,
    getUsers,
    createUser,
    updateUser,
    getUser,
    deleteUser,
    toggleUserStatus,
    changePassword
};