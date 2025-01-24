import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon
import { useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton
} from "@mui/material";
import {
  saveDocument,
  updateDocument,
  getModules
} from "../Utils/moduleStorage"; // Import saveDocument function

const CreateDocument = () => {
  const location = useLocation();
  const documentToEdit = location.state?.documentToEdit;

  const [documentName, setDocumentName] = useState("");
  const [description, setDescription] = useState("");
  const [milestone, setMilestone] = useState("");
  const [files, setFiles] = useState([]);
  const [milestones, setMilestones] = useState([{}]);
  const navigate = useNavigate();// Initial state for milestones

  useEffect(() => {
    const savedModules = getModules(); // Fetch milestones dynamically
    console.log("saved module : ", savedModules);
    if (Array.isArray(savedModules)) {
      setMilestones(savedModules);
    }
  }, []);

  // Drag-and-Drop Handlers
  const onDrop = (acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*,application/pdf",
    multiple: true,
  });

  const handleSave = () => {
    if (!documentName || !milestone || files.length === 0) {
      alert("Please fill all fields and upload files.");
      return;
    }

    const newDocument = {
      id: Math.floor(Math.random() * (100 - 10 + 1) + 10),
      documentName,
      description,
      milestone,
      files: files.map((file) => (typeof file === "string" ? file : file.name)),
      uploadedAt: documentToEdit ? documentToEdit.uploadedAt : new Date().toISOString(),
    };

    if (documentToEdit) {
      // Update logic
      updateDocument(documentToEdit.id, newDocument); // Implement `updateDocument` in your storage utility
      alert("Document updated successfully!");
    } else {
      // Create logic
      const isSaved = saveDocument(newDocument); // Use existing save function
      if (isSaved) {
        alert("Document saved successfully!");
      } else {
        alert("Failed to save the document. Please try again.");
      }
    }

    // Redirect to Document Library
    navigate("/documentlibrary");
  };

  const handleCancel = () => {
    // Clear the form fields
    setDocumentName("");
    setDescription("");
    setMilestone("");
    setFiles([]);
    navigate("/documentlibrary");
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const formatFileSize = (size) => {
    if (size < 1024) {
      return `${size} bytes`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#fff",
        padding: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 600,
          padding: 4,
          borderRadius: 3,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h4" textAlign="center" gutterBottom>
          Create Document
        </Typography>
        <Typography variant="body1" color="textSecondary" textAlign="center" mb={3}>
          Fill out the form below to upload your document.
        </Typography>
        <form>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Document Name"
                variant="outlined"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Milestone"
                variant="outlined"
                value={milestone}
                onChange={(e) => setMilestone(e.target.value)}
              >
                {milestones.map((option, index) => (
                  <MenuItem key={index} value={option.moduleName}>
                    {option.moduleName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Box
                {...getRootProps()}
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: "8px",
                  padding: 3,
                  textAlign: "center",
                  backgroundColor: isDragActive ? "#f0f8ff" : "#fafafa",
                  cursor: "pointer",
                }}
              >
                <input {...getInputProps()} />

                {/* Upload Icon and Text */}
                <div style={{ marginBottom: '10px' }}>
                  <CloudUploadIcon style={{ fontSize: '40px', color: '#5c6bc0' }} /> {/* Upload Icon */}
                </div>

                {isDragActive ? (
                  <Typography variant="body2">Drop the files here...</Typography>
                ) : (
                  <Typography variant="body2">
                    Drag and drop files here, or click to select files
                  </Typography>
                )}
              </Box>
              {files.map((file, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="remove"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <CloseIcon style={{ color: '#888' }} /> {/* Cross Icon */}
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={file.name}
                    secondary={formatFileSize(file.size)}
                  />
                </ListItem>
              ))}

            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 3,
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              sx={{  backgroundColor:'#4A90E2' ,color:'black',width: "45%" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              style={{ backgroundColor:'#4A90E2' ,color:'black',width: "45%"}}
            >
              Save
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateDocument;