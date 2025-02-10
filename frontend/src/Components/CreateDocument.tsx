// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDropzone } from "react-dropzone";
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import CloseIcon from '@mui/icons-material/Close'; // Import Close icon
// import { useLocation } from "react-router-dom";
// import {
//   TextField,
//   Button,
//   MenuItem,
//   Typography,
//   Box,
//   Paper,
//   Grid,
//   List,
//   ListItem,
//   ListItemText,
//   IconButton
// } from "@mui/material";
// import {
//   saveDocument,
//   updateDocument,
//   getModules
// } from "../Utils/moduleStorage"; // Import saveDocument function

// const CreateDocument = () => {
//   const location = useLocation();
//   const documentToEdit = location.state?.documentToEdit;

//   const [documentName, setDocumentName] = useState("");
//   const [description, setDescription] = useState("");
//   const [milestone, setMilestone] = useState("");
//   const [files, setFiles] = useState([]);
//   const [milestones, setMilestones] = useState([{}]);
//   const navigate = useNavigate();// Initial state for milestones

//   useEffect(() => {
//     const savedModules = getModules(); // Fetch milestones dynamically
//     console.log("saved module : ", savedModules);
//     if (Array.isArray(savedModules)) {
//       setMilestones(savedModules);
//     }
//   }, []);

//   // Drag-and-Drop Handlers
//   const onDrop = (acceptedFiles) => {
//     setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
//   };

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: "image/*,application/pdf",
//     multiple: true,
//   });

//   const handleSave = () => {
//     if (!documentName || !milestone || files.length === 0) {
//       alert("Please fill all fields and upload files.");
//       return;
//     }

//     const newDocument = {
//       id: Math.floor(Math.random() * (100 - 10 + 1) + 10),
//       documentName,
//       description,
//       milestone,
//       files: files.map((file) => (typeof file === "string" ? file : file.name)),
//       uploadedAt: documentToEdit ? documentToEdit.uploadedAt : new Date().toISOString(),
//     };

//     if (documentToEdit) {
//       // Update logic
//       updateDocument(documentToEdit.id, newDocument); // Implement `updateDocument` in your storage utility
//       alert("Document updated successfully!");
//     } else {
//       // Create logic
//       const isSaved = saveDocument(newDocument); // Use existing save function
//       if (isSaved) {
//         alert("Document saved successfully!");
//       } else {
//         alert("Failed to save the document. Please try again.");
//       }
//     }

//     // Redirect to Document Library
//     navigate("/documentlibrary");
//   };

//   const handleCancel = () => {
//     // Clear the form fields
//     setDocumentName("");
//     setDescription("");
//     setMilestone("");
//     setFiles([]);
//     navigate("/documentlibrary");
//   };

//   const handleRemoveFile = (indexToRemove) => {
//     setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
//   };

//   const formatFileSize = (size) => {
//     if (size < 1024) {
//       return `${size} bytes`;
//     } else if (size < 1024 * 1024) {
//       return `${(size / 1024).toFixed(2)} KB`;
//     } else {
//       return `${(size / (1024 * 1024)).toFixed(2)} MB`;
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         background: "#fff",
//         padding: 3,
//       }}
//     >
//       <Paper
//         elevation={3}
//         sx={{
//           width: "100%",
//           maxWidth: 600,
//           padding: 4,
//           borderRadius: 3,
//           backgroundColor: "white",
//         }}
//       >
//         <Typography variant="h4" textAlign="center" gutterBottom>
//           Create Document
//         </Typography>
//         <Typography variant="body1" color="textSecondary" textAlign="center" mb={3}>
//           Fill out the form below to upload your document.
//         </Typography>
//         <form>
//           <Grid container spacing={3}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Document Name"
//                 variant="outlined"
//                 value={documentName}
//                 onChange={(e) => setDocumentName(e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Description"
//                 variant="outlined"
//                 multiline
//                 rows={4}
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Milestone"
//                 variant="outlined"
//                 value={milestone}
//                 onChange={(e) => setMilestone(e.target.value)}
//               >
//                 {milestones.map((option, index) => (
//                   <MenuItem key={index} value={option.moduleName}>
//                     {option.moduleName}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//             <Grid item xs={12}>
//               <Box
//                 {...getRootProps()}
//                 sx={{
//                   border: "2px dashed #ccc",
//                   borderRadius: "8px",
//                   padding: 3,
//                   textAlign: "center",
//                   backgroundColor: isDragActive ? "#f0f8ff" : "#fafafa",
//                   cursor: "pointer",
//                 }}
//               >
//                 <input {...getInputProps()} />

//                 {/* Upload Icon and Text */}
//                 <div style={{ marginBottom: '10px' }}>
//                   <CloudUploadIcon style={{ fontSize: '40px', color: '#5c6bc0' }} /> {/* Upload Icon */}
//                 </div>

//                 {isDragActive ? (
//                   <Typography variant="body2">Drop the files here...</Typography>
//                 ) : (
//                   <Typography variant="body2">
//                     Drag and drop files here, or click to select files
//                   </Typography>
//                 )}
//               </Box>
//               {files.map((file, index) => (
//                 <ListItem
//                   key={index}
//                   secondaryAction={
//                     <IconButton
//                       edge="end"
//                       aria-label="remove"
//                       onClick={() => handleRemoveFile(index)}
//                     >
//                       <CloseIcon style={{ color: '#888' }} /> {/* Cross Icon */}
//                     </IconButton>
//                   }
//                 >
//                   <ListItemText
//                     primary={file.name}
//                     secondary={formatFileSize(file.size)}
//                   />
//                 </ListItem>
//               ))}

//             </Grid>
//           </Grid>
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               marginTop: 3,
//             }}
//           >
//             <Button
//               variant="outlined"
//               color="secondary"
//               onClick={handleCancel}
//               sx={{ backgroundColor: '#4A90E2', color: 'black', width: "45%" }}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleSave}
//               style={{ backgroundColor: '#4A90E2', color: 'black', width: "45%" }}
//             >
//               Save
//             </Button>
//           </Box>
//         </form>
//       </Paper>
//     </Box>
//   );
// };

// export default CreateDocument;



import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Accept, useDropzone } from "react-dropzone";
import { UploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
  Typography,
  Input,
  Button,
  Select,
  message,
  List,
  Form,
} from "antd";
import { saveDocument, updateDocument, getModules } from "../Utils/moduleStorage";
import "../styles/documents.css"
import ImageContainer from "./ImageContainer";
const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Module {
  moduleName: string;
}

interface DocumentData {
  id: number;
  documentName: string;
  description: string;
  milestone: string;
  files: string[];
  uploadedAt: string;
}

const CreateDocument: React.FC = () => {
  const location = useLocation();
  const documentToEdit = location.state?.documentToEdit as DocumentData | undefined;
  const [documentName, setDocumentName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [milestone, setMilestone] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [milestones, setMilestones] = useState<Module[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedModules = getModules();
    if (Array.isArray(savedModules)) {
      setMilestones(savedModules);
    }
  }, []);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*,application/pdf' as unknown as Accept,
    multiple: true,
  });

  const handleSave = () => {
    if (!documentName || !milestone || files.length === 0) {
      message.error("Please fill all fields and upload files.");
      return;
    }

    const newDocument: DocumentData = {
      id: Math.floor(Math.random() * (100 - 10 + 1) + 10),
      documentName,
      description,
      milestone,
      files: files.map((file) => file.name),
      uploadedAt: documentToEdit ? documentToEdit.uploadedAt : new Date().toISOString(),
    };

    if (documentToEdit) {
      updateDocument(documentToEdit.id, newDocument);
      message.success("Document updated successfully!");
    } else {
      const isSaved = saveDocument(newDocument);
      if (isSaved) {
        message.success("Document saved successfully!");
      } else {
        message.error("Failed to save the document. Please try again.");
      }
    }
    navigate("/documentlibrary");
  };

  const handleCancel = () => {
    setDocumentName("");
    setDescription("");
    setMilestone("");
    setFiles([]);
    navigate("/documentlibrary");
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  return (
    // <div className="main-doc-container">
    //   <div className="left-create-document">
    //     <div className="card-header bg-secondary create-doc-heading">
    //       <p style={{ margin: "0px", padding: "0px" }}>Create Document</p>
    //     </div>
    //     <div className="left-create-document-item">
    //       <Input placeholder="Document Name" value={documentName} onChange={(e) => setDocumentName(e.target.value)} style={{ marginBottom: 12 }} />
    //       <TextArea rows={4} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ marginBottom: 12 }} />
    //       <Select placeholder="Select Milestone" value={milestone} onChange={setMilestone} style={{ width: "100%", marginBottom: 12 }}>
    //         {milestones.map((option, index) => (
    //           <Option key={index} value={option.moduleName}>{option.moduleName}</Option>
    //         ))}
    //       </Select>
    //       <div {...getRootProps()} style={{ border: "2px dashed #d9d9d9", padding: 16, textAlign: "center", borderRadius: 8, cursor: "pointer", background: isDragActive ? "#f0f8ff" : "#fafafa", marginBottom: 12 }}>
    //         <input {...getInputProps()} />
    //         <UploadOutlined style={{ fontSize: 32, color: "#1890ff" }} />
    //         <Text style={{ display: "block", marginTop: 8 }}>{isDragActive ? "Drop the files here..." : "Drag and drop files here, or click to select files"}</Text>
    //       </div>
    //       {files.length > 0 && (
    //         <List dataSource={files} renderItem={(file, index) => (
    //           <List.Item actions={[<CloseCircleOutlined key="remove" onClick={() => handleRemoveFile(index)} style={{ color: "#888" }} />]}>
    //             <Text>{file.name}</Text>
    //           </List.Item>
    //         )} style={{ marginBottom: 16 }} />
    //       )}
    //       <div className="action-buttons" style={{ display: "flex", justifyContent: "space-between" }}>
    //         <Button onClick={handleCancel} className="bg-tertiary" style={{ width: "45%" }}>Cancel</Button>
    //         <Button type="primary" className="bg-secondary" onClick={handleSave} style={{ width: "45%" }}>Save</Button>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="right-images">
    //     <ImageContainer imageUrl="/images/auths/m5.jpg" />
    //   </div>
    // </div>

    <Form layout="horizontal" onFinish={handleSave} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
      <div className="main-doc-container">
        <div className="left-create-document">
          <div className="card-header bg-secondary create-doc-heading">
            <p style={{ margin: "0px", padding: "0px" }}>Create Document</p>
          </div>
          <div className="left-create-document-item">
            <Form.Item
              label={<span style={{ textAlign: "left" }}> Document Name </span>}
              name="documentName"
              rules={[{ required: true, message: "Document Name is required" }]}
              labelAlign="left"
              colon={false}
            >
              <Input
                placeholder="Document Name"
                value={documentName}
                style={{ marginBottom: "15px" }}
                onChange={(e) => setDocumentName(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ textAlign: "left" }}> Description </span>}
              name="description"
              rules={[{ required: true, message: "Description is required" }]}
              labelAlign="left"
              colon={false}
            >
              <TextArea
                rows={4}
                placeholder="Description"
                value={description}
                style={{ marginBottom: "15px" }}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ textAlign: "left" }}> Select Milestone </span>}
              name="milestone"
              rules={[{ required: true, message: "Milestone is required" }]}
              labelAlign="left"
              colon={false}
            >
              <Select
                placeholder="Select Milestone"
                value={milestone}
                onChange={setMilestone}
                style={{ marginBottom: "15px" }}
              >
                {milestones.map((option, index) => (
                  <Option key={index} value={option.moduleName}>
                    {option.moduleName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={<span style={{ textAlign: "left" }}> Upload Files </span>}
              name="files"
              rules={[{ required: files.length === 0, message: "Please upload at least one file" }]}
              labelAlign="left"
              colon={false}
            >
              <div
                {...getRootProps()}
                style={{
                  border: "2px dashed #d9d9d9",
                  padding: 16,
                  textAlign: "center",
                  borderRadius: 8,
                  cursor: "pointer",
                  marginBottom: "30px",
                  background: isDragActive ? "#f0f8ff" : "#fafafa",
                }}
              >
                <input {...getInputProps()} />
                <UploadOutlined style={{ fontSize: 32, color: "#1890ff" }} />
                <Text style={{ display: "block", marginTop: 8 }}>
                  {isDragActive
                    ? "Drop the files here..."
                    : "Drag and drop files here, or click to select files"}
                </Text>
              </div>
            </Form.Item>

            {files.length > 0 && (
              <List
                dataSource={files}
                renderItem={(file, index) => (
                  <List.Item
                    actions={[
                      <CloseCircleOutlined
                        key="remove"
                        onClick={() => handleRemoveFile(index)}
                        style={{ color: "#888" }}
                      />,
                    ]}
                  >
                    <Text>{file.name}</Text>
                  </List.Item>
                )}
              />
            )}

            <div className="action-buttons" style={{ display: "flex", justifyContent: "space-between" }}>
              <Button onClick={handleCancel} className="bg-tertiary" style={{ width: "45%" }}>
                Cancel
              </Button>
              <Button type="primary" className="bg-secondary" htmlType="submit" style={{ width: "45%" }}>
                Save
              </Button>
            </div>
          </div>
        </div>
        <div className="right-images">
          <ImageContainer imageUrl="/images/auths/m5.jpg" />
        </div>
      </div>
    </Form>

  );
};

export default CreateDocument;
