import React from "react";
import { GENERIC_NAV } from "../../src/utils";

function Navs({ navs: { links }, onNavChange }) {
  let relLinks = links.filter(({ nav }) => nav !== GENERIC_NAV);
  return (
    <nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="collapse navbar-collapse">
          <ul className="nav navbar-nav">
            {relLinks.map(({ nav, name, icon, isActive }, i) => (
              <li
                key={i}
                onClick={() => onNavChange(nav)}
                className={isActive ? "active" : null}>
                <a>
                  {icon && <span className={icon} aria-hidden="true" />}
                  &nbsp;{name || nav}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navs;
