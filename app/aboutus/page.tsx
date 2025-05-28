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
    <section className="banner-area">
		<div className="container">
			<div className="row banner-content">
				<div className="col-lg-12 d-flex align-items-center justify-content-between">
					<div className="left-part">
						<h1>
							About Us
						</h1>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore
							magna aliqua.
						</p>
					</div>
					<div className="right-part">
						<a href="index.html">home</a>
						<span className="fa fa-caret-right"></span>
						<a href="about.html">about</a>
					</div>
				</div>
			</div>
		</div>
		
	</section>
    <section className="feature-area section-gap-top">
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
							<span className="lnr lnr-book"></span>
							<h3>Better Care</h3>
						</a>
						 
					</div>
				</div>
				<div className="col-lg-4 col-md-6">
					<div className="single-feature">
						<a href="#" className="title">
							<span className="lnr lnr-book"></span>
							<h3>Lowest Price</h3>
						</a>
						 
					</div>
				</div>
				<div className="col-lg-4 col-md-6">
					<div className="single-feature">
						<a href="#" className="title">
							<span className="lnr lnr-book"></span>
							<h3>Assured Health</h3>
						</a>
						 
					</div>
				</div>

			</div>
		</div>
	</section>
  <About/>
  <Associates/>
  <Testimonials/>
  <Footer/>
    </>
  );
}
