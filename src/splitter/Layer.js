import { GENERIC_TAB } from "../utils";

export default class Layer {
  constructor(tabs, conf) {
    this.tabs = tabs;
    this.conf = conf;
    this.defaultTab = Object.assign({}, { tabs }, conf[GENERIC_TAB]);
    this.activeTab = this.chooseActive(tabs);
  }

  chooseActive(tabs) {
    let nonDefaultTabs = tabs.filter(({ tabID }) => tabID != GENERIC_TAB);
    return nonDefaultTabs.length > 0 ? nonDefaultTabs[0].tabID : GENERIC_TAB;
  }

  doUpdateActiveTabs = (activeTabs, i) => {
    if (i === activeTabs.length) {
      if (this.activeTab !== GENERIC_TAB) {
        activeTabs.push(this.activeTab);
        this.conf[this.activeTab].doUpdateActiveTabs(activeTabs, i + 1);
      }
    } else {
      this.activeTab = activeTabs[i];
      this.conf[activeTabs[i]].doUpdateActiveTabs(activeTabs, i + 1);
    }
    return activeTabs;
  };

  updateActiveTabs = activeTabs => this.doUpdateActiveTabs(activeTabs, 0);

  toSubForms = activeTabs => {
    let agg = [];
    let tab = activeTabs[0];
    agg.push(Object.assign({}, this.defaultTab, { activeTab: tab }));
    if (activeTabs.length === 0) {
      return agg;
    }
    if (tab !== GENERIC_TAB) {
      let nextConf = this.conf[tab];
      let nextTabs = activeTabs.slice(1);
      let nestedTabs = nextConf.toSubForms(nextTabs);
      nestedTabs.forEach(conf => agg.push(conf));
    }
    return agg;
  };
}
