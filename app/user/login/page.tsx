import Image from "next/image";
import Header from "@/app/Components/Header";

import Footer from "@/app/Components/Footer";
import Link from "next/link";

export default function Login() {
  return (
    <>
    <Header/>
    <section className="banner-area">
		<div className="container">
			<div className="row banner-content">
				<div className="col-lg-12 d-flex align-items-center justify-content-between">
					<div className="row">
                    <div className="col-md-7">
						<form>
                            <div className="row">
                                <div className="col-md-12 form-group"><h3>Login</h3></div>
                                <div className="col-md-12 form-group">
                                    <label>Enter Mobile Number</label>
                                    <input type="text" name="mobile" className="form-control"></input>
                                </div>
                                <div className="col-md-12 form-group">
                                    <label>Enter Password</label>
                                    <input type="password" name="password" className="form-control"></input>
                                </div>
                                <div className="col-md-12 form-group">
                                    <input type="submit" className="btn btn-primary" value="Login"/>
                                </div>
                                <div className="col-md-12 form-group">
                                    <Link href="/user/register">Do not have account? Click to Login</Link>
                                </div>
                            </div>
                        </form>
					</div>
                    <div className="col-md-5 right-part">
						<a href="/">home</a>
						<span className="fa fa-caret-right"></span>
						<a href="/user/login">Login</a>
					</div>
					</div>
					
				</div>
			</div>
		</div>
		
	</section>
   
   
  <Footer/>
    </>
  );
}
