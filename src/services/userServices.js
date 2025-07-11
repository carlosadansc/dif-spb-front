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
        // Si la respuesta exitosa tiene la forma { data: { token, user } }, devolvemos el contenido de data.
        return response.data.data;
    } catch (err) {
        throw err;
    }
};

const createUser = async (userData, headers) => {
    try {
        const response = await api.post('/user', userData, { headers });
        return response.data;
    } catch (err) {
        throw err;
    }
};

const updateUser = async (id, userData, headers) => {
    try {
        // No enviar la contraseña si está vacía
        if (userData.password === '' || userData.password === null) {
            delete userData.password;
        }
        const response = await api.put(`/user/${id}`, userData, { headers });
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
    getUser
};