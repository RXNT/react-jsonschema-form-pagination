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
        liveValidation={true}
        onSubmit={() => console.log("Submitting form data")}
        onChange={this.handleChange}
        onTabChange={this.handleTabChange}>
        <div className="col-md-12">
          <div className="form-group pull-right">
            <button className="btn btn-success" type="submit">
              Save
            </button>
          </div>
        </div>
      </FormWithPagination>
    );
  }
}
