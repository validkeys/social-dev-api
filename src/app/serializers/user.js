import BaseSerializer from './base';

class UserSerializer extends BaseSerializer {
  constructor(data = {}) {
    super(data);
    this.fields = ['id','firstName','lastName','email','username','createdAt','updatedAt'];
  }
}

export default UserSerializer;