import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Grid
} from "@mui/material";
import { motion } from "framer-motion";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

// Icon selector
function getFileIcon(name) {
  if (!name) return <InsertDriveFileIcon fontSize="large" />;
  const lower = name.toLowerCase();

  if (lower.endsWith(".pdf")) return <PictureAsPdfIcon color="error" fontSize="large" />;
  if (lower.endsWith(".png") || lower.endsWith(".jpg"))
    return <ImageIcon color="primary" fontSize="large" />;
  if (lower.endsWith(".txt") || lower.endsWith(".doc") || lower.endsWith(".docx"))
    return <DescriptionIcon fontSize="large" />;

  return <InsertDriveFileIcon fontSize="large" />;
}

function formatTime(seconds) {
  if (seconds <= 0) return "Expired";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default function FileGrid({ files, onDownload, deletedFiles = [] }) {
  const [localFiles, setLocalFiles] = useState([]);

  // Sync backend files
  useEffect(() => {
    setLocalFiles(files || []);
  }, [files]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalFiles(prev =>
        prev.map(f => ({
          ...f,
          expiresInSeconds:
            typeof f.expiresInSeconds === "number" && f.expiresInSeconds > 0
              ? f.expiresInSeconds - 1
              : f.expiresInSeconds
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!localFiles || localFiles.length === 0) {
    return (
      <Box
        mt={6}
        display="flex"
        flexDirection="column"
        alignItems="center"
        color="text.secondary"
      >
        <FolderOpenIcon sx={{ fontSize: 70, opacity: 0.5 }} />
        <Typography variant="h6" mt={1}>
          No files uploaded yet
        </Typography>
        <Typography variant="body2">
          Upload a file to see it here
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {localFiles.map((file) => {
        const name = file.fileName;
        const size = file.sizeMB;
        const time = file.uploadedAt;
        const ttl = file.expiresInSeconds;

        const isDeleted = deletedFiles.includes(name);
        const expired = typeof ttl === "number" && ttl <= 0;

        return (
          <Grid item xs={12} sm={6} md={4} key={name}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  opacity: isDeleted || expired ? 0.45 : 1,
                  textDecoration: isDeleted || expired ? "line-through" : "none",
                  transition: "0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 4
                  }
                }}
              >
                <CardContent>
                  <Stack spacing={1.2}>
                    <Box display="flex" justifyContent="center">
                      {getFileIcon(name)}
                    </Box>

                    <Typography fontWeight={600} noWrap textAlign="center">
                      {name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      {typeof size === "number" ? size.toFixed(2) + " MB" : "—"}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" textAlign="center">
                      Uploaded: {time || "—"}
                    </Typography>

                    <Typography
                      variant="caption"
                      textAlign="center"
                      color={expired ? "error.main" : "warning.main"}
                    >
                      Auto delete: {typeof ttl === "number" ? formatTime(ttl) : "—"}
                    </Typography>

                    <Button
                      variant="outlined"
                      size="small"
                      disabled={isDeleted || expired}
                      onClick={() => onDownload(name)}
                      sx={{ mt: 1, borderRadius: 3 }}
                    >
                      Download
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        );
      })}
    </Grid>
  );
}
