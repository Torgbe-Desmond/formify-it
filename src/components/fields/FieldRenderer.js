import { Box, FormHelperText } from "@mui/material";

import ArrayField from "./ArrayField";
import TextField from "./TextField";
import TextareaField from "./TextareaField";
import SelectField from "./SelectField";
import DateField from "./DateField";
import CheckboxField from "./CheckboxField";
import NumberField from "./NumberField";
import EmailField from "./EmailField";
import UrlField from "./UrlField";

export default function FieldRenderer({
  fieldKey,
  config,
  value,
  error,
  onChange,
  disabled,
  expandedArrays,
  onToggleArrayExpand,
}) {
  const handleChange = (key, newValue) => {
    const updated = { ...value, [key]: newValue };
    onChange(updated);
  };

  const fieldProps = {
    fieldKey,
    config,
    value: value?.[fieldKey] ?? config.default ?? "",
    error: error?.[fieldKey],
    onChange: (newValue) => handleChange(fieldKey, newValue),
    disabled,
  };

  const renderField = () => {
    switch (config.type) {
      case "array":
        return (
          <ArrayField
            {...fieldProps}
            value={value?.[fieldKey] || []}
            expanded={expandedArrays?.[fieldKey]}
            onToggleExpand={(expanded) =>
              onToggleArrayExpand?.(fieldKey, expanded)
            }
          />
        );

      case "textarea":
        console.log("textarea")
        return <TextareaField {...fieldProps} />;

      case "select":
        return <SelectField {...fieldProps} />;

      case "date":
        return <DateField {...fieldProps} />;

      case "checkbox":
        return <CheckboxField {...fieldProps} />;

      case "number":
        return <NumberField {...fieldProps} />;

      case "email":
        return <EmailField {...fieldProps} />;

      case "url":
        return <UrlField {...fieldProps} />;

      default:
        return <TextField {...fieldProps} />;
    }
  };

  return (
    <Box>
      {renderField()}
      {config.helperText && !error?.[fieldKey] && config.type !== "array" && (
        <FormHelperText>{config.helperText}</FormHelperText>
      )}
    </Box>
  );
}
