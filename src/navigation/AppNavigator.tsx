import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { authController } from '../controllers';
import { User } from '../models';
import {
  LoginScreen,
  MenuScreen,
  RegisterProductScreen,
  RegisterRestaurantScreen,
  RegisterScreen,
} from '../views';

export type RootStackParamList = {
  Auth: undefined;
  Main: { user: User };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Menu: undefined;
  RegisterRestaurant: undefined;
  RegisterProduct: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function MainNavigator({ route }: { route: any }) {
  const { user } = route.params;
  const navigation = useNavigation();
  
  const handleLogout = () => {
    authController.logout();
    navigation.navigate('Auth' as never);
  };

  const LogoutButton = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
      <Text style={{ fontSize: 12, color: '#7f8c8d', marginRight: 10 }}>
        {user.name} ({user.userType})
      </Text>
      <TouchableOpacity onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );
  
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Menu') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'RegisterRestaurant') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'RegisterProduct') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else {
            iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e74c3c',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <MainTab.Screen 
        name="Menu" 
        component={MenuScreen} 
        options={{ 
          title: 'Cardápio', 
          headerShown: true,
          headerRight: () => <LogoutButton />
        }}
      />
      {user.userType === 'admin' && (
        <>
          <MainTab.Screen 
            name="RegisterRestaurant" 
            component={RegisterRestaurantScreen}
            options={{ title: 'Restaurante', headerShown: true }}
          />
          <MainTab.Screen 
            name="RegisterProduct" 
            component={RegisterProductScreen}
            options={{ title: 'Produto', headerShown: true }}
          />
        </>
      )}
    </MainTab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Auth" component={AuthNavigator} />
      <RootStack.Screen name="Main" component={MainNavigator} />
    </RootStack.Navigator>
  );
}
