import User from '../models/User';

class QueryService {
  constructor(private userRepository: typeof User) {}
  async findByEmail(email: string) {
    return await this.userRepository.findOne({ email: email });
  }
}

export default QueryService;
