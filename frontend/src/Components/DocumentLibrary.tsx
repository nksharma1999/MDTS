import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Paper,
  Box,
  Button,
  IconButton,
  Divider,
  Pagination,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getAllDocuments, deleteDocument } from "../Utils/moduleStorage";

const ITEMS_PER_PAGE = 5;

const DocumentLibrary = () => {
  const [documents, setDocuments] = useState([]);
  const [currentPages, setCurrentPages] = useState({}); // Track page for each milestone
  const navigate = useNavigate();

  useEffect(() => {
    const savedDocuments = getAllDocuments();
    setDocuments(savedDocuments);
  }, []);

  const handleDelete = (milestone, docIndex) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      deleteDocument(docIndex);
      const updatedDocuments = getAllDocuments();
      setDocuments(updatedDocuments);
    }
  };

  const handleEdit = (milestone, docIndex) => {
    const documentToEdit = groupedDocuments[milestone][docIndex];
    navigate("/createdocument", { state: { documentToEdit } });
  };  

  const handleView = (milestone, docIndex) => {
    const documentToView = documents[docIndex];
    alert(`View functionality for: ${documentToView.documentName}`);
  };

  const handlePageChange = (milestone, event, page) => {
    setCurrentPages((prev) => ({ ...prev, [milestone]: page }));
  };

  const groupedDocuments = documents.reduce((acc, document) => {
    if (!acc[document.milestone]) {
      acc[document.milestone] = [];
    }
    acc[document.milestone].push(document);
    return acc;
  }, {});

  return (
    <Box sx={{ padding: 3,  marginLeft: 3, marginRight: 9 ,width:'80%'}}>
      {/* Page Header */}
      <Box sx={{ marginBottom: 1}}>
        <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", color: "black",marginRight:'auto' }}>
          Document Library
        </Typography>
        <Divider sx={{ marginTop: 2, backgroundColor: "#ddd" }} />
      </Box>

      {Object.keys(groupedDocuments).length === 0 ? (
        <Typography variant="body1" color="textSecondary" textAlign="center">
          No documents available.
        </Typography>
      ) : (
        Object.keys(groupedDocuments).map((milestone, index) => {
          const totalDocuments = groupedDocuments[milestone].length;
          const currentPage = currentPages[milestone] || 1;
          const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
          const paginatedDocuments = groupedDocuments[milestone].slice(
            startIndex,
            startIndex + ITEMS_PER_PAGE
          );

          return (
            <Accordion key={index} sx={{ marginBottom: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: "#4F7942",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {milestone}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  backgroundColor: "#f9f9f9",
                  padding: 2,
                  boxSizing: "border-box",
                }}
              >
                {paginatedDocuments.map((document, docIndex) => (
                  <Paper
                    key={docIndex}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
                      },
                      overflow: "hidden",
                    }}
                  >
                    <Box sx={{ backgroundColor: "#007bff", height: "5px", width: "100%" }} />

                    <Box
                      sx={{
                        padding: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {document.documentName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {document.description}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Uploaded: {new Date(document.uploadedAt).toLocaleString()}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 2,
                        backgroundColor: "#f5f5f5",
                        borderTop: "1px solid #e0e0e0",
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate("/view-document", { state: { document } })}
                          style={{ backgroundColor:'#4A90E2' ,color:'black',}}
                          startIcon={<VisibilityIcon />}
                        >
                          View
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEdit(milestone, docIndex)}
                          style={{ backgroundColor:'#4A90E2' ,color:'black',}}
                          startIcon={<EditIcon />}
                        >
                          Edit
                        </Button>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(milestone, docIndex)}
                          aria-label="delete"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>
                ))}

                <Pagination
                  count={Math.ceil(totalDocuments / ITEMS_PER_PAGE)}
                  page={currentPage}
                  onChange={(e, page) => handlePageChange(milestone, e, page)}
                  sx={{ marginTop: 1 }}
                  size="small"
                  color="primary"
                />
              </AccordionDetails>
            </Accordion>
          );
        })
      )}
    </Box>
  );
};

export default DocumentLibrary;
