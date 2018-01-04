export const GENERIC_NAV = "default";
export const UI_ORDER = "ui:order";
export const UI_NAV_ID = "nav";

export function findFieldNavs(field, uiSchema) {
  let navs =
    uiSchema[field] && uiSchema[field][UI_NAV_ID]
      ? uiSchema[field][UI_NAV_ID]
      : [];
  return toArray(navs);
}

export function getNavAliases({ navConf: { aliases = {} } = {} }) {
  return aliases;
}

export function isDevelopment() {
  return process.env.NODE_ENV !== "production";
}

export const toError = message => {
  if (isDevelopment()) {
    throw new ReferenceError(message);
  } else {
    console.error(message);
  }
};

export function toArray(val) {
  if (Array.isArray(val)) {
    return val;
  } else {
    return [val];
  }
}

export function cleanProps(props) {
  return Object.assign({}, props, {
    schema: undefined,
    uiSchema: undefined,
    formData: undefined,
    activeNav: undefined,
  });
}

export function isEmptySchema(schema) {
  return (
    !schema || !schema.properties || Object.keys(schema.properties).length === 0
  );
}
