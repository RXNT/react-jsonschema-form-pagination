import React from "react";
import { GENERIC_TAB } from "./utils";

function Tab({ handleClick, isActive, data: { name } }) {
  return (
    <li onClick={handleClick} className={isActive ? "active" : null}>
      <a>
        {name}
      </a>
    </li>
  );
}

function Tabs({ activeTab, tabs, onTabChange }) {
  let relTabs = tabs.filter(({ tabID }) => tabID !== GENERIC_TAB);
  if (relTabs.length > 0) {
    return (
      <ul className="nav nav-pills">
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
