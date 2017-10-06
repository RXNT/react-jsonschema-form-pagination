export const GENERIC_TAB = "default";
export const UI_ORDER = "ui:order";
export const UI_NAV_ID = "nav";

export function isDevelopment() {
  return process.env.NODE_ENV !== "production";
}

export function findFieldNavs(field, uiSchema) {
  let navs =
    uiSchema[field] && uiSchema[field][UI_NAV_ID]
      ? uiSchema[field][UI_NAV_ID]
      : [];
  return Array.isArray(navs) ? navs : [navs];
}

export function getNavAliases({ navConf: { aliases = {} } = {} }) {
  return aliases;
}

export function orderNavByName(navs, { navConf: { order = [] } = {} }) {
  if (!order || order.length === 0) {
    return navs;
  }
  let orderedNavs = order.filter(orderedNav =>
    navs.some(nav => nav === orderedNav)
  );
  if (orderedNavs.length === 0) {
    return navs;
  }
  if (orderedNavs.length == navs.length) {
    return orderedNavs;
  }

  let nonOrderedNavs = navs.filter(nav => !orderedNavs.includes(nav));
  return orderedNavs.concat(nonOrderedNavs);
}

export function orderNavs(navs, uiSchema) {
  let navNames = navs.map(({ nav }) => nav);
  let orderedNavs = orderNavByName(navNames, uiSchema);
  return orderedNavs.map(ordNav => navs.find(({ nav }) => nav === ordNav));
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

export function isEmptySchema(schema) {
  return (
    !schema || !schema.properties || Object.keys(schema.properties).length === 0
  );
}
