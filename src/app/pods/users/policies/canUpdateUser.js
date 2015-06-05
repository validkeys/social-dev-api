let policy = (request, reply, next) => {

  if (!request.auth.isAuthenticated || request.auth.isAuthenticated === undefined){
    return next(null, false, "You must be logged in to update a user");
  }

  if (!request.auth.credentials || !request.data || !request.data.User) {
    return next(null, false, "Could not retrieve either your credentials or the user you are trying to update");
  }

  if (request.auth.credentials.id !== request.data.User.id) {
    return next(null, false, "You may not update that user");
  } else {
    return next(null, true);
  }

};

export default policy;