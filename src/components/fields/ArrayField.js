import { useState } from "react";
import {
  Box, Typography, Button, IconButton, Paper, Stack,
  Divider, Collapse, FormHelperText, TextField,
  MenuItem, Checkbox, FormControlLabel, Chip,
} from "@mui/material";
import AddRoundedIcon           from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ExpandMoreRoundedIcon    from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon    from "@mui/icons-material/ExpandLessRounded";
import { v4 as uuidv4 }        from "uuid";
import yaml                     from "js-yaml";
import TextareaField            from "./TextareaField";

const MAX_DEPTH = 8;

// ── Cache helpers ─────────────────────────────────────────────────
// parsedCache may arrive as a useRef object ({ current: {} })
// or as a plain object {} (when passed down through ItemFields).
// These helpers normalise both cases.

function getCache(parsedCache) {
  if (parsedCache && typeof parsedCache === "object" && "current" in parsedCache) {
    return parsedCache.current;
  }
  return parsedCache || {};
}

// ── Schema resolution ─────────────────────────────────────────────

function resolveFields(config, schemasMap, parsedCache, depth) {
  if (depth >= MAX_DEPTH) return null;

  // Inline sub-fields (legacy array with `fields` key)
  if (config.fields && Object.keys(config.fields).length > 0) {
    return config.fields;
  }

  // Schema reference via `items: "$Name"` or `type: "$Name"`
  const refRaw = config.items || config.type || "";
  if (!refRaw.startsWith("$") || !schemasMap) return null;
  const refName = refRaw.replace(/^\$/, "");

  const cache = getCache(parsedCache);

  if (!cache[refName]) {
    const raw = schemasMap[refName];
    if (!raw?.schemaYaml) return null;
    try {
      const parsed = yaml.load(raw.schemaYaml);
      cache[refName] = parsed?.fields || {};
    } catch {
      return null;
    }
  }

  return cache[refName] || null;
}

function buildEmptyItem(fieldsMap, schemasMap, parsedCache, depth = 0) {
  if (!fieldsMap || depth >= MAX_DEPTH) return {};
  const item = {};
  Object.entries(fieldsMap).forEach(([key, cfg]) => {
    if (cfg.type === "array") {
      item[key] = [];
    } else if (cfg.type?.startsWith("$") || cfg.items?.startsWith("$")) {
      const nested = resolveFields(cfg, schemasMap, parsedCache, depth + 1);
      item[key] = nested ? buildEmptyItem(nested, schemasMap, parsedCache, depth + 1) : {};
    } else if (cfg.default !== undefined) {
      item[key] = cfg.default;
    } else if (cfg.type === "checkbox") {
      item[key] = false;
    } else {
      item[key] = "";
    }
  });
  return item;
}

// ── Primitive field renderer ──────────────────────────────────────

function PrimitiveField({ fieldKey, fieldConfig, value, onChange, disabled }) {
  const label      = fieldConfig.label || fieldKey;
  const fieldValue = value ?? fieldConfig.default ?? "";

  if (fieldConfig.type === "textarea") {
    return (
      <TextareaField fieldKey={fieldKey} config={fieldConfig}
        value={fieldValue} onChange={onChange} disabled={disabled} />
    );
  }
  if (fieldConfig.type === "select") {
    return (
      <TextField select label={label} fullWidth size="small"
        value={fieldValue} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
        {fieldConfig.options?.map((opt) => (
          <MenuItem key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</MenuItem>
        ))}
      </TextField>
    );
  }
  if (fieldConfig.type === "checkbox") {
    return (
      <FormControlLabel
        control={<Checkbox size="small" checked={fieldValue === true}
          onChange={(e) => onChange(e.target.checked)} disabled={disabled} />}
        label={label} />
    );
  }
  if (fieldConfig.type === "date") {
    return (
      <TextField type="date" label={label} fullWidth size="small"
        InputLabelProps={{ shrink: true }} value={fieldValue}
        onChange={(e) => onChange(e.target.value)} disabled={disabled} />
    );
  }
  return (
    <TextField label={label} fullWidth size="small"
      value={fieldValue} onChange={(e) => onChange(e.target.value)} disabled={disabled}
      placeholder={fieldConfig.placeholder}
      type={fieldConfig.type === "number" ? "number" : "text"}
      inputProps={fieldConfig.type === "number"
        ? { min: fieldConfig.min, max: fieldConfig.max, step: fieldConfig.step }
        : {}} />
  );
}

// ── ItemFields — renders all fields of one item, recurses ─────────
// Has its own local expand state for any nested ArrayFields it contains,
// so nested "Add children" buttons always show their new items immediately.

function ItemFields({ fieldsMap, itemData, onItemChange, disabled, schemasMap, parsedCache, depth }) {
  // Local expand state for nested arrays inside this item
  const [nestedExpanded, setNestedExpanded] = useState({});

  if (!fieldsMap) return null;
  if (depth >= MAX_DEPTH) {
    return (
      <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
        Max nesting depth reached.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {Object.entries(fieldsMap).map(([key, cfg]) => {
        const val = itemData?.[key];

        // Nested array field
        if (cfg.type === "array") {
          return (
            <ArrayField
              key={key}
              fieldKey={key}
              config={cfg}
              value={Array.isArray(val) ? val : []}
              onChange={(newArr) => onItemChange(key, newArr)}
              disabled={disabled}
              schemasMap={schemasMap}
              parsedCache={parsedCache}
              depth={depth + 1}
              // Wire up local expand state so new items are immediately visible
              expanded={nestedExpanded[key] ?? true}
              onToggleExpand={(v) => setNestedExpanded((prev) => ({ ...prev, [key]: v }))}
            />
          );
        }

        // Embedded $SchemaRef — render fields inline
        if (cfg.type?.startsWith("$")) {
          const nestedFields = resolveFields(cfg, schemasMap, parsedCache, depth + 1);
          if (!nestedFields) return null;
          return (
            <Box key={key} sx={{ pl: 1.5, borderLeft: "3px solid", borderColor: "primary.light" }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                {cfg.label || key}{" "}
                <span style={{ opacity: 0.5, fontFamily: "monospace" }}>({cfg.type})</span>
              </Typography>
              <ItemFields
                fieldsMap={nestedFields}
                itemData={typeof val === "object" && val !== null ? val : {}}
                onItemChange={(nk, nv) => onItemChange(key, { ...(val || {}), [nk]: nv })}
                disabled={disabled}
                schemasMap={schemasMap}
                parsedCache={parsedCache}
                depth={depth + 1}
              />
            </Box>
          );
        }

        // Primitive field
        return (
          <PrimitiveField
            key={key}
            fieldKey={key}
            fieldConfig={cfg}
            value={val}
            onChange={(nv) => onItemChange(key, nv)}
            disabled={disabled}
          />
        );
      })}
    </Stack>
  );
}

// ── ArrayField ────────────────────────────────────────────────────

export default function ArrayField({
  fieldKey,
  config,
  value = [],
  error,
  onChange,
  disabled,
  expanded,
  onToggleExpand,
  schemasMap = {},
  parsedCache = {},
  depth = 0,
}) {
  const [inputValue,    setInputValue]    = useState("");
  // Own expand state as fallback when parent doesn't pass onToggleExpand
  const [localExpanded, setLocalExpanded] = useState(true);

  const label        = config.label || fieldKey;
  const isControlled = onToggleExpand !== undefined;
  const isExpanded   = isControlled ? (expanded ?? true) : localExpanded;

  const toggleExpand = (v) => {
    if (isControlled) onToggleExpand(v);
    else setLocalExpanded(v);
  };

  const resolvedFields = resolveFields(config, schemasMap, parsedCache, depth);
  const isSimpleArray  = !resolvedFields;

  const handleAddSimpleItem = () => {
    if (!inputValue.trim()) return;
    onChange([...value, inputValue.trim()]);
    setInputValue("");
  };

  const handleAddComplexItem = () => {
    const newItem = resolvedFields
      ? buildEmptyItem(resolvedFields, schemasMap, parsedCache, depth)
      : {};
    newItem._id = uuidv4();
    onChange([...value, newItem]);
    // Always expand so the new item is immediately visible
    toggleExpand(true);
  };

  const handleRemoveItem = (index) => {
    const next = [...value];
    next.splice(index, 1);
    onChange(next);
  };

  const handleItemFieldChange = (index, fk, fv) => {
    const next = [...value];
    next[index] = { ...next[index], [fk]: fv };
    onChange(next);
  };

  // ── Simple array (chips + text input) ────────────────────────
  if (isSimpleArray) {
    return (
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          {label} {config.required && <span style={{ color: "#d32f2f" }}>*</span>}
        </Typography>
        {config.helperText && <FormHelperText sx={{ mb: 2 }}>{config.helperText}</FormHelperText>}

        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField fullWidth size="small"
            placeholder={config.placeholder || `Enter a ${label.toLowerCase()}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={disabled}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputValue.trim()) {
                e.preventDefault();
                handleAddSimpleItem();
              }
            }} />
          <Button variant="contained" onClick={handleAddSimpleItem}
            disabled={disabled || !inputValue.trim()}>
            Add
          </Button>
        </Box>

        {error && <FormHelperText error sx={{ mb: 1 }}>{error}</FormHelperText>}

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {value.length === 0
            ? <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>No items added yet</Typography>
            : value.map((item, i) => (
                <Chip key={i} label={item} onDelete={() => handleRemoveItem(i)}
                  color="primary" variant="outlined" size="small" />
              ))}
        </Box>
      </Box>
    );
  }

  // ── Complex array (item cards) ────────────────────────────────
  const refLabel = (config.items || config.type || "").startsWith("$")
    ? (config.items || config.type)
    : null;

  return (
    <Box sx={{ mb: 1 }}>
      {/* Header row */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {label}{" "}
          {config.required && <span style={{ color: "#d32f2f" }}>*</span>}
          {refLabel && (
            <Typography component="span" variant="caption"
              sx={{ ml: 0.5, color: "text.disabled", fontFamily: "monospace" }}>
              ({refLabel})
            </Typography>
          )}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {value.length > 0 && (
            <IconButton size="small" onClick={() => toggleExpand(!isExpanded)}>
              {isExpanded ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
            </IconButton>
          )}
          <Button size="small" variant="outlined" startIcon={<AddRoundedIcon />}
            onClick={handleAddComplexItem} disabled={disabled}>
            Add
          </Button>
        </Box>
      </Box>

      {error && <FormHelperText error sx={{ mb: 1 }}>{error}</FormHelperText>}
      {config.helperText && <FormHelperText sx={{ mb: 2 }}>{config.helperText}</FormHelperText>}

      <Collapse in={isExpanded}>
        <Stack spacing={2}>
          {value.length === 0 ? (
            <Paper variant="outlined" sx={{ p: 3, textAlign: "center", bgcolor: "action.hover", borderStyle: "dashed" }}>
              <Typography color="text.secondary">
                No items yet. Click "Add" to create a new {label.toLowerCase()} item.
              </Typography>
            </Paper>
          ) : (
            value.map((item, index) => (
              <Paper key={item._id || index} variant="outlined" sx={{ p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="subtitle2" color="primary">
                    {label} #{index + 1}
                  </Typography>
                  <IconButton size="small" color="error"
                    onClick={() => handleRemoveItem(index)} disabled={disabled}>
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <ItemFields
                  fieldsMap={resolvedFields}
                  itemData={item}
                  onItemChange={(fk, fv) => handleItemFieldChange(index, fk, fv)}
                  disabled={disabled}
                  schemasMap={schemasMap}
                  parsedCache={parsedCache}
                  depth={depth + 1}
                />
              </Paper>
            ))
          )}
        </Stack>
      </Collapse>
    </Box>
  );
}
