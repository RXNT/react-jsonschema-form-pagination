import { orderNavs } from "../../src/splitter/extractSubNavs";

test("simple ordering", () => {
  let navs = [{ nav: "Second" }, { nav: "First" }];
  expect(orderNavs(navs, { navConf: { order: ["First", "Second"] } })).toEqual([
    { nav: "First" },
    { nav: "Second" },
  ]);
  expect(orderNavs(navs, { navConf: { order: ["First"] } })).toEqual([
    { nav: "First" },
    { nav: "Second" },
  ]);
});
