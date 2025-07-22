import { Product } from '../models';
import { generateId } from '../utils';

class ProductController {
  private products: Product[] = [
    {
      id: '1',
      name: 'Hambúrguer Artesanal',
      description: 'Delicioso hambúrguer com carne artesanal, queijo, alface e tomate',
      price: 25.90,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
      restaurantId: '1'
    },
    {
      id: '2',
      name: 'Pizza Margherita',
      description: 'Pizza tradicional italiana com molho de tomate, mozarela e manjericão',
      price: 32.00,
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop',
      restaurantId: '1'
    },
    {
      id: '3',
      name: 'Lasanha Bolonhesa',
      description: 'Lasanha caseira com molho bolonhesa e queijos especiais',
      price: 28.50,
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
      restaurantId: '1'
    }
  ];

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
