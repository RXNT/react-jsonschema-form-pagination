import React, { Component } from "react";
import applyNav from "../../src";
import Form from "react-jsonschema-form";
import conf from "./conf";
import CustomNav from "./CustomNavs";

let FormWithNav = applyNav(Form, CustomNav);

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = { formData: {} };
  }

  handleError(errors) {
    console.log(errors);
  }

  handleChange = conf => {
    this.setState({ formData: conf.formData });
    console.log(`Data changed ${JSON.stringify(conf)}`);
  };

  handleNavChange = (nextTabs, prevTabs) => {
    console.log(`Tab changed`);
    console.log(`From ${prevTabs}`);
    console.log(`To ${nextTabs}`);
  };

  transformErrors = errors =>
    errors.map(error => {
      if (error.activeNav) {
        let navPostfix = ` (${error.activeNav
          .map(({ nav, name }) => name || nav)
          .join(" > ")})`;
        error.message = `${error.message}${navPostfix}`;
        error.stack = `${error.stack}${navPostfix}`;
      }
      return error;
    });

  render() {
    let fullConf = Object.assign({}, conf);
    return (
      <FormWithNav
        {...fullConf}
        liveValidation={true}
        noHtml5Validate={true}
        formData={this.state.formData}
        transformErrors={this.transformErrors}
        onSubmit={() => console.log("Submitting form data")}
        onChange={this.handleChange}
        onError={this.handleError}
        onNavChange={this.handleNavChange}>
        <div className="form-group col-md-12">
          <button className="btn btn-success" type="submit">
            Save
          </button>
        </div>
      </FormWithNav>
    );
  }
}
