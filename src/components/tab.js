import React from "react";

function Tab({ handleClick, isActive, data: { name } }) {
  return (
    <li onClick={handleClick} className={isActive ? "active" : null}>
      <a>
        {name}
      </a>
    </li>
  );
}

export default Tab;
