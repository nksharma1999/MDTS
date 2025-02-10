import "../styles/image-container.css";

interface ImageContainerProps {
    imageUrl: string;
}

const ImageContainer = ({ imageUrl }: ImageContainerProps) => {
    return (
        <main className="custom-main">
            <div className="custom-card">
                <img src={imageUrl} alt="Card" />
                <div className="custom-card-content">
                    <h2>Card Heading</h2>
                    <p>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
                        exercitationem iste, voluptatum, quia explicabo laboriosam rem
                        adipisci voluptates cumque, veritatis atque nostrum corrupti ipsa
                        asperiores harum? Dicta odio aut hic.
                    </p>
                    <a href="#" className="custom-button bg-primary">
                        Find out more
                    </a>
                </div>
            </div>
        </main>
    );
};

export default ImageContainer;
