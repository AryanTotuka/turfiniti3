import React from 'react';
import { Link } from 'react-router-dom';
import cricketImg from '../assets/box cricket.jpg';
import footballImg from '../assets/box football.jpg';
import pickleballImg from '../assets/Screenshot 2026-06-23 151914.png';
import './Marquee.css';

const Marquee = () => {
    return (
        <section className="marquee-section">
            <div className="marquee-container">
                <div className="marquee-track">
                    {/* First set of images */}
                    <Link to="/venues" state={{ sport: 'Cricket' }} className="marquee-item">
                        <img src={cricketImg} alt="Cricket" />
                    </Link>
                    <Link to="/venues" state={{ sport: 'Football' }} className="marquee-item">
                        <img src={footballImg} alt="Football" />
                    </Link>
                    <Link to="/venues" state={{ sport: 'Pickleball' }} className="marquee-item">
                        <img src={pickleballImg} alt="Pickleball" />
                    </Link>
                    
                    {/* Second set for continuous loop */}
                    <Link to="/venues" state={{ sport: 'Cricket' }} className="marquee-item">
                        <img src={cricketImg} alt="Cricket" />
                    </Link>
                    <Link to="/venues" state={{ sport: 'Football' }} className="marquee-item">
                        <img src={footballImg} alt="Football" />
                    </Link>
                    <Link to="/venues" state={{ sport: 'Pickleball' }} className="marquee-item">
                        <img src={pickleballImg} alt="Pickleball" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Marquee;
