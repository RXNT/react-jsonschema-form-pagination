import React, { Component } from "react";
import applyPagination from "../../src/index";
import Form from "react-jsonschema-form";
import CustomTabs from "./CustomTabs";
import conf from "./conf";

let FormWithPagination = applyPagination(Form, CustomTabs);

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
        onTabChange={this.handleTabChange}>
        <div className="col-md-12">
          <div className="form-group pull-right">
            <div className="btn btn-success">Save</div>
          </div>
        </div>
      </FormWithPagination>
    );
  }
}
