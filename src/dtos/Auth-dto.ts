import { User } from '../types';

class UserDto {
  userDto(user: User) {
    const userData = {
      id: user?._id,
      email: user.email,
      name: user.name,
    };
    return userData;
  }
}

export default UserDto;
