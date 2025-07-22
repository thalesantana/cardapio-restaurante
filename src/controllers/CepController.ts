interface CepData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  latitude?: string;
  longitude?: string;
  erro?: boolean;
}

async function getCoordinatesFromAddress(city: string, state: string, street?: string): Promise<{ latitude: string, longitude: string }> {
  const coordinates = { latitude: '', longitude: '' };
  
  try {
    let searchQueries = [];
    
    if (street && city && state) {
      searchQueries.push(`${street}, ${city}, ${state}, Brasil`);
    }
    searchQueries.push(`${city}, ${state}, Brasil`);
    searchQueries.push(`${city}, ${state}`);
    
    for (const query of searchQueries) {
      try {
        const geocodeResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=br`,
          {
            headers: {
              'User-Agent': 'CardapioRestaurante/1.0'
            }
          }
        );
        
        if (geocodeResponse.ok) {
          const geocodeData = await geocodeResponse.json();
          
          if (geocodeData.length > 0) {
            coordinates.latitude = parseFloat(geocodeData[0].lat).toFixed(6);
            coordinates.longitude = parseFloat(geocodeData[0].lon).toFixed(6);
            break;
          }
        }
      } catch (error) {
        console.error('Erro na consulta de geocoding:', error);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    if (!coordinates.latitude || !coordinates.longitude) {
      try {
        const alternativeQuery = `${city}, ${state}`;
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(alternativeQuery)}&key=demo&limit=1&countrycode=br`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            coordinates.latitude = data.results[0].geometry.lat.toFixed(6);
            coordinates.longitude = data.results[0].geometry.lng.toFixed(6);
          }
        }
      } catch (altError) {
        console.error('Erro na API alternativa:', altError);
      }
    }
    
  } catch (error) {
    console.error('Erro geral ao buscar coordenadas:', error);
  }
  
  return coordinates;
}

export async function fetchCepData(cep: string): Promise<CepData | null> {
  try {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      return null;
    }

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    
    if (!response.ok) {
      console.log('Erro na resposta do ViaCEP:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (data.erro) {
      console.log('CEP não encontrado no ViaCEP');
      return null;
    }
    
    const coordinates = await getCoordinatesFromAddress(
      data.localidade,
      data.uf,
      data.logradouro
    );

    const result = {
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      localidade: data.localidade || '',
      uf: data.uf || '',
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    };
    
    return result;
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
}
