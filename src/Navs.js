import React from "react";
import { GENERIC_TAB } from "./utils";

function Nav({ handleClick, isActive, name }) {
  return (
    <li onClick={handleClick} className={isActive ? "active" : null}>
      <a>{name}</a>
    </li>
  );
}

function Navs({ activeTab, tabs, onTabChange }) {
  let relTabs = tabs.filter(({ tabID }) => tabID !== GENERIC_TAB);
  if (relTabs.length > 0) {
    return (
      <fieldset>
        <div className="form-group col-md-12">
          <ul className="nav nav-pills">
            {relTabs.map(({ tabID, name }, i) => (
              <Nav
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

export default Navs;
