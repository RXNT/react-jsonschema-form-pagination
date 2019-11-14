import { extractTree } from "../../src/splitter/extractTree";
import extractSubUiSchema from "../../src/splitter/extractSubUiSchema";
import { toHiddenUiSchema } from "../../src/splitter/util";
import { GENERIC_NAV } from "../../src/utils";

const schema = {
  type: "object",
  title: "Encounter",
  required: [],
  properties: {
    nested: {
      type: "object",
      properties: {
        general: {
          type: "object",
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
          },
        },
        age: { type: "integer" },
        nickName: { type: "string" },
        bio: { type: "string" },
        password: { type: "string" },
        telephone: { type: "string" },
      },
    },
  },
};

const uiSchema = {
  nested: {
    general: {
      firstName: {
        nav: ["General", "name"],
      },
      lastName: {
        nav: ["General", "name"],
      },
    },
    age: {
      nav: ["General", "additional"],
    },
    nickName: {
      nav: ["General", "name"],
    },
    bio: {
      nav: ["General", "additional"],
    },
    password: {
      nav: ["General", "additional"],
    },
    telephone: {
      nav: ["General", "additional"],
    },
  },
  // navConf: {
  //     aliases: {
  //         firstName: "firstNameAlias",
  //     },
  //     navs: [
  //         { nav: "0", name: "First" },
  //         { nav: "1", name: "Second" },
  //         { nav: "2", name: "Third" },
  //     ],
  // },
};

test("Handling more complex nested object structure", () => {
  const tree = extractTree(schema, uiSchema);

  expect(tree["General"]["name"][GENERIC_NAV].fields).toBeDefined();
  expect(tree["General"]["name"][GENERIC_NAV].fields[0]).toEqual(
    "nested.general.firstName"
  );
  const hiddenUiSchema = toHiddenUiSchema(schema, uiSchema);
  expect("nested" in hiddenUiSchema).toEqual(true);
  expect("general" in hiddenUiSchema.nested).toEqual(true);
  expect("firstName" in hiddenUiSchema.nested.general).toEqual(true);

  const result = extractSubUiSchema(
    tree["General"]["additional"].default.fields,
    {},
    uiSchema,
    hiddenUiSchema,
    schema
  );

  expect(result.nested.general.firstName).toBeDefined();
});
