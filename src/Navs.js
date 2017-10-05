import React from "react";
import { GENERIC_TAB } from "./utils";

function Nav({ handleClick, isActive, name }) {
  return (
    <li onClick={handleClick} className={isActive ? "active" : null}>
      <a>{name}</a>
    </li>
  );
}

function Navs({ navs: { links }, onTabChange }) {
  let relLinks = links.filter(({ tabID }) => tabID !== GENERIC_TAB);
  if (relLinks.length > 0) {
    return (
      <fieldset>
        <div className="form-group col-md-12">
          <ul className="nav nav-pills">
            {relLinks.map(({ tabID, name, isActive }, i) => (
              <Nav
                key={i}
                name={name ? name : tabID}
                isActive={isActive}
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
