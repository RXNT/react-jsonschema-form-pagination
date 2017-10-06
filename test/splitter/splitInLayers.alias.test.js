import { withNav } from "../utils";
import splitter from "../../src/splitter";

let schema = {
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
  },
};

let uiSchema = {
  firstName: withNav("first"),
  lastName: withNav(["last"]),
  firstNameAlias: withNav(["last"]),
  navConf: {
    aliases: {
      firstName: "firstNameAlias",
    },
  },
};

test("return subforms", () => {
  let layers = splitter(schema, uiSchema);

  let activeNavs = [];
  layers.updateActiveNav(activeNavs);
  // expect(activeTabs).toEqual([ "first", "other" ]);

  let subForms = layers.toSubForms(["last"]);
  expect(subForms[0]).toEqual({
    navs: {
      activeNav: "last",
      links: [
        { isActive: false, nav: "first" },
        { isActive: true, nav: "last" },
      ],
    },
    schema: {
      type: "object",
      properties: {
        firstName: { type: "string" },
        lastName: { type: "string" },
      },
    },
    uiSchema: {
      firstName: withNav("last"),
      lastName: withNav("last"),
    },
  });
});
