import { order } from "../../src/splitter/extractTabsForLayer";

test("simple ordering", () => {
  let tabs = [{ tabID: "Second" }, { tabID: "First" }];
  expect(order(tabs, ["First", "Second"])).toEqual([
    { tabID: "First" },
    { tabID: "Second" },
  ]);
  expect(order(tabs, ["First"])).toEqual([
    { tabID: "First" },
    { tabID: "Second" },
  ]);
});
