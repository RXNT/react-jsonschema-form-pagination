import React from "react";
import { GENERIC_TAB } from "./utils";

function Nav({ handleClick, isActive, name }) {
  return (
    <li onClick={handleClick} className={isActive ? "active" : null}>
      <a>{name}</a>
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
        {relLinks.map(({ tabID, name, isActive }, i) => (
          <Nav
            key={i}
            name={name ? name : tabID}
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
