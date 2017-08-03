import React from "react";
import Tab from "./tab";

function Tabs({ activeTab, tabData, onTabChange }) {
  return (
    <ul className="nav nav-tabs">
      {tabData.map((tab, i) =>
        <Tab
          key={i}
          data={tab}
          isActive={activeTab === tab.tabID}
          handleClick={() => onTabChange(tab)}
        />
      )}
    </ul>
  );
}

export default Tabs;
