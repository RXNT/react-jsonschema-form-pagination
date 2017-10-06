import { orderNavs } from "../../src/utils";

test("simple ordering", () => {
  let navs = [{ tabID: "Second" }, { tabID: "First" }];
  expect(orderNavs(navs, ["First", "Second"])).toEqual([
    { tabID: "First" },
    { tabID: "Second" },
  ]);
  expect(orderNavs(navs, ["First"])).toEqual([
    { tabID: "First" },
    { tabID: "Second" },
  ]);
});
