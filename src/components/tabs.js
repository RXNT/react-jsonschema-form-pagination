import React from "react";
import Tab from "./tab";
import { GENERIC_TAB } from "../utils";

function Tabs({ activeTab, tabs, onTabChange }) {
  let relTabs = tabs.filter(({ tabID }) => tabID !== GENERIC_TAB);
  if (relTabs.length > 0) {
    return (
      <ul className="nav nav-tabs">
        {relTabs.map((tab, i) =>
          <Tab
            key={i}
            data={tab}
            isActive={activeTab === tab.tabID}
            handleClick={() => onTabChange(tab)}
          />
        )}
      </ul>
    );
  } else {
    return <div />;
  }
}

export default Tabs;
