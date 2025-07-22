import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { restaurantController } from '../controllers';
import { fetchCepData } from '../controllers/CepController';
import { RegisterRestaurantScreenStyles } from '../styles';
import { formatCNPJ } from '../utils';

export default function RegisterRestaurantScreen() {
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  const handleCepChange = async (text: string) => {
    const formattedCep = text.replace(/\D/g, '');
    
    if (formattedCep.length <= 8) {
      setZipCode(formattedCep.replace(/(\d{5})(\d{0,3})/, '$1-$2'));
    }

    if (formattedCep.length === 8) {
      setCepLoading(true);
      console.log('Iniciando busca do CEP:', formattedCep);
      
      const cepData = await fetchCepData(formattedCep);
      console.log('Dados recebidos:', cepData);
      
      if (cepData) {
        setStreet(cepData.logradouro);
        setNeighborhood(cepData.bairro);
        setCity(cepData.localidade);
        setState(cepData.uf);
        
        if (cepData.latitude && cepData.longitude && cepData.latitude !== '' && cepData.longitude !== '') {
          const coordinatesString = `${cepData.latitude}, ${cepData.longitude}`;
          setCoordinates(coordinatesString);
        } else {
          Alert.alert('Info', 'Endereço encontrado, mas coordenadas não disponíveis. Você pode inserir manualmente.');
        }
      } else {
        Alert.alert('Erro', 'CEP não encontrado ou inválido');
      }
      
      setCepLoading(false);
    }
  };

  const handleCnpjChange = (text: string) => {
    const formatted = formatCNPJ(text);
    setCnpj(formatted);
  };

  const handleRegister = async () => {
    setLoading(true);
    
    const result = restaurantController.create(
      name,
      street,
      number,
      zipCode,
      neighborhood,
      city,
      state,
      coordinates,
      cnpj
    );
    
    if (result.success) {
      Alert.alert('Sucesso', result.message);
      setName('');
      setStreet('');
      setNumber('');
      setZipCode('');
      setNeighborhood('');
      setCity('');
      setState('');
      setCoordinates('');
      setCnpj('');
    } else {
      Alert.alert('Erro', result.message);
    }
    
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      style={RegisterRestaurantScreenStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={RegisterRestaurantScreenStyles.scrollContainer}>
        <View style={RegisterRestaurantScreenStyles.header}>
          <Text style={RegisterRestaurantScreenStyles.title}>Cadastrar Restaurante</Text>
          <Text style={RegisterRestaurantScreenStyles.subtitle}>Preencha os dados do estabelecimento</Text>
        </View>

        <View style={RegisterRestaurantScreenStyles.form}>
          <View style={RegisterRestaurantScreenStyles.inputContainer}>
            <Text style={RegisterRestaurantScreenStyles.label}>Nome do Restaurante</Text>
            <TextInput
              style={RegisterRestaurantScreenStyles.input}
              value={name}
              onChangeText={setName}
              placeholder="Digite o nome do restaurante"
              autoCapitalize="words"
            />
          </View>
           <View style={[RegisterRestaurantScreenStyles.inputContainer, { flex: 1 }]}>
              <Text style={RegisterRestaurantScreenStyles.label}>CEP</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={[RegisterRestaurantScreenStyles.input, { flex: 1 }]}
                  value={zipCode}
                  onChangeText={handleCepChange}
                  placeholder="00000-000"
                  keyboardType="numeric"
                  maxLength={9}
                />
                {cepLoading && (
                  <ActivityIndicator 
                    size="small" 
                    color="#e74c3c" 
                    style={{ marginLeft: 8 }} 
                  />
                )}
              </View>
            </View>
          <View style={RegisterRestaurantScreenStyles.row}>
            <View style={[RegisterRestaurantScreenStyles.inputContainer, { flex: 3 }]}>
              <Text style={RegisterRestaurantScreenStyles.label}>Rua</Text>
              <TextInput
                style={RegisterRestaurantScreenStyles.input}
                value={street}
                onChangeText={setStreet}
                placeholder="Nome da rua"
                autoCapitalize="words"
              />
            </View>
            
          </View>

          <View style={RegisterRestaurantScreenStyles.row}>
            <View style={[RegisterRestaurantScreenStyles.inputContainer, { flex: 1, marginLeft: 10 }]}>
              <Text style={RegisterRestaurantScreenStyles.label}>Número</Text>
              <TextInput
                style={RegisterRestaurantScreenStyles.input}
                value={number}
                onChangeText={setNumber}
                placeholder="Nº"
                keyboardType="numeric"
              />
            </View>
           
            <View style={[RegisterRestaurantScreenStyles.inputContainer, { flex: 2, marginLeft: 10 }]}>
              <Text style={RegisterRestaurantScreenStyles.label}>Bairro</Text>
              <TextInput
                style={RegisterRestaurantScreenStyles.input}
                value={neighborhood}
                onChangeText={setNeighborhood}
                placeholder="Nome do bairro"
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={RegisterRestaurantScreenStyles.row}>
            <View style={[RegisterRestaurantScreenStyles.inputContainer, { flex: 2 }]}>
              <Text style={RegisterRestaurantScreenStyles.label}>Cidade</Text>
              <TextInput
                style={RegisterRestaurantScreenStyles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Nome da cidade"
                autoCapitalize="words"
              />
            </View>
            <View style={[RegisterRestaurantScreenStyles.inputContainer, { flex: 1, marginLeft: 10 }]}>
              <Text style={RegisterRestaurantScreenStyles.label}>UF</Text>
              <TextInput
                style={RegisterRestaurantScreenStyles.input}
                value={state}
                onChangeText={setState}
                placeholder="SP"
                maxLength={2}
                autoCapitalize="characters"
              />
            </View>
          </View>

          <View style={RegisterRestaurantScreenStyles.inputContainer}>
            <Text style={RegisterRestaurantScreenStyles.label}>Coordenadas (Latitude, Longitude)</Text>
            <TextInput
              style={RegisterRestaurantScreenStyles.input}
              value={coordinates}
              onChangeText={setCoordinates}
              placeholder="-23.550520, -46.633308"
              keyboardType="numbers-and-punctuation"
            />
          </View>

          <View style={RegisterRestaurantScreenStyles.inputContainer}>
            <Text style={RegisterRestaurantScreenStyles.label}>CNPJ</Text>
            <TextInput
              style={RegisterRestaurantScreenStyles.input}
              value={cnpj}
              onChangeText={handleCnpjChange}
              placeholder="00.000.000/0000-00"
              keyboardType="numeric"
              maxLength={18}
            />
          </View>

          <TouchableOpacity 
            style={[RegisterRestaurantScreenStyles.button, loading && RegisterRestaurantScreenStyles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={RegisterRestaurantScreenStyles.buttonText}>
              {loading ? 'Cadastrando...' : 'Cadastrar Restaurante'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
