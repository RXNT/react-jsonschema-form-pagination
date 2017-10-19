const errorHandler = (navTree, transformErrors) => errors => {
  let errorsWithNav = errors.map(error => {
    let field =
      error.property === "instance"
        ? error.argument
        : error.property.substring(9);
    let activeNav = navTree.findActiveNav(field);
    if (activeNav && activeNav.length > 0) {
      return Object.assign({ activeNav }, error);
    } else {
      return error;
    }
  });

  if (transformErrors) {
    return transformErrors(errorsWithNav);
  } else {
    return errorsWithNav;
  }
};

export default errorHandler;
