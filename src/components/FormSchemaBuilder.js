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
    Chip,
    Tooltip,
} from "@mui/material";
import {v4 as uuidv4} from "uuid";
import yaml from "js-yaml";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LinkIcon from "@mui/icons-material/Link";

// Primitive types always available
const PRIMITIVE_TYPES = ["text", "textarea", "checkbox", "number", "select", "date", "url", "email", "array"];

const primitiveColors = {
    text: "#1976d2",
    textarea: "#0288d1",
    checkbox: "#388e3c",
    number: "#f57c00",
    select: "#7b1fa2",
    date: "#0097a7",
    url: "#5d4037",
    email: "#c62828",
    array: "#d81b60",
};

const refColor = "#546e7a";

/**
 * FormSchemaBuilder
 *
 * New prop: `otherSchemas` — array of schema names defined in the same folder
 * (excluding the current one). These are offered as `$SchemaName` type options.
 */
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
                                              otherSchemas = [],   // NEW: names of sibling schemas in the same folder
                                          }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // All available types = primitives + $SchemaName refs
    // const allTypes = [
    //     ...PRIMITIVE_TYPES,
    //     ...otherSchemas.map((s) => `$${s}`),
    // ];

    const getTypeColor = (t) => {
        if (t.startsWith("$")) return refColor;
        return primitiveColors[t] || "#757575";
    };

    // ── Field CRUD ────────────────────────────────────────────────
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
                // For array fields referencing a schema: items: "$SchemaName"
                items: "",
            },
        ]);
    };

    const updateField = (idx, updates) => {
        setFields((prev) =>
            prev.map((f, i) => (i === idx ? {...f, ...updates} : f))
        );
    };

    const removeField = (idx) => {
        setFields((prev) => prev.filter((_, i) => i !== idx));
    };

    // ── Sub-field CRUD (only for primitive arrays) ────────────────
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
                    : f
            )
        );
    };

    const updateSubField = (parentIdx, subIdx, updates) => {
        setFields((prev) =>
            prev.map((f, i) =>
                i === parentIdx
                    ? {
                        ...f,
                        fields: f.fields.map((s, j) =>
                            j === subIdx ? {...s, ...updates} : s
                        ),
                    }
                    : f
            )
        );
    };

    const removeSubField = (parentIdx, subIdx) => {
        setFields((prev) =>
            prev.map((f, i) =>
                i === parentIdx
                    ? {...f, fields: f.fields.filter((_, j) => j !== subIdx)}
                    : f
            )
        );
    };

    const toggleArrayExpand = (idx) => {
        setExpandedArrays((prev) => ({...prev, [idx]: !prev[idx]}));
    };

    // ── YAML generation ───────────────────────────────────────────
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
                const arrayDef = {
                    type: "array",
                    label: f.label.trim() || "Items",
                    required: f.required,
                    default: [],
                };

                if (f.items && f.items.startsWith("$")) {
                    // Schema reference array — use `items` key
                    arrayDef.items = f.items;
                } else {
                    // Primitive sub-fields
                    arrayDef.fields = {};
                    f.fields.forEach((sub) => {
                        if (sub.id?.trim()) {
                            arrayDef.fields[sub.id.trim()] = {
                                type: sub.type,
                                label: sub.label.trim() || sub.type,
                                required: sub.required,
                                ...(sub.placeholder?.trim() && {placeholder: sub.placeholder.trim()}),
                            };
                        }
                    });
                }

                schema.fields[key] = arrayDef;

            } else if (f.type.startsWith("$")) {
                // Embedded schema reference
                schema.fields[key] = {
                    type: f.type,
                    label: f.label.trim() || key,
                    required: f.required,
                };
            } else {
                schema.fields[key] = {
                    type: f.type,
                    label: f.label.trim() || f.type,
                    required: f.required,
                    ...(f.placeholder?.trim() && {placeholder: f.placeholder.trim()}),
                };
            }
        });

        return yaml.dump(schema, {indent: 2});
    };

    const handleGenerate = () => onGenerate?.(generateYAML());

    // ── Render ────────────────────────────────────────────────────
    return (
        <Box sx={{pb: isMobile ? "80px" : 0}}>
            <Stack spacing={isMobile ? 2 : 3}>

                {/* Schema meta */}
                <Paper elevation={0}
                       sx={{p: isMobile ? 2 : 3, borderRadius: 2, border: "1px solid", borderColor: "divider"}}>
                    <Stack spacing={2}>
                        <TextField fullWidth label="Schema Name" value={name}
                                   onChange={(e) => setName(e.target.value)} placeholder="e.g. Invoice"/>
                        <TextField fullWidth label="Description (optional)" value={description}
                                   onChange={(e) => setDescription(e.target.value)} multiline minRows={2}/>
                    </Stack>
                </Paper>

                {/* Reference legend — only shown when sibling schemas exist */}
                {otherSchemas.length > 0 && (
                    <Paper elevation={0} sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: "1px dashed",
                        borderColor: refColor,
                        bgcolor: alpha(refColor, 0.04)
                    }}>
                        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" gap={0.5}>
                            <LinkIcon sx={{fontSize: 14, color: refColor}}/>
                            <Typography variant="caption" color="text.secondary">
                                Available references:
                            </Typography>
                            {otherSchemas.map((s) => (
                                <Chip key={s} label={`$${s}`} size="small"
                                      sx={{
                                          fontSize: 11,
                                          bgcolor: alpha(refColor, 0.1),
                                          color: refColor,
                                          fontFamily: "monospace"
                                      }}/>
                            ))}
                        </Stack>
                    </Paper>
                )}

                <Divider/>

                {/* Fields header (desktop) */}
                {!isMobile && (
                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <Typography variant="h6" fontWeight={600}>Fields ({fields.length})</Typography>
                        <Button variant="outlined" startIcon={<AddIcon/>} onClick={addField}>Add Field</Button>
                    </Box>
                )}

                {/* Field cards */}
                <Stack spacing={isMobile ? 2 : 2.5}>
                    {fields.length === 0 ? (
                        <Typography color="text.secondary" align="center" sx={{py: 6}}>
                            {isMobile ? 'Tap "Add" below' : 'Click "Add Field"'} to start building
                        </Typography>
                    ) : (
                        fields.map((field, idx) => {
                            const isArray = field.type === "array";
                            const isRef = field.type.startsWith("$");
                            const isArrayRef = isArray && field.items?.startsWith("$");
                            const color = getTypeColor(field.type);
                            const expanded = expandedArrays[idx] ?? true;

                            return (
                                <Paper key={field.id} elevation={1}
                                       sx={{borderRadius: 2, borderTop: `4px solid ${color}`, overflow: "hidden"}}>

                                    <Box sx={{p: isMobile ? 2 : 2.5}}>
                                        {/* Card header */}
                                        <Stack direction="row" justifyContent="space-between" alignItems="center"
                                               mb={2}>
                                            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                                                <Box sx={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: "50%",
                                                    bgcolor: color,
                                                    flexShrink: 0
                                                }}/>
                                                <Typography variant="subtitle1" fontWeight={600}>
                                                    {isRef ? "Reference" : isArray ? "Array" : `Field ${idx + 1}`}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ({field.type}{isArrayRef ? ` of ${field.items}` : ""})
                                                </Typography>
                                                {(isRef || isArrayRef) && (
                                                    <Tooltip
                                                        title="This field references another schema in this folder">
                                                        <LinkIcon sx={{fontSize: 14, color: refColor}}/>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                            <IconButton size="small" color="error" onClick={() => removeField(idx)}>
                                                <DeleteIcon fontSize="small"/>
                                            </IconButton>
                                        </Stack>

                                        <Stack spacing={2}>
                                            {/* Key */}
                                            <TextField fullWidth label="Field Key / ID" disabled value={field.id}
                                                       size="small" helperText="Used in YAML output"/>

                                            {/* Label */}
                                            <TextField fullWidth label="Display Label" value={field.label}
                                                       onChange={(e) => updateField(idx, {label: e.target.value})}
                                                       size="small"/>

                                            {/* Type + Required */}
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Select
                                                    value={field.type}
                                                    onChange={(e) => updateField(idx, {
                                                        type: e.target.value,
                                                        items: ""
                                                    })}
                                                    size="small"
                                                    IconComponent={ArrowDropDownIcon}
                                                    sx={{
                                                        minWidth: 160,
                                                        "& .MuiSelect-select": {color, fontWeight: 500},
                                                    }}
                                                >
                                                    {/* Primitives */}
                                                    {PRIMITIVE_TYPES.map((t) => (
                                                        <MenuItem key={t} value={t}
                                                                  sx={{color: primitiveColors[t] || "inherit"}}>
                                                            {t}
                                                        </MenuItem>
                                                    ))}

                                                    {/* Schema references */}
                                                    {otherSchemas.length > 0 && <Divider/>}
                                                    {otherSchemas.map((s) => (
                                                        <MenuItem key={`$${s}`} value={`$${s}`}
                                                                  sx={{
                                                                      color: refColor,
                                                                      fontFamily: "monospace",
                                                                      fontWeight: 500
                                                                  }}>
                                                            ${s}
                                                        </MenuItem>
                                                    ))}
                                                </Select>

                                                <FormControlLabel
                                                    control={
                                                        <Checkbox checked={field.required}
                                                                  onChange={(e) => updateField(idx, {required: e.target.checked})}
                                                                  size="small" sx={{color, "&.Mui-checked": {color}}}/>
                                                    }
                                                    label="Required" sx={{m: 0}}
                                                />
                                            </Stack>

                                            {/* For array fields: choose between inline sub-fields or a schema reference */}
                                            {isArray && (
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary"
                                                                sx={{mb: 0.5, display: "block"}}>
                                                        Array item type
                                                    </Typography>
                                                    <Select
                                                        value={field.items || "__inline__"}
                                                        onChange={(e) => {
                                                            const v = e.target.value;
                                                            updateField(idx, {items: v === "__inline__" ? "" : v});
                                                        }}
                                                        size="small"
                                                        sx={{minWidth: 200}}
                                                    >
                                                        <MenuItem value="__inline__">
                                                            <em>Inline sub-fields (defined below)</em>
                                                        </MenuItem>
                                                        {otherSchemas.map((s) => (
                                                            <MenuItem key={s} value={`$${s}`}
                                                                      sx={{color: refColor, fontFamily: "monospace"}}>
                                                                ${s}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </Box>
                                            )}

                                            {/* Placeholder — only for primitive scalar fields */}
                                            {!isArray && !isRef && field.type !== "checkbox" && (
                                                <TextField fullWidth label="Placeholder" value={field.placeholder}
                                                           onChange={(e) => updateField(idx, {placeholder: e.target.value})}
                                                           size="small"/>
                                            )}
                                        </Stack>
                                    </Box>

                                    {/* Sub-fields — only for inline arrays (not schema-ref arrays) */}
                                    {isArray && !isArrayRef && (
                                        <>
                                            <Box
                                                sx={{
                                                    px: isMobile ? 2 : 2.5,
                                                    py: 1,
                                                    bgcolor: alpha("#000", 0.03),
                                                    borderTop: "1px solid",
                                                    borderColor: "divider",
                                                    cursor: "pointer",
                                                    userSelect: "none"
                                                }}
                                                onClick={() => toggleArrayExpand(idx)}
                                            >
                                                <Stack direction="row" justifyContent="space-between"
                                                       alignItems="center">
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        Sub-fields ({field.fields.length})
                                                    </Typography>
                                                    {expanded ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                                                </Stack>
                                            </Box>

                                            <Collapse in={expanded}>
                                                <Box sx={{p: isMobile ? 2 : 2.5, pt: 1.5}}>
                                                    <Stack spacing={isMobile ? 2 : 2}>
                                                        {field.fields.length === 0 && (
                                                            <Typography variant="body2" color="text.secondary"
                                                                        sx={{fontStyle: "italic"}}>
                                                                No sub-fields yet.
                                                            </Typography>
                                                        )}

                                                        {field.fields.map((sub, sIdx) => (
                                                            <Paper key={sub.id} variant="outlined"
                                                                   sx={{p: isMobile ? 1.5 : 2, borderRadius: 1.5}}>
                                                                <Stack direction="row" justifyContent="space-between"
                                                                       alignItems="center" mb={1.5}>
                                                                    <Typography variant="caption" fontWeight={600}
                                                                                color="text.secondary">
                                                                        Sub-field {sIdx + 1}
                                                                    </Typography>
                                                                    <IconButton size="small" color="error"
                                                                                onClick={() => removeSubField(idx, sIdx)}>
                                                                        <DeleteIcon fontSize="small"/>
                                                                    </IconButton>
                                                                </Stack>

                                                                <Stack spacing={1.5}>
                                                                    <TextField fullWidth label="Key" value={sub.id}
                                                                               onChange={(e) => updateSubField(idx, sIdx, {id: e.target.value})}
                                                                               size="small"/>
                                                                    <TextField fullWidth label="Label" value={sub.label}
                                                                               onChange={(e) => updateSubField(idx, sIdx, {label: e.target.value})}
                                                                               size="small"/>

                                                                    <Stack direction="row" spacing={2}
                                                                           alignItems="center">
                                                                        <Select value={sub.type}
                                                                                onChange={(e) => updateSubField(idx, sIdx, {type: e.target.value})}
                                                                                size="small" sx={{minWidth: 120}}>
                                                                            {PRIMITIVE_TYPES.filter((t) => t !== "array").map((t) => (
                                                                                <MenuItem key={t}
                                                                                          value={t}>{t}</MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                        <FormControlLabel
                                                                            control={
                                                                                <Checkbox checked={sub.required}
                                                                                          onChange={(e) => updateSubField(idx, sIdx, {required: e.target.checked})}
                                                                                          size="small"/>
                                                                            }
                                                                            label="Required" sx={{m: 0}}
                                                                        />
                                                                    </Stack>

                                                                    {sub.type !== "checkbox" && (
                                                                        <TextField fullWidth label="Placeholder"
                                                                                   value={sub.placeholder || ""}
                                                                                   onChange={(e) => updateSubField(idx, sIdx, {placeholder: e.target.value})}
                                                                                   size="small"/>
                                                                    )}
                                                                </Stack>
                                                            </Paper>
                                                        ))}

                                                        <Button size="small" startIcon={<AddIcon fontSize="small"/>}
                                                                onClick={() => addSubField(idx)}
                                                                sx={{alignSelf: "flex-start"}}>
                                                            Add sub-field
                                                        </Button>
                                                    </Stack>
                                                </Box>
                                            </Collapse>
                                        </>
                                    )}

                                    {/* Schema-ref array — info banner instead of sub-fields */}
                                    {isArray && isArrayRef && (
                                        <Box sx={{
                                            px: 2.5, py: 1.5, bgcolor: alpha(refColor, 0.05),
                                            borderTop: "1px solid", borderColor: alpha(refColor, 0.2)
                                        }}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <LinkIcon sx={{fontSize: 14, color: refColor}}/>
                                                <Typography variant="caption" sx={{color: refColor}}>
                                                    Items will use the <strong>{field.items}</strong> schema. Fields are
                                                    defined there.
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    )}

                                    {/* Embedded ref — info banner */}
                                    {isRef && (
                                        <Box sx={{
                                            px: 2.5, py: 1.5, bgcolor: alpha(refColor, 0.05),
                                            borderTop: "1px solid", borderColor: alpha(refColor, 0.2)
                                        }}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <LinkIcon sx={{fontSize: 14, color: refColor}}/>
                                                <Typography variant="caption" sx={{color: refColor}}>
                                                    This field embeds the <strong>{field.type}</strong> schema inline.
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    )}
                                </Paper>
                            );
                        })
                    )}
                </Stack>
            </Stack>

            {/* Desktop generate button */}
            {!isMobile && (
                <Box sx={{textAlign: "center", mt: 4}}>
                    <Button variant="contained" size="large" disabled={fields.length === 0}
                            onClick={handleGenerate} sx={{minWidth: 220, py: 1.5}}>
                        Generate YAML Schema
                    </Button>
                </Box>
            )}

            {/* Mobile sticky bottom bar */}
            {isMobile && (
                <Box sx={{
                    position: "fixed", bottom: 0, left: 0, right: 0,
                    bgcolor: "background.paper", borderTop: "1px solid", borderColor: "divider",
                    p: 2, display: "flex", gap: 1,
                    boxShadow: "0 -2px 10px rgba(0,0,0,0.08)", zIndex: 1200,
                }}>
                    {onCancel && (
                        <Button fullWidth variant="outlined" color="inherit" onClick={onCancel} sx={{flexShrink: 1}}>
                            Cancel
                        </Button>
                    )}
                    <Button fullWidth variant="outlined" startIcon={<AddIcon/>} onClick={addField} sx={{flexShrink: 1}}>
                        Add
                    </Button>
                    <Button fullWidth variant="contained" onClick={handleGenerate}
                            disabled={fields.length === 0} sx={{flexShrink: 1}}>
                        Generate
                    </Button>
                    {onSave && (
                        <Button fullWidth variant="contained" color="success" onClick={onSave} sx={{flexShrink: 1}}>
                            Save
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
}
