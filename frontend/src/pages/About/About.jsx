import React from 'react'
import './About.css'

const About = () => {
	return (
		<div className='about-page'>
			<div className="about-hero">
				<h1>About Us</h1>
				<p>Passionate about good food and great service.</p>
			</div>
			<div className="about-content">
				<section>
					<h2>Our Mission</h2>
					<p>At Tomato, our mission is simple: to deliver fresh, delicious, and high-quality food straight to your doorstep. We believe that dining should be an experience, whether you're at a five-star restaurant or in the comfort of your own home.</p>
				</section>
				<section>
					<h2>Who We Are</h2>
					<p>Founded in 2024, Tomato started as a small team of food enthusiasts who wanted to bridge the gap between local chefs and hungry customers. Today, we partner with hundreds of top-rated restaurants to bring you a diverse menu that caters to every palate.</p>
				</section>
				<section>
					<h2>Our Promise</h2>
					<p>We are committed to sustainability, timely deliveries, and maintaining the highest hygiene standards. Your satisfaction is our top priority.</p>
				</section>
			</div>
		</div>
	)
}

export default About
