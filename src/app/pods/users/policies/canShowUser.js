let policy = (request, reply, next) => {
  next(null, true);
};

export default policy;