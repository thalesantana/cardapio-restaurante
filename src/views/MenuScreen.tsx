import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  View
} from 'react-native';
import { productController } from '../controllers';
import { Product } from '../models';
import { MenuScreenStyles } from '../styles';

export default function MenuScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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
    loadProducts();
  }, []);

  const renderProduct = ({ item }: { item: Product }) => (
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
  );

  return (
    <View style={MenuScreenStyles.container}>
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
    </View>
  );
}
