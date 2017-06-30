import React from "react";
import Tab from "./tab";

class Tabs extends React.Component {
  render() {
    return (
      <ul className="nav nav-tabs">
        {this.props.tabData.map(
          function(tab, i) {
            return (
              <Tab
                data={tab}
                key={i}
                isActive={this.props.activeTab === tab.name}
                handleClick={this.props.changeTab.bind(this, tab)}
              />
            );
          }.bind(this)
        )}
      </ul>
    );
  }
}

export default Tabs;
