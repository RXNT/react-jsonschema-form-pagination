import { isEmptySchema, isDevelopment, toError, toArray } from "../src/utils";
import { testInProd } from "./utils";

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

test("To array", () => {
  expect(toArray("v")).toEqual(["v"]);
  expect(toArray(["v"])).toEqual(["v"]);
});
