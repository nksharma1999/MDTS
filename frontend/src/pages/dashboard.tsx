import { Typography, Box } from "@mui/material";
import Hero from "./Hero";

const Dashboard = () => {
    return (
        <>
            <Hero />
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100vh"
                bgcolor="#f5f5f5"
            >
                <Typography variant="h3" fontWeight="bold">Welcome to Mining Project</Typography>
                <Typography variant="body1" color="textSecondary" marginTop={2}>Efficient Mining Management System</Typography>
            </Box>
        </>
    );
};

export default Dashboard;
