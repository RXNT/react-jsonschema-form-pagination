import { GENERIC_TAB } from "../../src/utils";
import React from "react";

function Tab({ handleClick, isActive, name }) {
  return (
    <li onClick={handleClick} className={isActive ? "active" : null}>
      <a>{name}</a>
    </li>
  );
}

function Tabs({ activeTab, tabs, onTabChange }) {
  let relTabs = tabs.filter(({ tabID }) => tabID !== GENERIC_TAB);
  if (relTabs.length > 0) {
    return (
      <fieldset>
        <div className="form-group col-md-12">
          <ul className="nav nav-tabs">
            {relTabs.map(({ tabID, name }, i) => (
              <Tab
                key={i}
                name={name ? name : tabID}
                isActive={activeTab === tabID}
                handleClick={() => onTabChange(tabID)}
              />
            ))}
          </ul>
        </div>
      </fieldset>
    );
  } else {
    return <div />;
  }
}

export default Tabs;
