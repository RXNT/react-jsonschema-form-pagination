import React from "react";
import { GENERIC_TAB } from "./utils";

function Nav({ handleClick, isActive, name, icon }) {
  return (
    <li onClick={handleClick} className={isActive ? "active" : null}>
      <a>
        {icon && <span className={icon} aria-hidden="true" />}
        &nbsp;{name}
      </a>
    </li>
  );
}

function Navs({ navs: { orientation = "horizontal", links }, onNavChange }) {
  let relLinks = links.filter(({ tabID }) => tabID !== GENERIC_TAB);
  let className =
    orientation === "vertical" ? "nav nav-pills nav-stacked" : "nav nav-pills";
  if (relLinks.length > 0) {
    return (
      <ul className={className}>
        {relLinks.map(({ tabID, name, icon, isActive }, i) => (
          <Nav
            key={i}
            name={name ? name : tabID}
            icon={icon}
            isActive={isActive}
            handleClick={() => onNavChange(tabID)}
          />
        ))}
      </ul>
    );
  } else {
    return <div />;
  }
}

export default Navs;
