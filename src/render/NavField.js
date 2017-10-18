import React from "react";

const REQUIRED_FIELD_SYMBOL = "*";
const COMPONENT_TYPES = {
  array: "ArrayField",
  boolean: "BooleanField",
  integer: "NumberField",
  number: "NumberField",
  object: "ObjectField",
  string: "StringField",
};

function Label(props) {
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

function getFieldComponent(schema, uiSchema, fields) {
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

const navField = NavComponent => props => {
  let {
    schema: { type, title },
    uiSchema: { navConfs, origUiSchema },
    registry: { fields },
    required,
    name,
  } = props;
  let FieldUI = getFieldComponent(props.schema, origUiSchema, fields);
  let fieldConf = Object.assign({}, props, { uiSchema: origUiSchema });

  const label = origUiSchema["ui:title"] || title || name;
  let { ["ui:options"]: { label: displayLabel = true } = {} } = origUiSchema;
  if (type === "object") {
    displayLabel = false;
  }
  if (type === "boolean" && !origUiSchema["ui:widget"]) {
    displayLabel = false;
  }

  return (
    <div>
      {navConfs.map((navConf, i) => (
        <div className="col-md-12" key={i}>
          <NavComponent {...navConf} />
          <br />
        </div>
      ))}
      <div className={origUiSchema.classNames}>
        {displayLabel && (
          <Label label={label} required={required} id={props.idSchema["$id"]} />
        )}
        <FieldUI {...fieldConf} />
      </div>
    </div>
  );
};

export default navField;
