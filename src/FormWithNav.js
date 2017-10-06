import React, { Component } from "react";
import PropTypes from "prop-types";
import { isEmptySchema, toArray } from "./utils";
import Navs from "./Navs";

const formWithTabs = (FormComponent, NavComponent = Navs) => {
  class FormWithTabs extends Component {
    handleNavChange = selNav => {
      let { navs: { activeNav } } = this.props.subForms[0];
      // Black magic
      // If this is an array, and there is an activeNav send selection, otherwise wrap it in array
      let notif =
        Array.isArray(selNav) && activeNav
          ? [activeNav].concat(selNav)
          : toArray(selNav);
      this.props.onNavChange(notif);
    };

    renderNavs = () => {
      let { navs } = this.props.subForms[0];
      return <NavComponent navs={navs} onNavChange={this.handleNavChange} />;
    };

    renderForm = () => {
      let conf = this.props.subForms[0];
      if (!isEmptySchema(conf.schema)) {
        let formConf = Object.assign(
          {},
          conf,
          {
            formData: this.props.formData,
          },
          this.props
        );
        return (
          <FormComponent
            {...formConf}
            onChange={this.props.onChange}
            onSubmit={this.props.onSubmit}>
            <div />
          </FormComponent>
        );
      } else {
        return <div />;
      }
    };

    renderNext = () => {
      let { subForms } = this.props;
      if (subForms.length > 1) {
        let nextSubForms = subForms.slice(1, subForms.length);
        let nextFormProps = Object.assign({}, this.props, {
          subForms: nextSubForms,
          onNavChange: this.handleNavChange,
          children: undefined,
        });
        return <FormWithTabs {...nextFormProps} />;
      } else {
        return <div />;
      }
    };

    render() {
      let { navs: { orientation = "horizontal" } } = this.props.subForms[0];

      switch (orientation) {
        case "vertical": {
          return (
            <div>
              <div className="col-md-3">{this.renderNavs()}</div>
              <div className="col-md-9">
                {this.renderForm()}
                {this.renderNext()}
              </div>
              {this.props.children}
            </div>
          );
        }
        default: {
          return (
            <div>
              <fieldset>
                <div className="form-group col-md-12">{this.renderNavs()}</div>
              </fieldset>
              {this.renderForm()}
              {this.renderNext()}
              {this.props.children}
            </div>
          );
        }
      }
    }
  }

  FormWithTabs.propTypes = {
    navs: PropTypes.shape({
      links: PropTypes.array,
    }),
  };

  return FormWithTabs;
};

export default formWithTabs;
