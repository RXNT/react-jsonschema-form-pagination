import React from "react";
import Form from "react-jsonschema-form";
import applyPagination from "../../src";
import renderer from "react-test-renderer";

const schema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
  },
};

const uiSchema = {
  firstName: { nav: "first" },
  lastName: { nav: "last" },
  navConf: {
    navs: [
      {
        nav: "default",
        orientation: "vertical",
      },
    ],
  },
};

test("render vertical tabs", () => {
  let ResForm = applyPagination(Form);
  const component = renderer.create(
    <ResForm schema={schema} uiSchema={uiSchema} />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
