import Image from "next/image";
import Header from "../Components/Header";
import Banner from "../Components/Banner";
import About from "../Components/About";
import Associates from "../Components/Associates";
import Testimonials from "../Components/Testimonials";
import Footer from "../Components/Footer";

export default function Aboutus() {
  return (
    <>
    <Header/>
    <section className="banner-area ">
		<div className="container=-fluid banner">
			<div className="row banner-content">
				<div className="col-lg-12 d-flex align-items-center justify-content-between">
					
					<div className="right-part breadcrumbs">
						<a href="/">Home</a>
						<span className="fa fa-caret-right"></span>
						<a href="/aboutus">About</a>
					</div>
				</div>
			</div>
		</div>
		
	</section>
	<section className="feature-area mt-5">
		<div className="container">
			<div className="row d-flex justify-content-center">
				<div className="col-lg-8">
					<div className="section-title text-center">
						<h2>About Us</h2>
						<p>Smart Health is your trusted healthcare platform, making it easy to find and book top doctors and diagnostic labs. Our mission is to simplify healthcare access, empowering you to make informed decisions — quickly, securely, and with confidence. With Smart Health, quality care is always within reach.
						</p>
					</div>
				</div>
			</div>
		 
		</div>
	</section>
    <section className="feature-area mt-5">
		<div className="container">
			<div className="row d-flex justify-content-center">
				<div className="col-lg-6">
					<div className="section-title text-center">
						<h2>What We Do?</h2>
						<p>What we are providing to our subscribers.
						</p>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-lg-4 col-md-6">
					<div className="single-feature">
						<a href="#" className="title">
							<img src="/img/care.png" height={80}/>
							<h3>Better Care</h3>
						</a>
						 
					</div>
				</div>
				<div className="col-lg-4 col-md-6">
					<div className="single-feature">
						<a href="#" className="title">
							<img src="/img/tracking.png" height={80}/>
							<h3>Lowest Price</h3>
						</a>
						 
					</div>
				</div>
				<div className="col-lg-4 col-md-6">
					<div className="single-feature">
						<a href="#" className="title">
							<img src="/img/assured_health.png" height={80}/>
							<h3>Assured Health</h3>
						</a>
						 
					</div>
				</div>

			</div>
		</div>
	</section>
  <About/>
   
  <Footer/>
    </>
  );
}
