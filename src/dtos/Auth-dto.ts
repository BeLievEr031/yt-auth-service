import { User } from '../types';

class UserDto {
  userDto(user: User) {
    const userData = {
      id: user?._id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      pincode: user.pincode,
      initialPrice: user.initialPrice,
      expertiseIN: user.expertiseIN,
      role: user.role,
    };
    return userData;
  }
}

export default UserDto;
