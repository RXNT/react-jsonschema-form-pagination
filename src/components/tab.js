import React from "react";

class Tab extends React.Component {
  render() {
    return (
      <li
        onClick={this.props.handleClick}
        className={this.props.isActive ? "active" : null}>
        <a href="#">
          {this.props.data.name}
        </a>
      </li>
    );
  }
}

export default Tab;
