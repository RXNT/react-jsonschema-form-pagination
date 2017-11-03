import React from "react";
import Form from "react-jsonschema-form";
import applyPagination from "../../src";
import sinon from "sinon";
import Adapter from "enzyme-adapter-react-16";
import { mount, configure } from "enzyme";

configure({ adapter: new Adapter() });

const schema = {
  type: "object",
  properties: {
    owner: { type: "string" },
    members: {
      type: "array",
      items: {
        type: "object",
        required: ["firstName"],
        properties: {
          firstName: { type: "string" },
          lastName: { type: "string" },
        },
      },
    },
  },
};

const uiSchema = {
  owner: {
    nav: ["owne"],
  },
  members: {
    nav: ["members"],
  },
};

const INVALID_FORM_DATA = { members: [{ lastName: "J" }] };

test("Specify activeNav on error in array", () => {
  let transformErrors = sinon.spy(errors => errors);

  let ResForm = applyPagination(Form);
  const wrapper = mount(
    <ResForm
      schema={schema}
      uiSchema={uiSchema}
      formData={INVALID_FORM_DATA}
      transformErrors={transformErrors}
    />
  );
  wrapper.simulate("submit");

  expect(transformErrors.calledOnce).toEqual(true);
  expect(transformErrors.getCall(0).args[0][0].activeNav).not.toBeUndefined();
});
