import extractSubNavs, { orderNavs } from "../../src/splitter/extractSubNavs";

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

test("no ordering", () => {
  let navs = [{ nav: "Second" }, { nav: "First" }];
  expect(orderNavs(navs, {})).toEqual([{ nav: "Second" }, { nav: "First" }]);
});

test("unrelated ordering", () => {
  let navs = [{ nav: "Second" }, { nav: "First" }];
  expect(orderNavs(navs, { navConf: { order: ["Last"] } })).toEqual([
    { nav: "Second" },
    { nav: "First" },
  ]);
});

test("create default configs", () => {
  let tree = { 1: {}, 2: {} };
  let uiSchema = {
    navConf: { navs: [{ nav: "1", name: "Some" }] },
  };
  let navs = extractSubNavs(tree, uiSchema, "1");
  let expectedNavs = {
    navs: {
      activeNav: "1",
      links: [
        { isActive: true, name: "Some", nav: "1" },
        { isActive: false, nav: "2" },
      ],
    },
  };
  expect(JSON.parse(JSON.stringify(navs))).toEqual(expectedNavs);
});
