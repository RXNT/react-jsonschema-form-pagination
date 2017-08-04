import React, { Component } from "react";
import applyPagination from "../../src/index";
import applyRules from "react-jsonschema-form-conditionals";
import Form from "react-jsonschema-form";
import conf from "./conf";

let FormWithPagination = applyRules(applyPagination(Form));

export class App extends Component {
  handleChange = ({ formData }) => {
    this.setState({ formData });
  };
  render() {
    let fullConf = Object.assign({}, conf, this.state);
    return <FormWithPagination {...fullConf} onChange={this.handleChange} />;
  }
}
