import React from "react";
import { GENERIC_NAV } from "../utils";

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

function Navs({ navs: { links }, onNavChange }) {
  let relLinks = links.filter(({ nav }) => nav !== GENERIC_NAV);
  if (relLinks.length > 0) {
    return (
      <ul className="nav nav-pills">
        {relLinks.map(({ nav, name, icon, isActive }, i) => (
          <Nav
            key={i}
            name={name ? name : nav}
            icon={icon}
            isActive={isActive}
            handleClick={() => onNavChange(nav)}
          />
        ))}
      </ul>
    );
  } else {
    return <div />;
  }
}

export default Navs;
