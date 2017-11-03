import React from "react";
import Form from "react-jsonschema-form";
import applyPagination from "../../src";
import renderer from "react-test-renderer";

let schema = {
  type: "object",
  properties: {
    firstName: {
      type: "string",
      default: "",
    },
    lastName: { type: "string" },
  },
};
let uiSchema = {
  "ui:order": ["firstName", "lastName"],
  firstName: {
    classNames: "col-md-12",
  },
};
let formData = {
  firstName: "Bill",
};

test("Initial formData rendered", () => {
  let ResForm = applyPagination(Form);
  const component = renderer.create(
    <ResForm schema={schema} uiSchema={uiSchema} formData={formData} />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
