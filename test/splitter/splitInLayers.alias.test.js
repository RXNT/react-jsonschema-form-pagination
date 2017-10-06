import { withNav } from "../utils";
import splitter from "../../src/splitter";

let schema = {
  properties: {
    firstName: { type: "string" },
    age: { type: "string" },
    phone: { type: "string" },
    lastName: { type: "string" },
    nickName: { type: "string" },
    other: { type: "string" },
  },
};

let uiSchema = {
  firstName: withNav("first"),
  phone: withNav(["first", "phone"]),
  ageAlias: withNav(["first", "other"]),
  phoneAlias: withNav(["first", "other"]),
  nickNameAlias: withNav(["first", "other"]),
  age: withNav("last"),
  nickName: withNav("last"),
  lastName: withNav("last"),
  other: withNav("nick"),
  navConf: {
    aliases: {
      nickName: "nickNameAlias",
      age: "ageAlias",
      phone: "phoneAlias",
    },
  },
};

test("return subforms", () => {
  let layers = splitter(schema, uiSchema);

  let activeNavs = [];
  layers.updateActiveNav(activeNavs);
  // expect(activeTabs).toEqual([ "first", "other" ]);

  let subForms = layers.toSubForms(activeNavs);
  expect(subForms[0]).toEqual({
    navs: {
      links: [],
    },
  });
});
