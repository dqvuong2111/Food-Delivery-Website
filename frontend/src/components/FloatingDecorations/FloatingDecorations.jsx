import React from 'react';
import Lottie from 'lottie-react';
import floatingBurger from '../../assets/animations/floating-burger.json';
import deliveryScooter from '../../assets/animations/delivery-scooter.json';
import './FloatingDecorations.css';

const FloatingDecorations = () => {
    return (
        <div className="floating-decorations">
            <div className="floating-item floating-burger-1">
                <Lottie
                    animationData={floatingBurger}
                    loop={true}
                    style={{ width: 80, height: 80 }}
                />
            </div>
            <div className="floating-item floating-burger-2">
                <Lottie
                    animationData={floatingBurger}
                    loop={true}
                    style={{ width: 60, height: 60 }}
                />
            </div>
            <div className="floating-item floating-scooter">
                <Lottie
                    animationData={deliveryScooter}
                    loop={true}
                    style={{ width: 120, height: 60 }}
                />
            </div>
        </div>
    );
};

export default FloatingDecorations;
