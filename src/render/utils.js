import React from "react";

const COMPONENT_TYPES = {
  array: "ArrayField",
  boolean: "BooleanField",
  integer: "NumberField",
  number: "NumberField",
  object: "ObjectField",
  string: "StringField",
};

export function getFieldComponent(schema, uiSchema, fields) {
  const field = uiSchema["ui:field"];
  if (typeof field === "function") {
    return field;
  }
  if (typeof field === "string" && field in fields) {
    return fields[field];
  }
  const componentName = COMPONENT_TYPES[schema.type];
  return componentName in fields
    ? fields[componentName]
    : () => <h1>Unknown field type {schema.type}</h1>;
}

const REQUIRED_FIELD_SYMBOL = "*";

function DefaultLabel(props) {
  const { label, required, id } = props;
  if (!label) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  return (
    <label className="control-label" htmlFor={id}>
      {required ? label + REQUIRED_FIELD_SYMBOL : label}
    </label>
  );
}

export function Label({
  schema: { type, title },
  uiSchema,
  name,
  required,
  idSchema,
}) {
  const label = uiSchema["ui:title"] || title || name;
  let { ["ui:options"]: { label: displayLabel = true } = {} } = uiSchema;
  if (type === "object") {
    displayLabel = false;
  }
  if (type === "boolean" && !uiSchema["ui:widget"]) {
    displayLabel = false;
  }

  if (displayLabel) {
    return (
      <DefaultLabel label={label} required={required} id={idSchema["$id"]} />
    );
  } else {
    return null;
  }
}
