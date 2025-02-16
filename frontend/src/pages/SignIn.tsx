import React, { useState } from "react";
import "../styles/sign-in.css";
import { Input, Button, Typography, Row, Col, message } from "antd";
import { Card, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";

const images = [
    "../public/images/auths/m5.jpg",
    "../public/images/auths/m6.jpg",
    "../public/images/auths/m7.jpg",
    "../public/images/auths/m8.jpg",
];

const { Title, Text } = Typography;

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dummyUsers = [
        { id: 1, email: "admin@simpro.in", password: "admin", role: "Administrator", company: "Coal India Limited", name: "Admin" },
        { id: 4, email: "test@simpro.in", password: "test", role: "Mining Engineer", company: "NMDC Limited", name: "Test" }
    ];

    const handleLogin = () => {
        const user = dummyUsers.find(user => user.email === email && user.password === password);
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));

            message.success("Login Successful!");
            setTimeout(() => {
                navigate("/home");
            }, 1000);
        } else {
            message.error("Invalid Email or Password");
        }
    };

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: 0,
                padding: 0,
                maxWidth: "100%"
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    height: "100vh",
                    borderRadius: 0,
                    margin: 0,
                    background: "linear-gradient(135deg, #257180 20%, #e33b28 60%, #257180 80%)",
                    color: "#e0e0e0"
                }}
            >
                <div style={{ flex: 0.4, padding: 32, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <Title level={3} style={{ color: "#fff", marginBottom: 24, fontSize: "30px" }}>
                        Mine Development Tracking System
                    </Title>
                    <Title level={4} style={{ color: "#fff", marginBottom: 16 }}>
                        Sign in to your account
                    </Title>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <Input placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Input.Password placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                        <Text style={{ color: "#e0e0e0" }}>
                            By signing in, you agree to our <span style={{ color: "#e33b28", cursor: "pointer", textDecoration: "none", transition: "text-decoration 0.3s ease", fontWeight: "bold" }}
                                onMouseOver={(e) => e.currentTarget.style.textDecoration = "underline"} onMouseOut={(e) => e.currentTarget.style.textDecoration = "none"}>Terms & Conditions</span> and
                            <span style={{ color: "#e33b28", cursor: "pointer", textDecoration: "none", transition: "text-decoration 0.3s ease", fontWeight: "bold" }}
                                onMouseOver={(e) => e.currentTarget.style.textDecoration = "underline"} onMouseOut={(e) => e.currentTarget.style.textDecoration = "none"}> Privacy Policy</span>
                        </Text>

                        <Button type="primary" onClick={handleLogin} style={{ backgroundColor: "#e33b28", borderColor: "#c53020", borderRadius: "8px", fontWeight: "bold" }}>
                            Login
                        </Button>

                        <Text style={{ color: "#e0e0e0", cursor: "pointer", textDecoration: "none" }}
                            onMouseOver={(e) => e.currentTarget.style.textDecoration = "underline"}
                            onMouseOut={(e) => e.currentTarget.style.textDecoration = "none"}>
                            Forgot Password?
                        </Text>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 16 }}>
                        <div style={{ flex: 1, borderBottom: '1px solid #fff', marginRight: 16 }} />
                        <Text style={{ color: "#fff" }}>OR</Text>
                        <div style={{ flex: 1, borderBottom: '1px solid #fff', marginLeft: 16 }} />
                    </div>

                    <div className="button-container" style={{ marginTop: 16 }}>
                        <Button type="default" block style={{ marginBottom: 8 }}>Google</Button>
                        <Button type="default" block style={{ marginBottom: 8 }}>Microsoft</Button>
                        <Button type="default" block>OTP</Button>
                    </div>

                </div>

                <div
                    style={{
                        flex: 0.6,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 16,
                        paddingTop: "2.2em",
                        paddingRight: "1.5em",
                        paddingBottom: "1em",
                        boxSizing: "border-box"
                    }}
                >
                    <div
                        style={{
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
                        <Row gutter={[16, 16]} style={{ width: "100%", height: "100%" }}>
                            {images.map((image, index) => (
                                <Col span={12} key={index} style={{ height: "50%" }}>
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
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
