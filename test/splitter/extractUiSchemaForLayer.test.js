import extractUiSchemaForLayer from "../../src/splitter/extractUiSchemaForLayer";
import { GENERIC_TAB, UI_TAB_ALIAS, UI_TAB_ID } from "../../src/utils";
import { testInProd } from "../utils";

const schema = {
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
  },
};

test("extract default uiSchema", () => {
  let uiSchema = {
    firstName: {},
    lastName: {},
    [UI_TAB_ALIAS]: {},
  };
  expect(extractUiSchemaForLayer(GENERIC_TAB, schema, uiSchema)).toEqual(
    uiSchema
  );
});

test("extract layer from simple uiSchema", () => {
  let uiSchema = {
    firstName: {
      [UI_TAB_ID]: ["first"],
    },
    lastName: {
      [UI_TAB_ID]: ["last"],
    },
    [UI_TAB_ALIAS]: {},
  };
  expect(extractUiSchemaForLayer("first", schema, uiSchema)).toEqual({
    firstName: {},
    lastName: {},
    [UI_TAB_ALIAS]: {},
  });
  expect(extractUiSchemaForLayer("last", schema, uiSchema)).toEqual({
    firstName: {},
    lastName: {},
    [UI_TAB_ALIAS]: {},
  });
});

test("extract nested layer from simple uiSchema", () => {
  let uiSchema = {
    firstName: {
      [UI_TAB_ID]: ["first", "last"],
    },
    [UI_TAB_ALIAS]: {},
  };
  expect(extractUiSchemaForLayer("first", schema, uiSchema)).toEqual({
    firstName: {
      [UI_TAB_ID]: ["last"],
    },
    [UI_TAB_ALIAS]: {},
  });
});

test("extract with aliases", () => {
  let uiSchema = {
    firstName: {
      [UI_TAB_ID]: ["original"],
      classNames: "col-md-5",
    },
    firstNameAlias: {
      [UI_TAB_ID]: ["first"],
      classNames: "col-md-10",
    },
    [UI_TAB_ALIAS]: {
      firstName: ["firstNameAlias"],
    },
  };
  expect(extractUiSchemaForLayer("original", schema, uiSchema)).toEqual({
    firstName: {
      classNames: "col-md-5",
    },
    firstNameAlias: {
      classNames: "col-md-10",
    },
    [UI_TAB_ALIAS]: {
      firstName: ["firstNameAlias"],
    },
  });

  expect(extractUiSchemaForLayer("first", schema, uiSchema)).toEqual({
    firstName: {
      classNames: "col-md-10",
    },
    firstNameAlias: {
      classNames: "col-md-10",
    },
    [UI_TAB_ALIAS]: {
      firstName: ["firstNameAlias"],
    },
  });
});

test("extract with aliases error", () => {
  let uiSchema = {
    firstName: {
      [UI_TAB_ID]: ["original"],
      classNames: "col-md-5",
    },
    firstNameAlias: {
      [UI_TAB_ID]: ["first"],
      classNames: "col-md-10",
    },
    firstNameAnotherAlias: {
      [UI_TAB_ID]: ["first"],
      classNames: "col-md-10",
    },
    [UI_TAB_ALIAS]: {
      firstName: ["firstNameAlias", "firstNameAnotherAlias"],
    },
  };
  expect(() => extractUiSchemaForLayer("first", schema, uiSchema)).toThrow();
  expect(
    testInProd(() => extractUiSchemaForLayer("first", schema, uiSchema))
  ).not.toBeUndefined();
});
