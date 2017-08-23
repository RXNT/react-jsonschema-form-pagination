import { UI_TAB_ORDER } from "../utils";

export function order(tabs, ordering) {
  if (ordering.length === 0) {
    return tabs;
  }
  let orderedTabs = ordering
    .map(orderedTab => tabs.find(({ tabID }) => tabID === orderedTab))
    .filter(tab => tab !== undefined);
  if (orderedTabs.length === 0) {
    return tabs;
  }
  let rest = tabs.filter(tab => !orderedTabs.includes(tab));
  return orderedTabs.concat(rest);
}

export function findTab(layer, tabData) {
  let tab = tabData.find(({ tabID }) => tabID === layer);
  return tab ? tab : { tabID: layer };
}

export default function extractTabsForLayer(conf, uiSchema, tabData) {
  let tabs = Object.keys(conf).map(layer => findTab(layer, tabData));
  let orderedTabs = order(tabs, uiSchema[UI_TAB_ORDER]);
  return orderedTabs;
}
