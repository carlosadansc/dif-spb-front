import { useAuthStore } from '../stores/authStore'
import { storeToRefs } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { computed } from 'vue'

export const useAuth = () => {
    const authStore = useAuthStore()
    const { user, authToken } = storeToRefs(authStore)
    
    const authHeader = computed(() => {
      return {
        'Authorization': 'Bearer ' + authToken.value ?? ''
      }
    })

    // Methods
    function logoutUser() {
        axios.defaults.headers.common['Authorization'] = ''
        authStore.setAuthToken("")
        authStore.setUser({})
    }

    const isLoggedIn = computed(() => {
        return !!authToken.value && !isTokenExpired(authToken.value)
    })

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

    // Verificar si el usuario es administrador
    const isAdmin = computed(() => {
        return user.value?.userType === 'admin'
    })

    // Verificar si el usuario es ejecutivo
    const isExecutive = computed(() => {
        return user.value?.userType === 'executive' || isAdmin.value
    })

    // Verificar si el usuario es usuario estándar
    const isStandardUser = computed(() => {
        return user.value?.userType === 'user' || isExecutive.value
    })

    // Obtener el nivel de usuario (1: user, 2: executive, 3: admin)
    const getUserLevel = computed(() => {
        switch(user.value?.userType) {
            case 'admin': return 3
            case 'executive': return 2
            case 'user': 
            default: return 1
        }
    })

    // Verificar si el usuario tiene al menos el nivel requerido
    const hasAccessLevel = (requiredLevel) => {
        const userLevel = getUserLevel.value
        return userLevel >= requiredLevel
    }

    return {
        user,
        authToken,
        isLoggedIn,
        logoutUser,
        authHeader,
        isAdmin,
        isExecutive,
        isStandardUser,
        getUserLevel,
        hasAccessLevel
    }
}