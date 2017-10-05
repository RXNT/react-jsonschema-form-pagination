import { GENERIC_TAB, UI_TAB_ORDER } from "../utils";

export function order(navs, ordering) {
  if (!ordering || ordering.length === 0) {
    return navs;
  }
  let orderedNavs = ordering
    .map(orderedNav => navs.find(({ tabID }) => tabID === orderedNav))
    .filter(nav => nav !== undefined);
  if (orderedNavs.length === 0) {
    return navs;
  }
  let rest = navs.filter(nav => !orderedNavs.includes(nav));
  return orderedNavs.concat(rest);
}

export function findNav(layer, navData) {
  let tab = navData.find(({ tabID }) => tabID === layer);
  return tab ? tab : { tabID: layer };
}

export default function extractNavs(conf, uiSchema, navData, activeNav) {
  let navs = Object.keys(conf)
    .filter(nav => nav !== GENERIC_TAB)
    .map(nav => findNav(nav, navData))
    .map(nav => Object.assign(nav, { isActive: nav.tabID === activeNav }));
  let orderedNavs = order(navs, uiSchema[UI_TAB_ORDER]);
  return { links: orderedNavs };
}
