import {
  UI_TAB_ID,
  UI_TAB_ALIAS,
  normalizeSchema,
  normalizeUiSchema,
  isEmptySchema,
  isDevelopment,
  toError,
} from "../src/utils";
import { testInProd } from "./utils";

test("normalize schema", () => {
  expect(normalizeSchema({})).toEqual({ required: [] });
  expect(normalizeSchema({ required: undefined })).toEqual({ required: [] });
  expect(normalizeSchema({ required: null })).toEqual({ required: [] });
  expect(normalizeSchema({ required: [] })).toEqual({ required: [] });
});

test("normalize empty UI schema", () => {
  let normEmptyUiSchema = {
    [UI_TAB_ALIAS]: {},
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
  };
  expect(normalizeUiSchema(aliasAsString)).toEqual(normAliasAsString);
});

test("keep normalized UI schema", () => {
  let aliasAsString = {
    [UI_TAB_ALIAS]: {
      firstName: ["lastNameAlias"],
    },
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
