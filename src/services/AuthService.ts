import User from '../models/User';
// import { User as IUser } from '../types';

interface IUser {
  email: string;
  name: string;
  hashedPassword: string;
  phone: string;
  pincode: string;
}

class AuthService {
  constructor(private userRepository: typeof User) {}
  async create(user: IUser) {
    return await this.userRepository.create({
      email: user.email,
      name: user.name,
      password: user.hashedPassword,
      phone: user.phone,
      pincode: user.pincode,
    });
  }
}

export default AuthService;
