import React from 'react';
import '../styles/not-found.css';

const NotFound: React.FC = () => {
    return (
        <div className="center">
            <div className="error">
                <div className="number">4</div>
                <div className="illustration">
                    <div className="circle"></div>
                    <div className="clip">
                        <div className="paper">
                            <div className="face">
                                <div className="eyes">
                                    <div className="eye eye-left"></div>
                                    <div className="eye eye-right"></div>
                                </div>
                                <div className="rosyCheeks rosyCheeks-left"></div>
                                <div className="rosyCheeks rosyCheeks-right"></div>
                                <div className="mouth"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="number">4</div>
            </div>

            <div className="text">Oops. The page you're looking for doesn't exist.</div>
            <a className="button" href="/home">Back Home</a>
        </div>
    );
}

export default NotFound;
