// API base URL fra miljøvariablerne
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://klimaserver-production.up.railway.app/';

// Hjælpefunktion til at foretage fetch-kald
async function fetchAPI(endpoint, options = {}) {
  const defaultOptions = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  };

  // Fix slash mellem base URL og endpoint
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  const path = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  const url = `${baseUrl}${path}`;

  console.log(`Forsøger at hente data fra: ${url}`); // Debug-info

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API fejl (${response.status}):`, errorText);
      throw new Error(`API fejl: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Modtaget data:', data); // Debug-info
    return data;
  } catch (error) {
    console.error(`Fejl ved API-kald til ${endpoint}:`, error);
    throw error;
  }
}

// Specifikke API-metoder
export const climateAPI = {
  getCurrentTemperature: async () => {
    const data = await fetchAPI('temperatures');
    return data.temperature;
  },
  
  // Tilføj flere metoder efter behov
  getHumidity: async () => {
    const data = await fetchAPI('getHumidity');
    return data.humidity;
  },
  
  getNoiseLevel: async () => {
    const data = await fetchAPI('getNoiseLevel');
    return data.noiseLevel;
  },
  
  // osv.
};