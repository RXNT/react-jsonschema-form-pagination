import { GENERIC_TAB, orderNavs } from "../utils";

export function toNavConf(layer, { navConf: { navs = [] } = {} }) {
  let nav = navs.find(({ nav }) => nav === layer);
  return nav;
}

export default function extractSubNavs(conf, uiSchema, activeNav) {
  let navs = Object.keys(conf)
    .filter(nav => nav !== GENERIC_TAB)
    .map(nav => {
      let navConf = toNavConf(nav, uiSchema);
      return navConf ? navConf : { nav };
    })
    .map(nav => Object.assign(nav, { isActive: nav.nav === activeNav }));
  let orderedNavs = orderNavs(navs, uiSchema);
  return { links: orderedNavs };
}
