import {
  UI_TAB_ID,
  UI_TAB_ALIAS,
  normalizeSchema,
  normalizeUiSchema,
  isEmptySchema,
  isDevelopment,
  toError,
  UI_TAB_ORDER,
} from "../src/utils";
import { testInProd } from "./utils";

test("normalize schema", () => {
  expect(normalizeSchema({})).toEqual({ required: [], properties: {} });
  expect(normalizeSchema({ required: undefined })).toEqual({
    required: [],
    properties: {},
  });
  expect(normalizeSchema({ required: null })).toEqual({
    required: [],
    properties: {},
  });
  expect(normalizeSchema({ required: [] })).toEqual({
    required: [],
    properties: {},
  });
});

test("normalize empty UI schema", () => {
  let normEmptyUiSchema = {
    [UI_TAB_ALIAS]: {},
    [UI_TAB_ORDER]: [],
  };
  expect(normalizeUiSchema({})).toEqual(normEmptyUiSchema);
  expect(normalizeUiSchema()).toEqual(normEmptyUiSchema);
  expect(normalizeUiSchema(undefined)).toEqual(normEmptyUiSchema);
});

test("normalize UI schema tabs", () => {
  let tabAsString = {
    firstName: {
      [UI_TAB_ID]: "lastName",
    },
  };
  let normTabAsString = {
    firstName: {
      [UI_TAB_ID]: ["lastName"],
    },
    [UI_TAB_ALIAS]: {},
    [UI_TAB_ORDER]: [],
  };
  expect(normalizeUiSchema(tabAsString)).toEqual(normTabAsString);
});

test("normalize UI schema aliases with original field", () => {
  let aliasAsString = {
    firstName: {},
    [UI_TAB_ALIAS]: {
      firstName: "lastNameAlias",
    },
  };
  let normAliasAsString = {
    firstName: {},
    [UI_TAB_ALIAS]: {
      firstName: ["lastNameAlias"],
    },
    [UI_TAB_ORDER]: [],
  };
  expect(normalizeUiSchema(aliasAsString)).toEqual(normAliasAsString);
});

test("normalize UI schema aliases without original field", () => {
  let aliasAsString = {
    [UI_TAB_ALIAS]: {
      firstName: "lastNameAlias",
    },
  };
  let normAliasAsString = {
    [UI_TAB_ALIAS]: {
      firstName: ["lastNameAlias"],
    },
    [UI_TAB_ORDER]: [],
  };
  expect(normalizeUiSchema(aliasAsString)).toEqual(normAliasAsString);
});

test("keep normalized UI schema", () => {
  let aliasAsString = {
    [UI_TAB_ALIAS]: {
      firstName: ["lastNameAlias"],
    },
    [UI_TAB_ORDER]: [],
  };
  expect(normalizeUiSchema(aliasAsString)).toEqual(aliasAsString);
});

test("Is empty schema", () => {
  expect(isEmptySchema({})).toBeTruthy();
  expect(isEmptySchema(undefined)).toBeTruthy();
  expect(isEmptySchema(null)).toBeTruthy();
  expect(isEmptySchema({ properties: {} })).toBeTruthy();
});

test("Is development", () => {
  expect(isDevelopment()).toBeTruthy();
  expect(testInProd(() => isDevelopment())).toBeFalsy();
  expect(isDevelopment()).toBeTruthy();
});

test("To error", () => {
  expect(() => toError("message")).toThrow();
  expect(testInProd(() => toError("message"))).toBeUndefined();
});
