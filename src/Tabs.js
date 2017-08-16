import React from "react";
import { GENERIC_TAB } from "./utils";

function Tab({ handleClick, isActive, name }) {
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
        {relTabs.map(({ tabID, name }, i) =>
          <Tab
            key={i}
            name={name ? name : tabID}
            isActive={activeTab === tabID}
            handleClick={() => onTabChange(tabID)}
          />
        )}
      </ul>
    );
  } else {
    return <div />;
  }
}

export default Tabs;
