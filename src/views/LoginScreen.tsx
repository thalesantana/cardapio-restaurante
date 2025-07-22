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
import { AuthStackParamList, RootStackParamList } from '../navigation/AppNavigator';
import { LoginScreenStyles } from '../styles';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'> & 
  StackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    setLoading(true);
    
    const result = authController.login(email, password);
    
    if (result.success && result.user) {
      navigation.navigate('Main', { user: result.user });
    } else {
      Alert.alert('Erro', result.message);
    }
    
    setLoading(false);
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView 
      style={LoginScreenStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={LoginScreenStyles.scrollContainer}>
        <View style={LoginScreenStyles.header}>
          <Text style={LoginScreenStyles.title}>Cardápio Digital</Text>
          <Text style={LoginScreenStyles.subtitle}>Entre em sua conta</Text>
        </View>

        <View style={LoginScreenStyles.form}>
          <View style={LoginScreenStyles.inputContainer}>
            <Text style={LoginScreenStyles.label}>E-mail</Text>
            <TextInput
              style={LoginScreenStyles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={LoginScreenStyles.inputContainer}>
            <Text style={LoginScreenStyles.label}>Senha</Text>
            <TextInput
              style={LoginScreenStyles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[LoginScreenStyles.button, loading && LoginScreenStyles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={LoginScreenStyles.buttonText}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={LoginScreenStyles.linkButton} 
            onPress={goToRegister}
          >
            <Text style={LoginScreenStyles.linkText}>
              Não possui conta? Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
