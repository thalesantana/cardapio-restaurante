import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  RefreshControl,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { productController, restaurantController } from '../controllers';
import { Product, Restaurant } from '../models';
import { MenuScreenStyles } from '../styles';

export default function MenuScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();

  const loadProducts = () => {
    const allProducts = productController.getAll();
    setProducts(allProducts);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
    setRefreshing(false);
  };

  useEffect(() => {
    if (isFocused) {
      loadProducts();
    }
  }, [isFocused]);

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity onPress={() => showRestaurantDetails(item.restaurantId)}>
      <View style={MenuScreenStyles.productCard}>
        <Image source={{ uri: item.imageUrl }} style={MenuScreenStyles.productImage} />
        <View style={MenuScreenStyles.productInfo}>
          <View style={MenuScreenStyles.productContent}>
            <Text style={MenuScreenStyles.productName}>{item.name}</Text>
            <Text style={MenuScreenStyles.productDescription}>{item.description}</Text>
          </View>
          <Text style={MenuScreenStyles.productPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const showRestaurantDetails = (restaurantId: string) => {
    const restaurant = restaurantController.getById(restaurantId);
    if (restaurant) {
      setSelectedRestaurant(restaurant);
      setModalVisible(true);
    }
  };

  const renderRestaurantModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={MenuScreenStyles.modalOverlay}>
        <View style={MenuScreenStyles.modalView}>
          <View style={MenuScreenStyles.modalHeader}>
            <Text style={MenuScreenStyles.modalTitle}>{selectedRestaurant?.name}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={MenuScreenStyles.modalContent}>
            <Text style={MenuScreenStyles.modalLabel}>Endereço:</Text>
            <Text style={MenuScreenStyles.modalText}>
              {selectedRestaurant?.street}, {selectedRestaurant?.number}
            </Text>
            <Text style={MenuScreenStyles.modalText}>
              {selectedRestaurant?.neighborhood}, {selectedRestaurant?.city} - {selectedRestaurant?.state}
            </Text>
            <Text style={MenuScreenStyles.modalText}>
              CEP: {selectedRestaurant?.zipCode}
            </Text>
            <Text style={MenuScreenStyles.modalLabel}>CNPJ:</Text>
            <Text style={MenuScreenStyles.modalText}>{selectedRestaurant?.cnpj}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={MenuScreenStyles.container}>
      {renderRestaurantModal()}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={MenuScreenStyles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={MenuScreenStyles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={64} color="#bdc3c7" />
            <Text style={MenuScreenStyles.emptyText}>Nenhum produto cadastrado</Text>
            <Text style={MenuScreenStyles.emptySubtext}>
              Não há produtos disponíveis no momento
            </Text>
          </View>
        }
      />
      {selectedRestaurant && renderRestaurantModal()}
    </View>
  );
}
