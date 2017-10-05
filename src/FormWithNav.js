import React, { Component } from "react";
import deepequal from "deep-equal";
import PropTypes from "prop-types";
import { isDevelopment } from "./utils";
import Navs from "./Navs";

const formWithTabs = (FormComponent, NavComponent = Navs) => {
  class FormWithTabs extends Component {
    constructor(props) {
      super(props);

      let { formData } = this.props;
      this.state = { formData };
    }

    sameData = formData => {
      return (
        deepequal(this.props.formData, formData) ||
        deepequal(this.formData, formData)
      );
    };

    componentWillReceiveProps({ formData }) {
      if (!this.sameData(formData)) {
        this.formData = formData;
        this.setState({ formData });
      }
    }

    handleOnChange = state => {
      this.formData = state.formData;
      this.setState({ formData: state.formData });
      if (this.props.onChange) {
        this.props.onChange(state);
      }
    };

    shouldComponentUpdate(nextProps, nextState) {
      let sameProps = deepequal(
        Object.assign({}, this.props, { formData: {} }),
        Object.assign({}, nextProps, { formData: {} })
      );
      let sameState = deepequal(
        Object.assign({}, this.state, { formData: this.formData }),
        nextState
      );
      let sameData = this.sameData(nextProps.formData);
      return !sameProps || !sameState || !sameData;
    }

    renderForm = () => {
      if (this.props.schema) {
        let { formData } = this.state;
        let configs = Object.assign({}, this.props, {
          formData,
          onChange: this.handleOnChange,
        });
        return (
          <FormComponent {...configs}>
            <div />
          </FormComponent>
        );
      } else {
        return <div />;
      }
    };

    renderTabs = () => {
      let { navs, onTabChange } = this.props;
      return <NavComponent navs={navs} onTabChange={onTabChange} />;
    };

    render() {
      let { navs: { orientation = "horizontal" } } = this.props;

      switch (orientation) {
        case "vertical": {
          return (
            <div>
              <div className="col-md-3">{this.renderTabs()}</div>
              <div className="col-md-9">{this.renderForm()}</div>
            </div>
          );
        }
        default: {
          return (
            <div>
              {this.renderForm()}
              {this.renderTabs()}
            </div>
          );
        }
      }
    }
  }

  if (isDevelopment()) {
    FormWithTabs.propTypes = {
      navs: PropTypes.shape({
        links: PropTypes.array,
      }),
    };
  }

  return FormWithTabs;
};

export default formWithTabs;
