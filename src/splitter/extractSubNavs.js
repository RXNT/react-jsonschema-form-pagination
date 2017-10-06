import { GENERIC_NAV } from "../utils";
export const UI_NAV_ID = "nav";

export function toNavConf(layer, { navConf: { navs = [] } = {} }) {
  let nav = navs.find(({ nav }) => nav === layer);
  return nav;
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

export default function extractSubNavs(tree, uiSchema, activeNav) {
  let navs = Object.keys(tree)
    .filter(nav => nav !== GENERIC_NAV)
    .map(nav => {
      let navConf = toNavConf(nav, uiSchema);
      return navConf ? navConf : { nav };
    })
    .map(nav => Object.assign(nav, { isActive: nav.nav === activeNav }));
  let orderedNavs = orderNavs(navs, uiSchema);
  return { links: orderedNavs, activeNav };
}
