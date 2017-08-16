import { UI_TAB_ID } from "../src/utils";

export function testInProd(f) {
  process.env.NODE_ENV = "production";
  let res = f();
  process.env.NODE_ENV = "development";
  return res;
}

export function withTab(tabID) {
  if (Array.isArray(tabID)) {
    return { [UI_TAB_ID]: tabID };
  } else {
    return { [UI_TAB_ID]: [tabID] };
  }
}
