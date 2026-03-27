import { TextField } from "@mui/material";

export default function EmailField({
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
    <TextField
      type="email"
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