import Bcrypt from 'bcrypt';

const salt = process.env.SALT || "$2a$10$cX6aQEp.nCvmIGlXMQobMe";

var encrypt = function(txt) {
  return Bcrypt.hashSync(txt, salt);
};

var compare = function(txt, hash) {
  return Bcrypt.compareSync(txt, hash);
}

export {encrypt, compare};