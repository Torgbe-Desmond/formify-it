import { TextField as MuiTextField } from "@mui/material";

export default function TextField({
  fieldKey,
  config,
  value = "",
  error,
  onChange,
  disabled,
}) {
  const label = config.label || fieldKey;
  const placeholder = config.placeholder || `Enter ${label.toLowerCase()}`;

  return (
    <MuiTextField
      label={label}
      fullWidth
      required={config.required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}