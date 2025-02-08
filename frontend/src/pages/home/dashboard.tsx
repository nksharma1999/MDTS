import { Button, Typography, Box } from "@mui/material";

const Dashboard = () => {
    return (
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
            <Box marginTop={3}>
                <Button variant="contained" color="primary" href="/signin" sx={{ marginRight: 2 }}>
                    Sign In
                </Button>
                <Button variant="contained" color="success" href="/register">
                    Register
                </Button>
            </Box>
        </Box>
    );
};

export default Dashboard;
