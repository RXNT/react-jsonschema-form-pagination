import extractSchemaForLayer from "../../src/splitter/extractSchemaForLayer";
import { GENERIC_TAB, UI_TAB_ALIAS, UI_TAB_ID } from "../../src/utils";

test("extract default schema", () => {
  let schema = {
    required: [],
    properties: {},
  };
  expect(extractSchemaForLayer(GENERIC_TAB, schema, {})).toEqual(schema);
});

test("extract layer from simple schema", () => {
  let schema = {
    required: [],
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
    },
  };
  let uiSchema = {
    firstName: {
      [UI_TAB_ID]: ["first"],
    },
    lastName: {
      [UI_TAB_ID]: ["last"],
    },
    [UI_TAB_ALIAS]: {},
  };
  expect(extractSchemaForLayer("last", schema, uiSchema)).toEqual({
    required: [],
    properties: {
      lastName: { type: "string" },
    },
  });
  expect(extractSchemaForLayer("first", schema, uiSchema)).toEqual({
    required: [],
    properties: {
      firstName: { type: "string" },
    },
  });
});

test("extract with proper required", () => {
  let schema = {
    required: ["firstName", "lastName"],
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
    },
  };
  let uiSchema = {
    firstName: {
      [UI_TAB_ID]: ["first"],
    },
    [UI_TAB_ALIAS]: {},
  };
  expect(extractSchemaForLayer("first", schema, uiSchema)).toEqual({
    required: ["firstName"],
    properties: {
      firstName: { type: "string" },
    },
  });
});

test("extract with aliases", () => {
  let schema = {
    required: [],
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
    },
  };
  let uiSchema = {
    firstNameAlias: {
      [UI_TAB_ID]: ["first"],
    },
    [UI_TAB_ALIAS]: {
      firstName: ["firstNameAlias"],
    },
  };
  expect(extractSchemaForLayer("first", schema, uiSchema)).toEqual({
    required: [],
    properties: {
      firstName: { type: "string" },
    },
  });
});
