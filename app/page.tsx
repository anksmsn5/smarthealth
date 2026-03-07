import Image from "next/image";
import Header from "./Components/Header";
import Banner from "./Components/Banner";
import About from "./Components/About";
import Associates from "./Components/Associates";
import Testimonials from "./Components/Testimonials";
import Footer from "./Components/Footer";
import Packages from "./Components/Packages";

export default function Home() {
  return (
    <>
    <Header/>
    <Banner/>
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
  {/* <div className="bg-primary text-white py-4 w-100">
  <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
    <div className="text-center text-md-start mb-3 mb-md-0">
      <h2 className="fw-bold mb-1 text-white" style={{ fontSize: "1.8rem", fontStyle: "italic" }}>
       Need Assistance? — We are happy to help you!
      </h2>
    </div>
    <div className="text-center text-md-end">
      <p className="fs-4 mb-0 text-white" style={{ fontSize: "1.8rem", fontStyle: "italic" }}>
        📞 <strong>+91-9876543210</strong>
      </p>
    </div>
  </div>
</div> */}


  <Associates/>
  
  <Testimonials/>
  <Footer/>
    </>
  );
}
