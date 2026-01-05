import React from "react";
import "./HeroBanner.css";
import {assets} from '../assets/assets';

const HeroBanner = () => {
  return (
    <section className="hero-wrapper">

      {/* TOP GRID */}
      <div className="hero-top">

        {/* LEFT BIG IMAGE */}
        <div className="hero-card hero-large">
          <img src={assets.hero_main} alt="Main Hero" />
          <div className="hero-overlay center">
            <h1>Tiny Million Collections</h1>
            <p>Tiny Million - The collection of treasure</p>
             <button className="shop-btn">GO TO SHOP →</button>

          </div>
        </div>

        {/* RIGHT STACK */}
        <div className="hero-right">

          <div className="hero-card hero-small">
            <img src={assets.hero_right_top} alt="Additions" />
            <div className="hero-overlay">
              <span className="tag">FREE SHIPPING</span>
              <h3>Additions</h3>
              <a href="/">VIEW PRODUCT →</a>
            </div>
          </div>

          <div className="hero-card hero-small">
            <img src={assets.hero_right_bottom} alt="Offers" />
            <div className="hero-overlay">
              <span className="tag">BIG DISCOUNT</span>
              <h3>Offer Zone</h3>
              <a href="/">GRAB OFFERS →</a>
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM FULL WIDTH IMAGE */}
      <div className="hero-bottom">
        <div className="hero-card hero-wide">
          <img src={assets.hero_bottom} alt="Bottom Banner" />
          <div className="hero-overlay left">
            <span className="tag">GLOBAL IDEAS</span>
            <h2>Looking for Inspirations with wild Florals?</h2>
            <a href="/">START SHOPPING →</a>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroBanner;