import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { authController } from '../controllers';
import { AuthStackParamList } from '../navigation/AppNavigator';
import { RegisterScreenStyles } from '../styles';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'cliente' | 'admin'>('cliente');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleRegister = async () => {
    setLoading(true);
    
    const result = authController.register(name, email, password, userType);
    
    if (result.success) {
      Alert.alert('Sucesso', result.message, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Erro', result.message);
    }
    
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      style={RegisterScreenStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={RegisterScreenStyles.scrollContainer}>
        <View style={RegisterScreenStyles.header}>
          <Text style={RegisterScreenStyles.title}>Criar Conta</Text>
          <Text style={RegisterScreenStyles.subtitle}>Preencha os dados abaixo</Text>
        </View>

        <View style={RegisterScreenStyles.form}>
          <View style={RegisterScreenStyles.inputContainer}>
            <Text style={RegisterScreenStyles.label}>Nome Completo</Text>
            <TextInput
              style={RegisterScreenStyles.input}
              value={name}
              onChangeText={setName}
              placeholder="Digite seu nome completo"
              autoCapitalize="words"
            />
          </View>

          <View style={RegisterScreenStyles.inputContainer}>
            <Text style={RegisterScreenStyles.label}>E-mail</Text>
            <TextInput
              style={RegisterScreenStyles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={RegisterScreenStyles.inputContainer}>
            <Text style={RegisterScreenStyles.label}>Senha</Text>
            <TextInput
              style={RegisterScreenStyles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              secureTextEntry
            />
          </View>

          <View style={RegisterScreenStyles.inputContainer}>
            <Text style={RegisterScreenStyles.label}>Tipo de Usuário</Text>
            <View style={RegisterScreenStyles.pickerContainer}>
              <Picker
                selectedValue={userType}
                onValueChange={(itemValue: 'cliente' | 'admin') => setUserType(itemValue)}
                style={RegisterScreenStyles.picker}
              >
                <Picker.Item label="Cliente" value="cliente" />
                <Picker.Item label="Administrador" value="admin" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity 
            style={[RegisterScreenStyles.button, loading && RegisterScreenStyles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={RegisterScreenStyles.buttonText}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={RegisterScreenStyles.linkButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={RegisterScreenStyles.linkText}>
              Já possui conta? Faça login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
