import { toHiddenUiSchema } from "../../src/splitter/util";
import { withNav } from "../utils";

let schema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    nickName: { type: "string" },
  },
};

let uiSchema = {
  firstName: withNav("first"),
  lastName: withNav("last"),
  nickName: withNav("nick"),
  navConf: {
    order: ["first", "last", "nick"],
  },
};

test("toHiddenUiSchema hides all the schema fields", () => {
  const hiddenUiSchema = toHiddenUiSchema(schema, uiSchema);
  expect(hiddenUiSchema).toEqual({
    firstName: {
      "ui:widget": "hidden",
      "ui:field": "hidden",
    },
    lastName: {
      "ui:widget": "hidden",
      "ui:field": "hidden",
    },
    nickName: {
      "ui:widget": "hidden",
      "ui:field": "hidden",
    },
    navConf: {
      order: ["first", "last", "nick"],
    },
  });
});
