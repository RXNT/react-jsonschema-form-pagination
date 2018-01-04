import { orderFields } from "../../src/splitter/extractTree";
import { GENERIC_NAV } from "../../src/utils";

test("extract based on partial match", () => {
  let tree = {
    generic: {
      [GENERIC_NAV]: {
        fields: ["lastName", "firstName"],
      },
    },
    specific: {
      [GENERIC_NAV]: {
        fields: ["nickName", "age", "telephone"],
      },
    },
  };

  let order = ["firstName", "nickName", "telephone", "age", "lastName"];

  let expectedTree = {
    generic: {
      [GENERIC_NAV]: {
        fields: ["firstName", "lastName"],
      },
    },
    specific: {
      [GENERIC_NAV]: {
        fields: ["nickName", "telephone", "age"],
      },
    },
  };

  orderFields(tree, order);
  expect(tree).toEqual(expectedTree);
});
