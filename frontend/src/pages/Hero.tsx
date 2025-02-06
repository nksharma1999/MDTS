import { Container, Typography, Button, Grid } from "@mui/material"
import { useEffect, useState } from "react";
import "../styles/hero.css";
const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const images = [
        '../public/m1.jpg',
        '../public/m3.jpg',
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);
    return (
        <>
            <div className="carousel">
                <div className="carousel-wrapper">
                    <div className="carousel-image-container" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                        {images.map((image, index) => (
                            <div key={index} className="carousel-slide">
                                <img src={image} alt={`carousel-${index}`} className="carousel-image" />
                                <div className="gradient-overlay"></div>

                                {index === 0 && (
                                    <div className="animated-text-container" key={currentIndex}>
                                        <h4 className="small-title">Finding Treasures Beneath Every Rock<span></span></h4>
                                        <h1 className="main-heading">Golden Horizons In</h1>
                                        <div className="third-line">
                                            <button className="carousel-button px-5">Explore</button>
                                            <h1 className="minus-heading">Mines</h1>
                                            <p className="least-text">
                                                Attardi, G., Esuli, A., & Simi, M. (2004). Best bets, thousands of queries in search of a client.
                                                In Proceedings of the 13th international conference on World Wide Web, alternate track papers & posters.
                                                New York: ACM Press.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {index === 1 && (
                                    <div className="animated-text-container left-aligned" key={currentIndex}>
                                        <h4 className="small-title">Unearthing Wealth in the Depths<span></span></h4>
                                        <h1 className="main-heading">Dig Deeper Into</h1>
                                        <div className="third-line">
                                            <h1 className="minus-heading">Mines</h1>
                                            <p className="least-text">
                                                Attardi, G., Esuli, A., & Simi, M. (2004). Best bets, thousands of queries in search of a client.
                                                In Proceedings of the 13th international conference on World Wide Web, alternate track papers & posters.
                                                New York: ACM Press.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Container sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h3" fontWeight="bold">Mine Crypto Effortlessly</Typography>
                <Typography variant="h6" sx={{ mt: 2, opacity: 0.8 }}>
                    Join thousands of miners & start earning today.
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 3 }}>Start Mining Now</Button>

                <Grid container spacing={3} sx={{ mt: 5 }}>
                    <Grid item xs={12} sm={4}><Typography variant="h5">🔥 Hash Rate: 120 TH/s</Typography></Grid>
                    <Grid item xs={12} sm={4}><Typography variant="h5">👥 Users Online: 10,000+</Typography></Grid>
                    <Grid item xs={12} sm={4}><Typography variant="h5">💰 Total Earnings: 50 BTC</Typography></Grid>
                </Grid>
            </Container>
        </>
    )
}

export default Hero