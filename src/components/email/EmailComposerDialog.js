import { useState, useRef } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Button,
    IconButton,
    Typography,
    Chip,
    Avatar,
    Divider,
    Tooltip,
    Stack,
    LinearProgress,
} from "@mui/material";
import {
    Close,
    Send,
    AttachFile,
    AccessTime,
    InsertDriveFile,
    Delete,
} from "@mui/icons-material";

import EmailField from "../fields/EmailField";
import TextField from "../fields/TextField";
import TextareaField from "../fields/TextareaField";

// ── Mock recently sent addresses — replace with real data from your store/API ──
const RECENT_EMAILS = [
    { address: "alice@example.com", name: "Alice M." },
    { address: "bob.smith@company.io", name: "Bob Smith" },
    { address: "carol@design.co", name: "Carol T." },
    { address: "david@startup.dev", name: "David K." },
    { address: "eve@corp.com", name: "Eve R." },
];

function getInitials(name) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function EmailComposerDialog({ open, onClose, onSend }) {
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({ from: "", to: "", subject: "", body: "" });
    const [errors, setErrors] = useState({});
    const [attachments, setAttachments] = useState([]);
    const [sending, setSending] = useState(false);

    const handleFieldChange = (key) => (val) => {
        setForm((prev) => ({ ...prev, [key]: val }));
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    // Clicking a recent address fills the "To" field
    const handleRecentClick = (address) => {
        setForm((prev) => ({ ...prev, to: address }));
        if (errors.to) setErrors((prev) => ({ ...prev, to: undefined }));
    };

    // File attachment
    const handleFileChange = (e) => {
        const picked = Array.from(e.target.files || []);
        setAttachments((prev) => [
            ...prev,
            ...picked.map((f) => ({ file: f, name: f.name, size: f.size })),
        ]);
        // Reset so the same file can be re-added after removal
        e.target.value = "";
    };

    const removeAttachment = (index) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    // Basic validation
    const validate = () => {
        const errs = {};
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.from.trim()) errs.from = "Sender email is required";
        else if (!emailRe.test(form.from)) errs.from = "Invalid email address";
        if (!form.to.trim()) errs.to = "Recipient email is required";
        else if (!emailRe.test(form.to)) errs.to = "Invalid email address";
        if (!form.subject.trim()) errs.subject = "Subject is required";
        return errs;
    };

    const handleSend = async () => {
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setSending(true);
        try {
            await onSend?.({ ...form, attachments });
            handleClose();
        } finally {
            setSending(false);
        }
    };

    const handleClose = () => {
        if (sending) return;
        setForm({ from: "", to: "", subject: "", body: "" });
        setErrors({});
        setAttachments([]);
        onClose?.();
    };

    // Shared config shape expected by your field components
    const cfg = (label, placeholder, required = true) => ({
        label,
        placeholder,
        required,
    });

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: { borderRadius: 2, overflow: "hidden" },
            }}
        >
            {/* ── Header ── */}
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pb: 1,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Send fontSize="small" />
                    <Typography variant="subtitle1" fontWeight={600}>
                        New Email
                    </Typography>
                </Box>
                <IconButton size="small" onClick={handleClose} sx={{ color: "inherit" }}>
                    <Close fontSize="small" />
                </IconButton>
            </DialogTitle>

            {sending && <LinearProgress />}

            <DialogContent sx={{ pt: 2.5, pb: 1 }}>
                <Stack spacing={2}>

                    {/* ── From ── */}
                    <EmailField
                        fieldKey="from"
                        config={cfg("From", "your@email.com")}
                        value={form.from}
                        error={errors.from}
                        onChange={handleFieldChange("from")}
                    />

                    {/* ── To + recent addresses ── */}
                    <Box>
                        <EmailField
                            fieldKey="to"
                            config={cfg("To", "recipient@email.com")}
                            value={form.to}
                            error={errors.to}
                            onChange={handleFieldChange("to")}
                        />

                        {/* Recently sent */}
                        <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.75 }}>
                                <AccessTime sx={{ fontSize: 13, color: "text.disabled" }} />
                                <Typography variant="caption" color="text.disabled">
                                    Recently sent
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                                {RECENT_EMAILS.map((r) => (
                                    <Tooltip key={r.address} title={r.address} arrow placement="top">
                                        <Chip
                                            size="small"
                                            avatar={
                                                <Avatar sx={{ bgcolor: "primary.light", fontSize: "0.6rem" }}>
                                                    {getInitials(r.name)}
                                                </Avatar>
                                            }
                                            label={r.name}
                                            onClick={() => handleRecentClick(r.address)}
                                            variant={form.to === r.address ? "filled" : "outlined"}
                                            color={form.to === r.address ? "primary" : "default"}
                                            sx={{ cursor: "pointer", fontSize: "0.72rem" }}
                                        />
                                    </Tooltip>
                                ))}
                            </Box>
                        </Box>
                    </Box>

                    {/* ── Subject ── */}
                    <TextField
                        fieldKey="subject"
                        config={cfg("Subject", "What's this about?")}
                        value={form.subject}
                        error={errors.subject}
                        onChange={handleFieldChange("subject")}
                    />

                    {/* ── Body (rich text via your TextareaField) ── */}
                    <TextareaField
                        fieldKey="body"
                        config={{ label: "Message", required: false }}
                        value={form.body}
                        error={errors.body}
                        onChange={handleFieldChange("body")}
                    />

                    {/* ── Attachments ── */}
                    <Box>
                        <Divider sx={{ mb: 1.5 }} />
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <Button
                            size="small"
                            startIcon={<AttachFile fontSize="small" />}
                            onClick={() => fileInputRef.current?.click()}
                            variant="outlined"
                            sx={{ mb: attachments.length ? 1.5 : 0 }}
                        >
                            Add Attachment
                        </Button>

                        {attachments.length > 0 && (
                            <Stack spacing={0.75}>
                                {attachments.map((att, i) => (
                                    <Box
                                        key={i}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            px: 1.5,
                                            py: 0.75,
                                            borderRadius: 1,
                                            bgcolor: "action.hover",
                                            border: "1px solid",
                                            borderColor: "divider",
                                        }}
                                    >
                                        <InsertDriveFile fontSize="small" color="action" />
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography
                                                variant="caption"
                                                fontWeight={500}
                                                noWrap
                                                display="block"
                                            >
                                                {att.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.disabled">
                                                {formatBytes(att.size)}
                                            </Typography>
                                        </Box>
                                        <IconButton
                                            size="small"
                                            onClick={() => removeAttachment(i)}
                                            sx={{ color: "text.disabled" }}
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </Box>

                </Stack>
            </DialogContent>

            {/* ── Actions ── */}
            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button onClick={handleClose} disabled={sending} color="inherit">
                    Discard
                </Button>
                <Button
                    onClick={handleSend}
                    disabled={sending}
                    variant="contained"
                    startIcon={<Send fontSize="small" />}
                >
                    {sending ? "Sending…" : "Send"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}