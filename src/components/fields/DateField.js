import { TextField } from "@mui/material";

export default function DateField({
  fieldKey,
  config,
  value = "",
  error,
  onChange,
  disabled,
}) {
  const label = config.label || fieldKey;

  return (
    <TextField
      type="date"
      label={label}
      fullWidth
      InputLabelProps={{ shrink: true }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error}
      disabled={disabled}
    />
  );
}