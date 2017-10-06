import { GENERIC_TAB, UI_NAV_ORDER, orderNavs } from "../utils";

export function findNav(layer, navData) {
  let tab = navData.find(({ tabID }) => tabID === layer);
  return tab ? tab : { tabID: layer };
}

export default function extractNavs(conf, uiSchema, navData, activeNav) {
  let navs = Object.keys(conf)
    .filter(nav => nav !== GENERIC_TAB)
    .map(nav => findNav(nav, navData))
    .map(nav => Object.assign(nav, { isActive: nav.tabID === activeNav }));
  let orderedNavs = orderNavs(navs, uiSchema[UI_NAV_ORDER]);
  return { links: orderedNavs };
}
