import { TextField, MenuItem } from "@mui/material";

export default function SelectField({
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
      select
      label={label}
      fullWidth
      required={config.required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error || config.helperText}
      disabled={disabled}
    >
      {config.options?.map((opt) => (
        <MenuItem key={opt.value || opt} value={opt.value || opt}>
          {opt.label || opt}
        </MenuItem>
      ))}
    </TextField>
  );
}