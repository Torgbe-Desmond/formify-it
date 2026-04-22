import { Box, FormHelperText, Typography, Stack } from "@mui/material";
import yaml from "js-yaml";

import ArrayField    from "./ArrayField";
import TextField     from "./TextField";
import TextareaField from "./TextareaField";
import SelectField   from "./SelectField";
import DateField     from "./DateField";
import CheckboxField from "./CheckboxField";
import NumberField   from "./NumberField";
import EmailField    from "./EmailField";
import UrlField      from "./UrlField";

export default function FieldRenderer({
  fieldKey,
  config,
  value,
  error,
  onChange,
  disabled,
  expandedArrays,
  onToggleArrayExpand,
  schemasMap = {},    // NEW: full schemas map
  parsedCache = {},   // NEW: mutable YAML parse cache ref
}) {
  const handleChange = (key, newValue) => {
    onChange({ ...value, [key]: newValue });
  };

  const fieldValue = value?.[fieldKey] ?? config.default ?? "";

  const fieldProps = {
    fieldKey,
    config,
    value:    fieldValue,
    error:    error?.[fieldKey],
    onChange: (newValue) => handleChange(fieldKey, newValue),
    disabled,
  };

  // ── $SchemaRef embed — render sub-fields inline ───────────────
  if (config.type?.startsWith("$")) {
    const refName     = config.type.replace(/^\$/, "");
    const rawSchema   = schemasMap?.[refName];
    let   nestedFields = null;

    if (rawSchema?.schemaYaml) {
      const cache = parsedCache?.current ?? parsedCache;
      if (!cache[refName]) {
        try {
          const parsed = yaml.load(rawSchema.schemaYaml);
          cache[refName] = parsed?.fields || {};
        } catch { cache[refName] = {}; }
      }
      nestedFields = cache[refName];
    }

    const nestedValue = (typeof fieldValue === "object" && fieldValue !== null) ? fieldValue : {};

    return (
      <Box sx={{ pl: 1.5, borderLeft: "3px solid", borderColor: "primary.light", mb: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
          {config.label || fieldKey} <span style={{ opacity: 0.5, fontFamily: "monospace" }}>({config.type})</span>
        </Typography>
        {nestedFields ? (
          <Stack spacing={2}>
            {Object.entries(nestedFields).map(([nKey, nCfg]) => (
              <FieldRenderer
                key={nKey}
                fieldKey={nKey}
                config={nCfg}
                value={nestedValue}
                error={error?.[fieldKey]}
                onChange={(updated) => handleChange(fieldKey, updated)}
                disabled={disabled}
                expandedArrays={expandedArrays}
                onToggleArrayExpand={onToggleArrayExpand}
                schemasMap={schemasMap}
                parsedCache={parsedCache}
              />
            ))}
          </Stack>
        ) : (
          <Typography variant="caption" color="text.disabled">
            Schema "{refName}" not found in this folder.
          </Typography>
        )}
      </Box>
    );
  }

  const renderField = () => {
    switch (config.type) {
      case "array":
        return (
          <ArrayField
            {...fieldProps}
            value={value?.[fieldKey] || []}
            expanded={expandedArrays?.[fieldKey]}
            onToggleExpand={(expanded) => onToggleArrayExpand?.(fieldKey, expanded)}
            schemasMap={schemasMap}
            parsedCache={parsedCache?.current ?? parsedCache}
          />
        );

      case "textarea":
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
