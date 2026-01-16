import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Stack,
  Divider
} from '@mui/material';

import FileUpload from '../components/FileUpload';
import FileTable from '../components/FileTable';
import FileGrid from '../components/FileGrid';

import Loading from '../components/Loading';
import Toast from '../components/Toast';
import { listFiles, downloadFile } from '../api/client';

export default function Dashboard() {

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [deletedFiles, setDeletedFiles] = useState([]);

  // Helper to show toast and auto-hide
  const showToast = (message, type = "info") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast({ message: '', type: '' });
    }, 3500);
  };

  // Load files from backend
  const loadFiles = async () => {
    try {
      setLoading(true);
      const res = await listFiles();
      setFiles(res || []);
    } catch (err) {
      showToast(err.message || "Failed to load files", "error");
    } finally {
      setLoading(false);
    }
  };

  // Download handler
  const handleDownload = async (name) => {
    try {
      await downloadFile(name);

      showToast(`${name} downloaded successfully`, "success");

      // Strike-through immediately
      setDeletedFiles(prev => [...prev, name]);

      // Remove from UI after 5 seconds
      setTimeout(() => {
        setFiles(prev =>
          prev.filter(f => (f.fileName || f) !== name)
        );
      }, 5000);

    } catch (err) {
      showToast(err.message || "Download failed", "error");
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>

      {/* Page Header */}
      <Stack spacing={1} mb={4}>
        <Typography
          variant="h4"
          fontWeight={600}
          letterSpacing={0.5}
        >
          Secure File Transfer
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Upload and download files securely from the server
        </Typography>
      </Stack>

      {/* Toast messages */}
      <Toast message={toast.message} type={toast.type} />

      {/* Upload Card */}
      <Box mb={4}>
        <FileUpload
          onUpload={() => {
            showToast("File uploaded successfully", "success");
            loadFiles();
          }}
          setToast={(t) => showToast(t.message, t.type)}
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Files Section Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">
          Uploaded Files
        </Typography>

        <Button
          variant="outlined"
          size="small"
          onClick={loadFiles}
        >
          Refresh
        </Button>
      </Box>

      {/* Table / Loader */}
      {loading ? (
        <Loading />
      ) : (
        <FileTable
          files={files}
          onDownload={handleDownload}
          deletedFiles={deletedFiles}
        />
      )}
    </Container>
  );
}
