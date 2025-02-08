import { AppBar, Toolbar, Typography, Button, Container, Box, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const LandingPage = () => {
    return (
        <Box sx={{ bgcolor: "#121212", minHeight: "100vh", color: "#fff" }}>
            {/* Top Strip */}
            <Box sx={{ bgcolor: "#1e1e1e", textAlign: "center", py: 1, position: "relative" }}>
                <Typography variant="body2">🔥 Limited-time offer: 20% extra mining speed on signup!</Typography>
                <CloseIcon sx={{ position: "absolute", right: 16, top: 8, cursor: "pointer" }} />
            </Box>

            {/* Navbar */}
            <AppBar position="static" sx={{ bgcolor: "#212121" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>CryptoMiner</Typography>
                    <Button color="inherit">Home</Button>
                    <Button color="inherit">Dashboard</Button>
                    <Button color="inherit">Pricing</Button>
                    <Button color="inherit">Contact</Button>
                    <Button color="inherit" variant="outlined" sx={{ ml: 2 }}>Login</Button>
                </Toolbar>
            </AppBar>

            {/* Hero Section */}
            <Container sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h3" fontWeight="bold">Mine Crypto Effortlessly</Typography>
                <Typography variant="h6" sx={{ mt: 2, opacity: 0.8 }}>
                    Join thousands of miners & start earning today.
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 3 }}>Start Mining Now</Button>

                {/* Live Stats */}
                <Grid container spacing={3} sx={{ mt: 5 }}>
                    <Grid item xs={12} sm={4}><Typography variant="h5">🔥 Hash Rate: 120 TH/s</Typography></Grid>
                    <Grid item xs={12} sm={4}><Typography variant="h5">👥 Users Online: 10,000+</Typography></Grid>
                    <Grid item xs={12} sm={4}><Typography variant="h5">💰 Total Earnings: 50 BTC</Typography></Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default LandingPage;
