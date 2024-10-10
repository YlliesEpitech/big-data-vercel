import { getCrypto } from "./getCrypto.js";
export const fetchData = async () => {
    // Récupère l'html de la page
    const url = "https://www.coingecko.com/";
    const response = await fetch(url);
    const data = await response.text();

    // Récupère les valeurs que je souhaite de la page.
    return getCrypto(data);
}