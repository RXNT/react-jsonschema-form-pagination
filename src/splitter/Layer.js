import { GENERIC_TAB } from "../utils";

export default class Layer {
  constructor(conf, tabs) {
    this.conf = conf;
    this.tabs = tabs;
    this.activeTab = conf.tabs.length > 0 ? conf.tabs[0].tabID : GENERIC_TAB;
  }

  updateActiveTabs = (activeTabs, i = 0) => {
    if (i === activeTabs.length) {
      if (this.activeTab !== GENERIC_TAB) {
        activeTabs.push(this.activeTab);
        this.tabs[this.activeTab].updateActiveTabs(activeTabs, i + 1);
      }
    } else {
      this.activeTab = activeTabs[i];
      this.tabs[activeTabs[i]].updateActiveTabs(activeTabs, i + 1);
    }
    return activeTabs;
  };

  toSubForms = activeTabs => {
    let agg = [];
    let tab = activeTabs[0] ? activeTabs[0] : GENERIC_TAB;
    agg.push(Object.assign({}, this.conf, { activeTab: tab }));
    if (tab === GENERIC_TAB) {
      return agg;
    }

    let nextLayer = this.tabs[tab];
    let nextTabs = activeTabs.slice(1);
    let nestedTabs = nextLayer.toSubForms(nextTabs);
    nestedTabs.forEach(conf => agg.push(conf));
    return agg;
  };
}
