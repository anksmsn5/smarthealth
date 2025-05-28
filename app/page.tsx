import Image from "next/image";
import Header from "./Components/Header";
import Banner from "./Components/Banner";
import About from "./Components/About";
import Associates from "./Components/Associates";
import Testimonials from "./Components/Testimonials";
import Footer from "./Components/Footer";

export default function Home() {
  return (
    <>
    <Header/>
    <Banner/>
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
