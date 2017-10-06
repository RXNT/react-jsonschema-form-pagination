export const GENERIC_TAB = "default";
export const UI_ORDER = "ui:order";
export const UI_NAV_ID = "ui:tabID";
export const UI_NAV_ALIAS = "ui:tabAlias";
export const UI_NAV_ORDER = "ui:tabOrder";

export function isDevelopment() {
  return process.env.NODE_ENV !== "production";
}

export function orderNavByName(navs, ordering) {
  if (!ordering || ordering.length === 0) {
    return navs;
  }
  let orderedNavs = ordering.filter(orderedNav =>
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

export function orderNavs(navs, ordering) {
  let navNames = navs.map(({ tabID }) => tabID);
  let orderedNavs = orderNavByName(navNames, ordering);
  return orderedNavs.map(nav => navs.find(({ tabID }) => tabID === nav));
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
