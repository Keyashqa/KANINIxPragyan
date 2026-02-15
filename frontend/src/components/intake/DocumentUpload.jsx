import { useState, useCallback } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { CloudUpload, InsertDriveFile } from '@mui/icons-material';
import { uploadDocument } from '../../api/triageApi';

export default function DocumentUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const f = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (f) setFile(f);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const data = await uploadDocument(file);
      setResult(data);
    } catch {
      setResult({ error: 'Upload failed' });
    }
    setUploading(false);
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 3, mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom>Document Upload (Optional)</Typography>
      <Box
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        sx={{
          border: '2px dashed #CCC', borderRadius: 2, p: 3, textAlign: 'center',
          cursor: 'pointer', '&:hover': { borderColor: 'primary.main' },
        }}
        onClick={() => document.getElementById('doc-upload-input').click()}
      >
        <input id="doc-upload-input" type="file" hidden onChange={onDrop} />
        {file ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <InsertDriveFile color="primary" />
            <Typography>{file.name}</Typography>
          </Box>
        ) : (
          <>
            <CloudUpload sx={{ fontSize: 36, color: '#AAA' }} />
            <Typography variant="body2" color="text.secondary">Drag & drop or click to select</Typography>
          </>
        )}
      </Box>
      {file && (
        <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Document'}
        </Button>
      )}
      {result?.text && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'success.main' }}>
          Extracted {result.text.length} characters
        </Typography>
      )}
    </Paper>
  );
}
