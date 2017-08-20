import React, { Component } from "react";
import applyPagination from "../../src/index";
import Form from "react-jsonschema-form";
import conf from "./conf";

let FormWithPagination = applyPagination(Form);

export class App extends Component {
  handleChange = ({ formData }) => {
    this.setState({ formData });
  };

  handleTabChange = (nextTabs, prevTabs) => {
    console.log(`Tab changed`);
    console.log(`From ${prevTabs}`);
    console.log(`To ${nextTabs}`);
  };

  render() {
    let fullConf = Object.assign({}, conf, this.state);
    return (
      <FormWithPagination
        {...fullConf}
        onChange={this.handleChange}
        onTabChange={this.handleTabChange}
      />
    );
  }
}
