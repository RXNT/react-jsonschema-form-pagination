import { order } from "../../src/splitter/extractSubNavs";

test("simple ordering", () => {
  let navs = [{ tabID: "Second" }, { tabID: "First" }];
  expect(order(navs, ["First", "Second"])).toEqual([
    { tabID: "First" },
    { tabID: "Second" },
  ]);
  expect(order(navs, ["First"])).toEqual([
    { tabID: "First" },
    { tabID: "Second" },
  ]);
});
