import React, { Component } from "react";
import deepequal from "deep-equal";
import PropTypes from "prop-types";
import { GENERIC_TAB, isDevelopment } from "./utils";
import Tabs from "./components/tabs";

const formWithTabs = FormComponent => {
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

    render() {
      let { tabs, activeTab } = this.props;
      let { formData } = this.state;
      let relTabs = tabs.filter(({ tabID }) => tabID !== GENERIC_TAB);

      let configs = Object.assign({}, this.props, {
        formData,
        onChange: this.handleOnChange,
      });

      return (
        <div>
          <div className="row">
            <FormComponent {...configs}>
              <div />
            </FormComponent>
          </div>
          <div className="row">
            <div className="col-md-12">
              {relTabs && relTabs.length > 0
                ? <Tabs
                    tabData={relTabs}
                    activeTab={activeTab}
                    onTabChange={this.props.onTabChange}
                  />
                : <div />}
            </div>
          </div>
        </div>
      );
    }
  }

  if (isDevelopment()) {
    FormWithTabs.propTypes = {
      tabs: PropTypes.array,
    };
  }

  return FormWithTabs;
};

export default formWithTabs;
