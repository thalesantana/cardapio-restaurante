import { Restaurant } from '../models';
import { generateId } from '../utils';

class RestaurantController {
  private restaurants: Restaurant[] = [];

  create(
    name: string,
    street: string,
    number: string,
    zipCode: string,
    neighborhood: string,
    city: string,
    state: string,
    coordinates: string,
    cnpj: string
  ): { success: boolean; message: string } {
    if (!name || !street || !number || !zipCode || !neighborhood || !city || !state || !coordinates || !cnpj) {
      return { success: false, message: 'Todos os campos são obrigatórios' };
    }

    if (this.restaurants.some(restaurant => restaurant.cnpj === cnpj)) {
      return { success: false, message: 'CNPJ já cadastrado' };
    }

    const newRestaurant: Restaurant = {
      id: generateId(),
      name,
      street,
      number,
      zipCode,
      neighborhood,
      city,
      state,
      coordinates,
      cnpj
    };

    this.restaurants.push(newRestaurant);
    return { success: true, message: 'Restaurante cadastrado com sucesso' };
  }

  getAll(): Restaurant[] {
    return this.restaurants;
  }

  getById(id: string): Restaurant | undefined {
    return this.restaurants.find(restaurant => restaurant.id === id);
  }
}

export const restaurantController = new RestaurantController();
