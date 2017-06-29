import React, { Component } from "react";
import PropTypes from "prop-types";
import { isDevelopment } from "./utils";

export default function applyRules(FormComponent) {
  class FormWithPagination extends Component {
    constructor(props) {
      super(props);

      //TODO: no paging logic added yet. This module currently does nothing.

      let { schema, uiSchema, formData } = this.props;
      this.state = { schema, uiSchema, formData };

      let self = this;
      this.rulesEngine
        .run(formData)
        .then(this.rulesExecutor.run)
        .then(newState => {
          self.setState(newState);
        });
    }

    componentWillReceiveProps(nextProps) {
      let { schema, formData, uiSchema } = nextProps;
      this.setState({ schema, formData, uiSchema });
    }

    render() {
      let configs = Object.assign({}, this.props);

      delete configs.schema;
      delete configs.formData;
      delete configs.onChange;
      delete configs.uiSchema;

      return (
        <FormComponent
          {...configs}
          schema={this.state.schema}
          uiSchema={this.state.uiSchema}
          formData={this.state.formData}
        />
      );
    }
  }

  if (isDevelopment()) {
    FormWithPagination.propTypes = {
      rules: PropTypes.object.isRequired,
    };
  }

  return FormWithPagination;
}
