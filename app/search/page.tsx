import Image from "next/image";
import Header from "../Components/Header";

import Footer from "../Components/Footer";

export default function Search() {
  return (
    <>
    <Header/>
    <section className="banner-area">
		<div className="container">
			<div className="row banner-content">
				<div className="col-lg-12 d-flex align-items-center justify-content-between">
					<div className="left-part">
						<h1>
							Search Providers
						</h1>
						<p>
							Feel free to search the service as per your desire. We will provide you the best.
						</p>
					</div>
					<div className="right-part">
						<a href="/">home</a>
						<span className="fa fa-caret-right"></span>
						<a href="/search">Search Providers</a>
					</div>
				</div>
			</div>
		</div>
		
	</section>
    <section className="feature-area section-gap-top">
		<div className="container">
            <div className="row">
                <div className="col-md-10 mx-auto">
                <form>
  <div className="row">
    <div className="form-group col-md-3">
      <label>Enter Location</label>
      <input type="text" className="form-control" />
    </div>

    <div className="form-group col-md-3">
      <label>Select Category</label>
      <select name="category" className="form-control">
        <option value="">Select</option>
      </select>
    </div>

    <div className="form-group col-md-4">
      <label>Enter Keywords</label>
      <input type="text" className="form-control" />
    </div>

    <div className="form-group col-md-2 d-flex align-items-end">
      <button type="submit" className="btn btn-primary w-100">
        <i className="fa fa-search"></i>
      </button>
    </div>
  </div>
</form>

                </div>
            </div>
        </div>
        </section>
 
  <Footer/>
    </>
  );
}
