let baseUrl = "https://tabular-api.data.gouv.fr/api/resources/";

/**
 * Configure l'URL de base pour les appels API
 * @param {string} url - L'URL de base pour les appels API
 */
export function configureBaseUrl(url) {
    baseUrl = url;
}

/**
 * Récupère les données pour un ID donné
 * @param {string} id - L'ID pour lequel récupérer les données
 * @returns {Promise<any>} Promesse résolue avec les données récupérées
 */
export async function getRows(id) {
    const url = `${baseUrl}${id}/`; // Construit l'URL avec l'ID
    try {
        const response = await fetch(url); // Effectue l'appel réseau
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json(); // Renvoie la réponse JSON
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        throw error; // Propage l'erreur
    }
}

// Exporter uniquement getRows si vous souhaitez limiter les exports à cette fonction
export default { getRows, configureBaseUrl };