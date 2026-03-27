import { FormControlLabel, Checkbox } from "@mui/material";

export default function CheckboxField({
  fieldKey,
  config,
  value = false,
  onChange,
  disabled,
}) {
  const label = config.label || fieldKey;

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={value === true}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      }
      label={label}
    />
  );
}
