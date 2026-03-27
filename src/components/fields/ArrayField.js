import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Stack,
  Divider,
  Collapse,
  FormHelperText,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Chip,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import { v4 as uuidv4 } from "uuid";
import TextareaField from "./TextareaField";

export default function ArrayField({
  fieldKey,
  config,
  value = [],
  error,
  onChange,
  disabled,
  expanded,
  onToggleExpand,
}) {
  const [inputValue, setInputValue] = useState("");
  const label = config.label || fieldKey;
  const isExpanded = expanded || false;
  const itemFields = config.fields || {};

  // Simple array (no nested fields)
  const isSimpleArray = Object.keys(itemFields).length === 0;

  const handleAddSimpleItem = () => {
    if (!inputValue.trim()) return;

    const newItem = inputValue.trim();
    onChange([...value, newItem]);
    setInputValue("");
  };

  const handleAddComplexItem = () => {
    const newItem = {};

    Object.entries(itemFields).forEach(([fieldKey, fieldConfig]) => {
      if (fieldConfig.default !== undefined) {
        newItem[fieldKey] = fieldConfig.default;
      } else if (fieldConfig.type === "checkbox") {
        newItem[fieldKey] = false;
      } else {
        newItem[fieldKey] = "";
      }
    });

    newItem._id = uuidv4();

    onChange([...value, newItem]);
    if (onToggleExpand) onToggleExpand(true);
  };

  const handleRemoveItem = (index) => {
    const newArray = [...value];
    newArray.splice(index, 1);
    onChange(newArray);
  };

  const handleItemChange = (index, fieldKey, fieldValue) => {
    const newArray = [...value];
    newArray[index] = {
      ...newArray[index],
      [fieldKey]: fieldValue,
    };
    onChange(newArray);
  };

  const renderNestedField = (item, index, fieldKey, fieldConfig) => {
    const fieldValue = item[fieldKey] ?? fieldConfig.default ?? "";
    const fieldLabel = fieldConfig.label || fieldKey;

    if (fieldConfig.type === "textarea") {
      return (
        <TextareaField
          key={fieldKey}
          fieldKey={fieldKey}
          config={fieldConfig}
          value={fieldValue}
          onChange={(newValue) => handleItemChange(index, fieldKey, newValue)}
          disabled={disabled}
        />
      );
    }

    if (fieldConfig.type === "select") {
      return (
        <TextField
          key={fieldKey}
          select
          label={fieldLabel}
          fullWidth
          size="small"
          value={fieldValue}
          onChange={(e) => handleItemChange(index, fieldKey, e.target.value)}
          disabled={disabled}
        >
          {fieldConfig.options?.map((opt) => (
            <MenuItem key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    if (fieldConfig.type === "checkbox") {
      return (
        <FormControlLabel
          key={fieldKey}
          control={
            <Checkbox
              size="small"
              checked={fieldValue === true}
              onChange={(e) =>
                handleItemChange(index, fieldKey, e.target.checked)
              }
              disabled={disabled}
            />
          }
          label={fieldLabel}
        />
      );
    }

    if (fieldConfig.type === "date") {
      return (
        <TextField
          key={fieldKey}
          type="date"
          label={fieldLabel}
          fullWidth
          size="small"
          InputLabelProps={{ shrink: true }}
          value={fieldValue}
          onChange={(e) => handleItemChange(index, fieldKey, e.target.value)}
          disabled={disabled}
        />
      );
    }

    return (
      <TextField
        key={fieldKey}
        label={fieldLabel}
        fullWidth
        size="small"
        value={fieldValue}
        onChange={(e) => handleItemChange(index, fieldKey, e.target.value)}
        disabled={disabled}
        placeholder={fieldConfig.placeholder}
        type={fieldConfig.type === "number" ? "number" : "text"}
        inputProps={
          fieldConfig.type === "number"
            ? {
                min: fieldConfig.min,
                max: fieldConfig.max,
                step: fieldConfig.step,
              }
            : {}
        }
      />
    );
  };

  // Render simple array (chips with input)
  if (isSimpleArray) {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          {label}{" "}
          {config.required && <span style={{ color: "#d32f2f" }}>*</span>}
        </Typography>

        {config.helperText && (
          <FormHelperText sx={{ mb: 2 }}>{config.helperText}</FormHelperText>
        )}

        {/* Input field for adding new items */}
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={config.placeholder || `Enter a ${label.toLowerCase()}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputValue.trim()) {
                e.preventDefault();
                handleAddSimpleItem();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleAddSimpleItem}
            disabled={disabled || !inputValue.trim()}
          >
            Add
          </Button>
        </Box>

        {error && (
          <FormHelperText error sx={{ mb: 1 }}>
            {error}
          </FormHelperText>
        )}

        {/* Display added items as chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {value.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              No items added yet
            </Typography>
          ) : (
            value.map((item, index) => (
              <Chip
                key={index}
                label={item}
                onDelete={() => handleRemoveItem(index)}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))
          )}
        </Box>
      </Box>
    );
  }

  // Render complex array (cards with nested fields)
  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          {label}{" "}
          {config.required && <span style={{ color: "#d32f2f" }}>*</span>}
        </Typography>
        <Box>
          {value.length > 0 && (
            <IconButton
              size="small"
              onClick={() => onToggleExpand?.(!isExpanded)}
              sx={{ mr: 1 }}
            >
              {isExpanded ? (
                <ExpandLessRoundedIcon />
              ) : (
                <ExpandMoreRoundedIcon />
              )}
            </IconButton>
          )}
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddRoundedIcon />}
            onClick={handleAddComplexItem}
            disabled={disabled}
          >
            Add
          </Button>
        </Box>
      </Box>

      {error && (
        <FormHelperText error sx={{ mb: 1 }}>
          {error}
        </FormHelperText>
      )}

      {config.helperText && (
        <FormHelperText sx={{ mb: 2 }}>{config.helperText}</FormHelperText>
      )}

      <Collapse in={isExpanded || value.length === 0}>
        <Stack spacing={2}>
          {value.length === 0 ? (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: "action.hover",
                borderStyle: "dashed",
              }}
            >
              <Typography color="text.secondary">
                No items added yet. Click "Add" to create a new{" "}
                {label.toLowerCase()} item.
              </Typography>
            </Paper>
          ) : (
            value.map((item, index) => (
              <Paper
                key={item._id || index}
                variant="outlined"
                sx={{ p: 2, position: "relative" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" color="primary">
                    {label} #{index + 1}
                  </Typography>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemoveItem(index)}
                    disabled={disabled}
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={2}>
                  {Object.entries(itemFields).map(([nestedKey, nestedConfig]) =>
                    renderNestedField(item, index, nestedKey, nestedConfig),
                  )}
                </Stack>
              </Paper>
            ))
          )}
        </Stack>
      </Collapse>
    </Box>
  );
}