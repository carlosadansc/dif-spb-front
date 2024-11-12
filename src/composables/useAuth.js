import { useAuthStore } from '../stores/authStore'
import { storeToRefs } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

export const useAuth = () => {
    const authStore = useAuthStore()
    const { user, authToken } = storeToRefs(authStore)

    // Methods
    function logoutUser() {
        axios.defaults.headers.common['Authorization'] = ''
        authStore.setAuthToken("")
        authStore.setUser({})
    }

    function isLoggedIn() {
        return !!authToken.value && !isTokenExpired(authToken.value)
    }

    function getTokenExpirationDate(encodedToken) {
        let token = jwtDecode(encodedToken)
        if (!token.exp) {
            return null
        }

        let date = new Date(0)
        date.setUTCSeconds(token.exp)

        return date
    }

    function isTokenExpired(token) {
        let expirationDate = getTokenExpirationDate(token)
        return expirationDate < new Date()
    }

    return {
        user,
        authToken,
        isLoggedIn,
        logoutUser
    }
}