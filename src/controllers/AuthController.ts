import { User } from '../models';
import { generateId, validateEmail } from '../utils';

class AuthController {
  private users: User[] = [];
  private currentUser: User | null = null;

  register(name: string, email: string, password: string, userType: 'cliente' | 'admin'): { success: boolean; message: string } {
    if (!name || !email || !password) {
      return { success: false, message: 'Todos os campos são obrigatórios' };
    }

    if (!validateEmail(email)) {
      return { success: false, message: 'E-mail inválido' };
    }

    if (this.users.some(user => user.email === email)) {
      return { success: false, message: 'E-mail já cadastrado' };
    }

    const newUser: User = {
      id: generateId(),
      name,
      email,
      password,
      userType
    };

    this.users.push(newUser);
    return { success: true, message: 'Usuário cadastrado com sucesso' };
  }

  login(email: string, password: string): { success: boolean; message: string; user?: User } {
    if (!email || !password) {
      return { success: false, message: 'E-mail e senha são obrigatórios' };
    }

    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (user) {
      this.currentUser = user;
      return { success: true, message: 'Login realizado com sucesso', user };
    }

    return { success: false, message: 'E-mail ou senha incorretos' };
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  logout(): void {
    this.currentUser = null;
  }
}

export const authController = new AuthController();
