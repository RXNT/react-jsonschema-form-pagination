import { findLayer, GENERIC_TAB, UI_TAB_ID } from "../src/utils";

test("find layer no uiSchema", () => {
  expect(findLayer("familyName", {})).toEqual(GENERIC_TAB);
  expect(findLayer("familyName", undefined)).toEqual(GENERIC_TAB);
  expect(findLayer("familyName", null)).toEqual(GENERIC_TAB);
});

test("find layer with uiSchema", () => {
  expect(
    findLayer("familyName", { familyName: { [UI_TAB_ID]: ["A"] } })
  ).toEqual("A");
});
