import { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Stack
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { motion } from "framer-motion";
import { uploadFileWithProgress } from "../api/client";

export default function FileUpload({ onUpload, setToast }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) {
      setToast("Please select a file", "warning");
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      await uploadFileWithProgress(file, setProgress);

      setToast("File uploaded successfully", "success");
      setFile(null);
      onUpload(); // refresh list

    } catch (err) {
      setToast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1f2937, #111827)"
              : "linear-gradient(135deg, #f9fafb, #f3f4f6)",
          border: "1px solid",
          borderColor: "divider"
        }}
      >
        <Stack spacing={2}>
          <Typography fontWeight={600}>Upload File</Typography>

          {/* Dropzone */}
          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed",
              borderColor: isDragActive ? "primary.main" : "divider",
              borderRadius: 3,
              p: 4,
              textAlign: "center",
              cursor: "pointer",
              transition: "0.25s ease",
              background: (theme) =>
                isDragActive
                  ? "rgba(25,118,210,0.08)"
                  : theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, #111827, #0f172a)"
                  : "linear-gradient(135deg, #ffffff, #f9fafb)",
              "&:hover": {
                background: "rgba(25,118,210,0.05)"
              }
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 52, color: "primary.main" }} />
            <Typography variant="h6">
              {isDragActive ? "Drop file here" : "Drag & drop file here"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or click to browse
            </Typography>
          </Box>

          {/* Selected file */}
          {file && (
            <Typography variant="body2">
              Selected: <b>{file.name}</b> —{" "}
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          )}

          {/* Circular progress */}
          {uploading && (
            <Box display="flex" justifyContent="center" alignItems="center">
              <Box position="relative" display="inline-flex">
                <CircularProgress
                  variant="determinate"
                  value={progress}
                  size={90}
                  thickness={4}
                />
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  bottom={0}
                  right={0}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography fontWeight={600}>
                    {progress}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          <Box textAlign="right">
            <Button
              variant="contained"
              size="large"
              disabled={uploading}
              onClick={handleUpload}
              sx={{ borderRadius: 3, px: 4 }}
            >
              Upload
            </Button>
          </Box>
        </Stack>
      </Paper>
    </motion.div>
  );
}
