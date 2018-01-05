import { GENERIC_NAV } from "../utils";

export function toNavConf(nav, { navConf: { navs = [] } = {} }) {
  return navs.find(conf => conf.nav === nav);
}

export function toNavConfOrDefault(nav, uiSchema) {
  let navConf = toNavConf(nav, uiSchema);
  return navConf ? navConf : { nav };
}

export function orderNavByName(navs, { navConf: { order = [] } = {} }) {
  if (!order || order.length === 0) {
    return navs;
  }

  let orderedNavs = navs
    .filter(nav => order.includes(nav))
    .sort((a, b) => order.indexOf(a) - order.indexOf(b));
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

export function buildNavs(tree, uiSchema, activeNav) {
  let navs = Object.keys(tree)
    .filter(nav => nav !== GENERIC_NAV)
    .map(nav => toNavConfOrDefault(nav, uiSchema))
    .map(nav => Object.assign({ isActive: nav.nav === activeNav }, nav));
  let orderedNavs = orderNavs(navs, uiSchema);
  return { links: orderedNavs, activeNav };
}

export default function extractSubNavs(tree, uiSchema, navPath, onNavChange) {
  let activeNav = navPath[navPath.length - 1];
  let navs = buildNavs(tree, uiSchema, activeNav);
  if (navs && navs.links.length > 0) {
    return {
      navs,
      onNavChange: nav => {
        let selectedNav =
          navPath.length === 0
            ? [nav]
            : navPath.slice(0, navPath.length - 1).concat([nav]);
        onNavChange(selectedNav);
      },
    };
  } else {
    return undefined;
  }
}
