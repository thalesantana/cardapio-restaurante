import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { productController } from "../controllers";
import { RegisterProductScreenStyles } from "../styles";

export default function RegisterProductScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePriceChange = (text: string) => {
    const numericValue = text.replace(/[^0-9,]/g, "");
    setPrice(numericValue);
  };

  const handleRegister = async () => {
    setLoading(true);

    const priceValue = parseFloat(price.replace(",", "."));

    if (isNaN(priceValue)) {
      Alert.alert("Erro", "Preço deve ser um valor válido");
      setLoading(false);
      return;
    }

    const result = productController.create(
      name,
      description,
      priceValue,
      imageUrl,
      "1"
    );

    if (result.success) {
      Alert.alert("Sucesso", result.message);
      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
    } else {
      Alert.alert("Erro", result.message);
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={RegisterProductScreenStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={RegisterProductScreenStyles.scrollContainer}
      >
        <View style={RegisterProductScreenStyles.header}>
          <Text style={RegisterProductScreenStyles.title}>
            Cadastrar Produto
          </Text>
          <Text style={RegisterProductScreenStyles.subtitle}>
            Adicione um novo item ao cardápio
          </Text>
        </View>

        <View style={RegisterProductScreenStyles.form}>
          <View style={RegisterProductScreenStyles.inputContainer}>
            <Text style={RegisterProductScreenStyles.label}>Nome do Prato</Text>
            <TextInput
              style={RegisterProductScreenStyles.input}
              value={name}
              onChangeText={setName}
              placeholder="Digite o nome do prato"
              autoCapitalize="words"
            />
          </View>

          <View style={RegisterProductScreenStyles.inputContainer}>
            <Text style={RegisterProductScreenStyles.label}>Descrição</Text>
            <TextInput
              style={[
                RegisterProductScreenStyles.input,
                RegisterProductScreenStyles.textArea,
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Descreva o prato..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={RegisterProductScreenStyles.inputContainer}>
            <Text style={RegisterProductScreenStyles.label}>Preço (R$)</Text>
            <TextInput
              style={RegisterProductScreenStyles.input}
              value={price}
              onChangeText={handlePriceChange}
              placeholder="0,00"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={RegisterProductScreenStyles.inputContainer}>
            <Text style={RegisterProductScreenStyles.label}>URL da Imagem</Text>
            <TextInput
              style={RegisterProductScreenStyles.input}
              value={imageUrl}
              onChangeText={setImageUrl}
              placeholder="https://exemplo.com/imagem.jpg"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
            <Text style={RegisterProductScreenStyles.helper}>
              Cole aqui o link da imagem do prato
            </Text>
          </View>

          <TouchableOpacity
            style={[
              RegisterProductScreenStyles.button,
              loading && RegisterProductScreenStyles.buttonDisabled,
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={RegisterProductScreenStyles.buttonText}>
              {loading ? "Cadastrando..." : "Cadastrar Produto"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={RegisterProductScreenStyles.suggestionsContainer}>
          <Text style={RegisterProductScreenStyles.suggestionsTitle}>
            Sugestões de URLs de Imagem:
          </Text>
          <TouchableOpacity
            onPress={() =>
              setImageUrl(
                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"
              )
            }
            style={RegisterProductScreenStyles.suggestionButton}
          >
            <Text style={RegisterProductScreenStyles.suggestionText}>
              Hambúrguer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setImageUrl(
                "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop"
              )
            }
            style={RegisterProductScreenStyles.suggestionButton}
          >
            <Text style={RegisterProductScreenStyles.suggestionText}>
              Pizza
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setImageUrl(
                "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop"
              )
            }
            style={RegisterProductScreenStyles.suggestionButton}
          >
            <Text style={RegisterProductScreenStyles.suggestionText}>
              Carnes
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
