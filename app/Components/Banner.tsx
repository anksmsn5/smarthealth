'use client';
export default function Banner() {
   

  return (
    <section className="home-banner-area">
		<div className="container">
			<div className="row fullscreen d-flex align-items-center justify-content-between">
				<div className="home-banner-content col-lg-6 col-md-6">
					<h1>
						Your Health <br/> & Care 
					</h1>
					<p>Made Easy</p>
					<div className="download-button d-flex flex-row justify-content-start">
						<div className="buttons flex-row d-flex">
							<i className="fa fa-apple" aria-hidden="true"></i>
							<div className="desc">
								<a href="#">
									<p>
										<span>Available</span> <br/>
										on App Store
									</p>
								</a>
							</div>
						</div>
						<div className="buttons dark flex-row d-flex">
							<i className="fa fa-android" aria-hidden="true"></i>
							<div className="desc">
								<a href="#">
									<p>
										<span>Available</span> <br/>
										on Play Store
									</p>
								</a>
							</div>
						</div>
					</div>
				</div>
				<div className="banner-img col-lg-4 col-md-6">
					<img className="img-fluid" src="img/app1.jpg" alt=""/>
				</div>
			</div>
		</div>
	</section>
  );
}
