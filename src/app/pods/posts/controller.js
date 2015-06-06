import _ from 'lodash';
import { Post } from '../../models';
import Boom from 'boom';
// import UserSerializer from '../../serializers/user';
export default {

  // POST
  create: function(req, reply) {
    let newPost = new Post(_.pick(req.payload.post, this._postParams));
  },

  _postParams: ['type','body']

};