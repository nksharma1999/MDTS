import React, { useEffect, useState } from "react";
import "../styles/sign-in.css";
import { Input, Button, Typography, Row, Col, message } from "antd";
import { Card, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { db } from "../Utils/dataStorege.ts";
const images = [
    "../public/images/auths/m5.jpg",
    "../public/images/auths/m6.jpg",
    "../public/images/auths/m7.jpg",
    "../public/images/auths/m8.jpg",
];

const { Title, Text } = Typography;

const SignInSignUp: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [workEmail, setWorkEmail] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);

    const isProfileCompleted = (user: any) => {
        return (
            user.name &&
            user.company &&
            user.mobile &&
            user.designation &&
            user.email &&
            user.whatsapp &&
            user.profilePhoto &&
            user.password
        );
    };

    const handleLogin = async () => {
        const users = await db.getUsers();
        const user = users.find((user: any) => user.email === email && user.password === password);
        try {
            if (users) {
                localStorage.setItem("user", JSON.stringify(user));
                message.success("Login Successful!");
                const isProfileComplete = isProfileCompleted(user);
                setTimeout(() => {
                    navigate(isProfileComplete ? "/home" : "/profile");
                }, 1000);
            } else {
                message.error("Invalid Email or Password");
            }
        } catch (error: any) {
            message.error(error);
        }
    };

    const handleSignUp = async () => {
        if (!workEmail) {
            return message.error("Please fill all required fields");
        }
        const users = await db.getUsers();
        const emailExists = users.some((user: any) => user.email === workEmail);

        if (emailExists) {
            return message.error("Email already registered");
        }

        const password = workEmail.slice(0, 6);
        const newUser = {
            id: Date.now(),
            name: "",
            company: "",
            designation: "",
            mobile: "",
            email: workEmail,
            whatsapp: "",
            registeredOn: new Date().toISOString(),
            profilePhoto: "",
            password: password,
            isTempPassword: true,
            role: "Admin"
        };

        users.push(newUser);
        try {
            await db.addUsers(newUser);
        } catch (error: any) {
            message.error(error)
        }
        localStorage.setItem("user", JSON.stringify(newUser));
        message.success("Sign-up successful! Invite link sent. Please verify your account.");
        setTimeout(() => navigate("/profile"), 1000);
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

                    {!isSignUp ? (
                        <>
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

                                <Text style={{ color: "#e0e0e0", cursor: "pointer", textDecoration: "none" }}
                                    onClick={() => setIsSignUp(true)}
                                    onMouseOver={(e) => e.currentTarget.style.textDecoration = "underline"}
                                    onMouseOut={(e) => e.currentTarget.style.textDecoration = "none"}>
                                    New here? Sign up
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
                        </>
                    ) : (
                        <>
                            <Title level={4} style={{ color: "#fff", marginBottom: 16 }}>
                                Sign up for an account
                            </Title>

                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                <Input placeholder="Enter your work email" value={workEmail} onChange={(e) => setWorkEmail(e.target.value)} />
                                <Button type="primary" onClick={handleSignUp} style={{ backgroundColor: "#e33b28", borderColor: "#c53020", borderRadius: "8px", fontWeight: "bold" }}>
                                    Sign Up
                                </Button>

                                <Text style={{ color: "#e0e0e0", cursor: "pointer", textDecoration: "none" }}
                                    onClick={() => setIsSignUp(false)}
                                    onMouseOver={(e) => e.currentTarget.style.textDecoration = "underline"}
                                    onMouseOut={(e) => e.currentTarget.style.textDecoration = "none"}>
                                    Already have an account? Sign in
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
                        </>
                    )}
                </div>

                <div
                    style={{
                        flex: 0.6,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
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

export default SignInSignUp;
