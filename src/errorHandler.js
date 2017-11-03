export function fetchField({ property, argument }) {
  if (property === "instance") {
    return argument;
  } else {
    let fullField = property.startsWith("instance")
      ? property.substring(9)
      : property.substring(1);
    let nextArrSep = fullField.indexOf("[");
    let nextFieldSep = fullField.indexOf(".");
    let nextSeparator =
      nextArrSep != -1 && nextFieldSep != -1
        ? Math.min(nextArrSep, nextFieldSep)
        : Math.max(nextArrSep, nextFieldSep);
    if (nextSeparator === -1) {
      return fullField;
    } else {
      return fullField.substring(0, nextSeparator);
    }
  }
}

const errorHandler = (navTree, transformErrors) => errors => {
  let errorsWithNav = errors.map(error => {
    let field = fetchField(error);
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
