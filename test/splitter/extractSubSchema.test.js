import extractSubSchema from "../../src/splitter/extractSubSchema";

test("extract layer from simple schema", () => {
  let schema = {
    required: ["firstName"],
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
    },
  };
  expect(extractSubSchema(["lastName"], schema)).toEqual({
    type: "object",
    required: [],
    properties: {
      lastName: { type: "string" },
    },
  });
  expect(extractSubSchema(["firstName"], schema)).toEqual({
    type: "object",
    required: ["firstName"],
    properties: {
      firstName: { type: "string" },
    },
  });
});

test("extract with proper required", () => {
  let schema = {
    required: ["firstName", "lastName"],
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
    },
  };
  expect(extractSubSchema(["firstName"], schema)).toEqual({
    type: "object",
    required: ["firstName"],
    properties: {
      firstName: { type: "string" },
    },
  });
});
