export function findTab(layer, tabData) {
  let tab = tabData.find(({ tabID }) => tabID === layer);
  return tab ? tab : { tabID: layer };
}

export default function extractTabsForLayer(conf, tabData) {
  let tabs = Object.keys(conf).map(layer => findTab(layer, tabData));
  return tabs;
}
