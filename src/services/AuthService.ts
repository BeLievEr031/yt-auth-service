import User from '../models/User';
// import { User as IUser } from '../types';

interface IUser {
  email: string;
  name: string;
  hashedPassword: string;
}

class AuthService {
  constructor(private userRepository: typeof User) {}
  async create(user: IUser) {
    return await this.userRepository.create({
      email: user.email,
      name: user.name,
      password: user.hashedPassword,
    });
  }
}

export default AuthService;
