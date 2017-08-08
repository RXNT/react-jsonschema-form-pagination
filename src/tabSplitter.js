import { divideInLayers } from "./utils";

const tabSplitter = (schema, uiSchema, tabData) => {
  divideInLayers(schema, uiSchema, tabData);
};

export default tabSplitter;
