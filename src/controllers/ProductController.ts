import { Product } from '../models';
import { generateId } from '../utils';

class ProductController {
  private products: Product[] = [];

  create(
    name: string,
    description: string,
    price: number,
    imageUrl: string,
    restaurantId: string
  ): { success: boolean; message: string } {
    if (!name || !description || !price || !imageUrl || !restaurantId) {
      return { success: false, message: 'Todos os campos são obrigatórios' };
    }

    if (price <= 0) {
      return { success: false, message: 'Preço deve ser maior que zero' };
    }

    const newProduct: Product = {
      id: generateId(),
      name,
      description,
      price,
      imageUrl,
      restaurantId
    };

    this.products.push(newProduct);
    return { success: true, message: 'Produto cadastrado com sucesso' };
  }

  getAll(): Product[] {
    return this.products;
  }

  getByRestaurant(restaurantId: string): Product[] {
    return this.products.filter(product => product.restaurantId === restaurantId);
  }

  getById(id: string): Product | undefined {
    return this.products.find(product => product.id === id);
  }
}

export const productController = new ProductController();
