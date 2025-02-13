import React from "react";
import "../styles/sign-in.css"
import { Box, Button, Container, TextField, Typography, Paper, Card, CardMedia, Grid } from "@mui/material";
const images = [
    "../public/images/auths/m5.jpg",
    "../public/images/auths/m6.jpg",
    "../public/images/auths/m7.jpg",
    "../public/images/auths/m8.jpg",
];

const SignIn: React.FC = () => {
    return (
        <Container
            component="main"
            sx={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                m: 0,
                p: 0,
                paddingLeft: "0 !important",
                paddingRight: "0 !important",
                maxWidth: "none !important"
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    height: "100vh",
                    borderRadius: 0,
                    m: 0,
                    background: "linear-gradient(135deg, #257180 20%, #e33b28 60%, #257180 80%)",
                    color: "#e0e0e0"
                }}
            >
                <Box sx={{ flex: 0.4, p: 4, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <Typography variant="h4" fontWeight="bold" color="#fff" sx={{ marginBottom: 4, fontSize: "30px" }}>
                        Mine Development Tracking System
                    </Typography>
                    <Typography variant="h5" fontWeight="normal" color="#fff" sx={{ marginBottom: 2 }}>
                        Sign in to your account
                    </Typography>

                    <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="Enter your email address"
                            variant="outlined"
                            fullWidth
                            sx={{
                                backgroundColor: "#333",
                                borderColor: "#999",
                                color: "#fff",
                                "& .MuiInputBase-root": { color: "#fff" },
                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#999" },
                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#e33b28" },
                                "& .MuiInputLabel-root": { color: "#fff !important" },
                                "& .MuiInputBase-input": { color: "#fff" },
                                "& .MuiOutlinedInput-input": { color: "#fff" },
                                "& .MuiInputBase-input::placeholder": { color: "#888" },
                                borderRadius: "5px !important",
                            }}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            sx={{
                                backgroundColor: "#333",
                                borderColor: "#999",
                                color: "#fff",
                                "& .MuiInputBase-root": { color: "#fff" },
                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#999" },
                                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#e33b28" },
                                "& .MuiInputLabel-root": { color: "#fff !important" },
                                "& .MuiInputBase-input": { color: "#fff" },
                                "& .MuiOutlinedInput-input": { color: "#fff" },
                                "& .MuiInputBase-input::placeholder": { color: "#888" },
                                borderRadius: "5px !important",
                            }}
                        />

                        <Typography color="#e0e0e0">
                            By signing in, you agree to our <span style={{ color: "#e33b28", cursor: "pointer", textDecoration: "none", transition: "text-decoration 0.3s ease", fontWeight: "bold" }}
                                onMouseOver={(e) => e.currentTarget.style.textDecoration = "underline"} onMouseOut={(e) => e.currentTarget.style.textDecoration = "none"}>Terms & Conditions</span> and
                            <span style={{ color: "#e33b28", cursor: "pointer", textDecoration: "none", transition: "text-decoration 0.3s ease", fontWeight: "bold" }}
                                onMouseOver={(e) => e.currentTarget.style.textDecoration = "underline"} onMouseOut={(e) => e.currentTarget.style.textDecoration = "none"}> Privacy Policy</span>
                        </Typography>

                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#e33b28",
                                ":hover": { backgroundColor: "#c53020" },
                                color: "#fff",
                                borderRadius: "8px",
                                fontWeight: "bold"
                            }}
                            fullWidth
                        >
                            Login
                        </Button>

                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                            <Typography variant="body2" color="#e0e0e0" sx={{ cursor: "pointer", textDecoration: "none", "&:hover": { color: "#e33b28" } }} onMouseOver={(e) => e.currentTarget.style.textDecoration = "underline"} onMouseOut={(e) => e.currentTarget.style.textDecoration = "none"}>
                                Forgot Password?
                            </Typography>
                        </Box>
                    </Box>

                    <Typography align="center" color="#fff" sx={{ my: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ flex: 1, borderBottom: '1px solid #fff', marginRight: 2 }} />
                        OR
                        <Box sx={{ flex: 1, borderBottom: '1px solid #fff', marginLeft: 2 }} />
                    </Typography>

                    <div className="button-container">
                        <Button variant="outlined" fullWidth className="google-btn">Google</Button>
                        <Button variant="outlined" fullWidth className="microsoft-btn">Microsoft</Button>
                        <Button variant="outlined" fullWidth className="otp-btn">OTP</Button>
                    </div>

                </Box>

                <Box
                    sx={{
                        flex: 0.6,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 1,
                        paddingTop: "2.2em",
                        paddingRight: "1.5em",
                        paddingBottom: "1em",
                        boxSizing: "border-box"
                    }}
                >
                    <Grid container sx={{ width: "100%", height: "100%" }} spacing={2}>
                        {images.map((image, index) => (
                            <Grid item xs={6} key={index} sx={{ height: "50%" }}>
                                <Card
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        height: "100%",
                                        width: "100%",
                                        borderRadius: "10px",
                                        boxShadow: 5,
                                        transition: "transform 0.3s ease-in-out",
                                        "&:hover": { transform: "scale(1.02)", boxShadow: 10 },
                                        marginBottom: index === 1 || index === 0 ? 2 : 0,
                                        marginRight: index === 0 || index === 2 ? 2 : 0,
                                        backgroundColor: "#333"
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        alt={`Image ${index + 1}`}
                                        image={image}
                                        sx={{ objectFit: "cover", height: "100%", width: "100%", padding: 0 }}
                                    />
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Paper>
        </Container >
    );
};

export default SignIn;
