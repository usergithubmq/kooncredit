import axios from 'axios';

// Extraemos las variables del entorno de Vite
const baseURL = import.meta.env.VITE_NUBARIUM_URL;
const user = import.meta.env.VITE_NUBARIUM_USER;
const pass = import.meta.env.VITE_NUBARIUM_PASS;

/**
 * Cliente de Axios configurado para Nubarium
 * Implementa Basic Auth automáticamente
 */
const nubariumApi = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Generamos el token Basic Auth en Base64
        'Authorization': `Basic ${btoa(`${user}:${pass}`)}`
    }
});

/**
 * SERVICIOS DISPONIBLES
 * Aquí puedes ir agregando los endpoints según la documentación
 */
const NubariumService = {

    // Ejemplo: Validar CURP (Renapo)
    validarCurp: async (curp) => {
        try {
            const response = await nubariumApi.post('/renapo/v2/valida_curp', {
                curp: curp,
                documento: "0" // 0 para solo datos, 1 para generar PDF
            });
            return response.data;
        } catch (error) {
            console.error("Error Nubarium (CURP):", error.response?.data || error.message);
            throw error;
        }
    },

    // Ejemplo: Validar RFC (SAT)
    validarRfc: async (rfc) => {
        try {
            const response = await nubariumApi.post('/sat/v1/valida_rfc', {
                rfc: rfc
            });
            return response.data;
        } catch (error) {
            console.error("Error Nubarium (RFC):", error.response?.data || error.message);
            throw error;
        }
    },

    // Ejemplo: Lista Negra (69B SAT)
    consultarListaNegra: async (rfc) => {
        try {
            const response = await nubariumApi.post('/sat/v1/lista_negra', {
                rfc: rfc
            });
            return response.data;
        } catch (error) {
            console.error("Error Nubarium (Lista Negra):", error.response?.data || error.message);
            throw error;
        }
    }
};

export default NubariumService;