import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Paper,
  Stack,
  Checkbox,
  FormControlLabel,
  Divider,
  useMediaQuery,
  useTheme,
  Collapse,
  alpha,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import yaml from "js-yaml";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const FIELD_TYPES = ["text", "textarea", "checkbox", "array"];

const typeColors = {
  text: "#1976d2",
  textarea: "#0288d1",
  checkbox: "#388e3c",
  array: "#d81b60",
};

export default function FormSchemaBuilder({
  onGenerate,
  onSave,
  onCancel,
  fields,
  setFields,
  name,
  setName,
  description,
  setDescription,
  expandedArrays,
  setExpandedArrays,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Field CRUD
  const addField = () => {
    setFields((prev) => [
      ...prev,
      {
        id: `f_${uuidv4().slice(0, 8)}`,
        type: "text",
        label: "",
        required: false,
        placeholder: "",
        fields: [],
      },
    ]);
  };

  const updateField = (idx, updates) => {
    setFields((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, ...updates } : f)),
    );
  };

  const removeField = (idx) => {
    setFields((prev) => prev.filter((_, i) => i !== idx));
  };

  // Sub-field CRUD
  const addSubField = (parentIdx) => {
    setFields((prev) =>
      prev.map((f, i) =>
        i === parentIdx
          ? {
              ...f,
              fields: [
                ...f.fields,
                {
                  id: `s_${uuidv4().slice(0, 8)}`,
                  type: "text",
                  label: "",
                  required: false,
                  placeholder: "",
                },
              ],
            }
          : f,
      ),
    );
  };

  const updateSubField = (parentIdx, subIdx, updates) => {
    setFields((prev) =>
      prev.map((f, i) =>
        i === parentIdx
          ? {
              ...f,
              fields: f.fields.map((s, j) =>
                j === subIdx ? { ...s, ...updates } : s,
              ),
            }
          : f,
      ),
    );
  };

  const removeSubField = (parentIdx, subIdx) => {
    setFields((prev) =>
      prev.map((f, i) =>
        i === parentIdx
          ? { ...f, fields: f.fields.filter((_, j) => j !== subIdx) }
          : f,
      ),
    );
  };

  const toggleArrayExpand = (idx) => {
    setExpandedArrays((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const generateYAML = () => {
    const schema = {
      name: name.trim() || "Form",
      description: description.trim() || undefined,
      fields: {},
    };

    fields.forEach((f) => {
      if (!f.id?.trim()) return;
      const key = f.id.trim();

      if (f.type === "array") {
        schema.fields[key] = {
          type: "array",
          label: f.label.trim() || "Items",
          required: f.required,
          default: [],
          fields: {},
        };
        f.fields.forEach((sub) => {
          if (sub.id?.trim()) {
            schema.fields[key].fields[sub.id.trim()] = {
              type: sub.type,
              label: sub.label.trim() || sub.type,
              required: sub.required,
              ...(sub.placeholder?.trim() && {
                placeholder: sub.placeholder.trim(),
              }),
            };
          }
        });
      } else {
        schema.fields[key] = {
          type: f.type,
          label: f.label.trim() || f.type,
          required: f.required,
          ...(f.placeholder?.trim() && { placeholder: f.placeholder.trim() }),
        };
      }
    });

    return yaml.dump(schema, { indent: 2 });
  };

  const handleGenerate = () => onGenerate?.(generateYAML());

  return (
    <Box
      sx={{
        // On mobile, add bottom padding so the sticky bar never hides content
        pb: isMobile ? "80px" : 0,
      }}
    >
      <Stack spacing={isMobile ? 2 : 3}>
        {/* ── Schema meta ───────────────────────────────────── */}
        <Paper
          elevation={0}
          sx={{
            p: isMobile ? 2 : 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Schema Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Customer Survey"
            />
            <TextField
              fullWidth
              label="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              minRows={2}
            />
          </Stack>
        </Paper>

        <Divider />

        {/* ── Fields header (desktop only) ──────────────────── */}
        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Fields ({fields.length})
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addField}
            >
              Add Field
            </Button>
          </Box>
        )}

        {/* ── Field cards ───────────────────────────────────── */}
        <Stack spacing={isMobile ? 2 : 2.5}>
          {fields.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
              {isMobile ? 'Tap "Add" below' : 'Click "Add Field"'} to start
              building
            </Typography>
          ) : (
            fields.map((field, idx) => {
              const isArray = field.type === "array";
              const color = typeColors[field.type] || "#757575";
              const expanded = expandedArrays[idx] ?? true;

              return (
                <Paper
                  key={field.id}
                  elevation={1}
                  sx={{
                    borderRadius: 2,
                    borderTop: `4px solid ${color}`,
                    overflow: "hidden",
                  }}
                >
                  {/* ── Field body ── */}
                  <Box sx={{ p: isMobile ? 2 : 2.5 }}>
                    {/* Card header row */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: color,
                            flexShrink: 0,
                          }}
                        />
                        <Typography variant="subtitle1" fontWeight={600}>
                          {isArray ? "Array" : `Field ${idx + 1}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({field.type})
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeField(idx)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>

                    <Stack spacing={2}>
                      {/* Key (read-only) */}
                      <TextField
                        fullWidth
                        label="Field Key / ID"
                        disabled
                        value={field.id}
                        size="small"
                        helperText="Used in YAML output"
                      />

                      {/* Label */}
                      <TextField
                        fullWidth
                        label="Display Label"
                        value={field.label}
                        onChange={(e) =>
                          updateField(idx, { label: e.target.value })
                        }
                        size="small"
                      />

                      {/* Type + Required — always a row */}
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Select
                          value={field.type}
                          onChange={(e) =>
                            updateField(idx, { type: e.target.value })
                          }
                          size="small"
                          IconComponent={ArrowDropDownIcon}
                          sx={{
                            minWidth: 130,
                            "& .MuiSelect-select": { color, fontWeight: 500 },
                          }}
                        >
                          {FIELD_TYPES.map((t) => (
                            <MenuItem
                              key={t}
                              value={t}
                              sx={{ color: typeColors[t] || "inherit" }}
                            >
                              {t}
                            </MenuItem>
                          ))}
                        </Select>

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={field.required}
                              onChange={(e) =>
                                updateField(idx, { required: e.target.checked })
                              }
                              size="small"
                              sx={{ color, "&.Mui-checked": { color } }}
                            />
                          }
                          label="Required"
                          sx={{ m: 0 }}
                        />
                      </Stack>

                      {/* Placeholder — full width on its own row */}
                      {field.type !== "checkbox" && field.type !== "array" && (
                        <TextField
                          fullWidth
                          label="Placeholder"
                          value={field.placeholder}
                          onChange={(e) =>
                            updateField(idx, { placeholder: e.target.value })
                          }
                          size="small"
                        />
                      )}
                    </Stack>
                  </Box>

                  {/* ── Sub-fields (array only) ── */}
                  {isArray && (
                    <>
                      {/* Collapse toggle */}
                      <Box
                        sx={{
                          px: isMobile ? 2 : 2.5,
                          py: 1,
                          bgcolor: alpha("#000", 0.03),
                          borderTop: "1px solid",
                          borderColor: "divider",
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                        onClick={() => toggleArrayExpand(idx)}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="subtitle2" color="text.secondary">
                            Sub-fields ({field.fields.length})
                          </Typography>
                          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </Stack>
                      </Box>

                      <Collapse in={expanded}>
                        <Box sx={{ p: isMobile ? 2 : 2.5, pt: 1.5 }}>
                          <Stack spacing={isMobile ? 2 : 2}>
                            {field.fields.length === 0 && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontStyle: "italic" }}
                              >
                                No sub-fields yet.
                              </Typography>
                            )}

                            {field.fields.map((sub, sIdx) => (
                              <Paper
                                key={sub.id}
                                variant="outlined"
                                sx={{
                                  p: isMobile ? 1.5 : 2,
                                  borderRadius: 1.5,
                                }}
                              >
                                {/* Sub-field header */}
                                <Stack
                                  direction="row"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  mb={1.5}
                                >
                                  <Typography
                                    variant="caption"
                                    fontWeight={600}
                                    color="text.secondary"
                                  >
                                    Sub-field {sIdx + 1}
                                  </Typography>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => removeSubField(idx, sIdx)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Stack>

                                <Stack spacing={1.5}>
                                  {/* Sub key */}
                                  <TextField
                                    fullWidth
                                    label="Key"
                                    value={sub.id}
                                    onChange={(e) =>
                                      updateSubField(idx, sIdx, {
                                        id: e.target.value,
                                      })
                                    }
                                    size="small"
                                  />

                                  {/* Sub label */}
                                  <TextField
                                    fullWidth
                                    label="Label"
                                    value={sub.label}
                                    onChange={(e) =>
                                      updateSubField(idx, sIdx, {
                                        label: e.target.value,
                                      })
                                    }
                                    size="small"
                                  />

                                  {/* Sub type + required — row */}
                                  <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                  >
                                    <Select
                                      value={sub.type}
                                      onChange={(e) =>
                                        updateSubField(idx, sIdx, {
                                          type: e.target.value,
                                        })
                                      }
                                      size="small"
                                      sx={{ minWidth: 120 }}
                                    >
                                      {FIELD_TYPES.filter(
                                        (t) => t !== "array",
                                      ).map((t) => (
                                        <MenuItem key={t} value={t}>
                                          {t}
                                        </MenuItem>
                                      ))}
                                    </Select>

                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={sub.required}
                                          onChange={(e) =>
                                            updateSubField(idx, sIdx, {
                                              required: e.target.checked,
                                            })
                                          }
                                          size="small"
                                        />
                                      }
                                      label="Required"
                                      sx={{ m: 0 }}
                                    />
                                  </Stack>

                                  {/* Sub placeholder — full width own row */}
                                  {sub.type !== "checkbox" && (
                                    <TextField
                                      fullWidth
                                      label="Placeholder"
                                      value={sub.placeholder || ""}
                                      onChange={(e) =>
                                        updateSubField(idx, sIdx, {
                                          placeholder: e.target.value,
                                        })
                                      }
                                      size="small"
                                    />
                                  )}
                                </Stack>
                              </Paper>
                            ))}

                            <Button
                              size="small"
                              startIcon={<AddIcon fontSize="small" />}
                              onClick={() => addSubField(idx)}
                              sx={{ alignSelf: "flex-start" }}
                            >
                              Add sub-field
                            </Button>
                          </Stack>
                        </Box>
                      </Collapse>
                    </>
                  )}
                </Paper>
              );
            })
          )}
        </Stack>
      </Stack>

      {/* ── Desktop generate button ───────────────────────── */}
      {!isMobile && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            disabled={fields.length === 0}
            onClick={handleGenerate}
            sx={{ minWidth: 220, py: 1.5 }}
          >
            Generate YAML Schema
          </Button>
        </Box>
      )}

      {/* ── Mobile sticky bottom bar ──────────────────────── */}
      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "background.paper",
            borderTop: "1px solid",
            borderColor: "divider",
            p: 2,
            display: "flex",
            gap: 1,
            boxShadow: "0 -2px 10px rgba(0,0,0,0.08)",
            zIndex: 1200,
          }}
        >
          {/* Cancel — only shown when integrated into SchemaTemplateEditorPage */}
          {onCancel && (
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              onClick={onCancel}
              sx={{ flexShrink: 1 }}
            >
              Cancel
            </Button>
          )}

          <Button
            fullWidth
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addField}
            sx={{ flexShrink: 1 }}
          >
            Add
          </Button>

          <Button
            fullWidth
            variant="contained"
            onClick={handleGenerate}
            disabled={fields.length === 0}
            sx={{ flexShrink: 1 }}
          >
            Generate
          </Button>

          {/* Save — only shown when integrated into SchemaTemplateEditorPage */}
          {onSave && (
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={onSave}
              sx={{ flexShrink: 1 }}
            >
              Save
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}