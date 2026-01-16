import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box
} from '@mui/material';

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

// File icon selector
function getFileIcon(name) {
  if (!name) return <InsertDriveFileIcon />;
  if (name.toLowerCase().endsWith('.pdf')) return <PictureAsPdfIcon color="error" />;
  if (name.toLowerCase().endsWith('.png') || name.toLowerCase().endsWith('.jpg')) {
    return <ImageIcon color="primary" />;
  }
  if (
    name.toLowerCase().endsWith('.txt') ||
    name.toLowerCase().endsWith('.doc') ||
    name.toLowerCase().endsWith('.docx')
  ) {
    return <DescriptionIcon />;
  }
  return <InsertDriveFileIcon />;
}

// Format seconds → mm:ss
function formatTime(seconds) {
  if (seconds <= 0) return "Expired";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

// ✅ Correct animation wrapper
const MotionTableRow = motion(TableRow);

export default function FileTable({ files, onDownload, deletedFiles = [] }) {

  const [localFiles, setLocalFiles] = useState([]);

  useEffect(() => {
    setLocalFiles(files || []);
  }, [files]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLocalFiles(prev =>
        prev.map(f => ({
          ...f,
          expiresInSeconds:
            typeof f.expiresInSeconds === 'number' && f.expiresInSeconds > 0
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
        mt={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
        color="text.secondary"
      >
        <FolderOpenIcon sx={{ fontSize: 60, opacity: 0.6 }} />
        <Typography variant="h6" mt={1}>
          No files uploaded yet
        </Typography>
        <Typography variant="body2">
          Upload a file to see it listed here
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 2,
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'action.hover' }}>
            <TableCell><b>File Name</b></TableCell>
            <TableCell><b>Size (MB)</b></TableCell>
            <TableCell><b>Uploaded Time</b></TableCell>
            <TableCell><b>Auto Delete In</b></TableCell>
            <TableCell align="right"><b>Action</b></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <AnimatePresence>
            {localFiles.map((file) => {
              const fileName = file.fileName;
              const size = file.sizeMB;
              const time = file.uploadedAt;
              const ttl = file.expiresInSeconds;
              const isDeleted = deletedFiles.includes(fileName);
              const expired = typeof ttl === "number" && ttl <= 0;

              return (
                <MotionTableRow
                  key={fileName}
                  hover
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  sx={{
                    textDecoration: isDeleted || expired ? "line-through" : "none",
                    opacity: isDeleted || expired ? 0.4 : 1
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.2}>
                      {getFileIcon(fileName)}
                      <Typography fontWeight={500}>{fileName}</Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    {typeof size === "number" ? size.toFixed(2) : "—"}
                  </TableCell>

                  <TableCell>{time || "—"}</TableCell>

                  <TableCell>
                    <Typography color={expired ? "error.main" : "text.secondary"}>
                      {typeof ttl === "number" ? formatTime(ttl) : "—"}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={isDeleted || expired}
                      onClick={() => onDownload(fileName)}
                    >
                      Download
                    </Button>
                  </TableCell>
                </MotionTableRow>
              );
            })}
          </AnimatePresence>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
