'use client';

import Image from 'next/image';
import Link from 'next/link';
import iphone from '@/public/img/iphone.png'; // Make sure the path is correct

export default function Footer() {
  return (
    <footer className="footer-area section-gap">
      <div className="container">
        <div className="row">
          {/* Column 1 */}
          <div className="col-lg-3 col-md-6 single-footer-widget">
            <h4>Important Links</h4>
            <ul>
              <li><Link href="/terms-conditions">Terms and Conditions</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/cancellation-policy">Cancellation Policy</Link></li>
              <li><Link href="/shipping-policy">Shipping Policy</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="col-lg-3 col-md-6 single-footer-widget">
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/aboutus">About Us</Link></li>
              <li><Link href="/search">Search Providers</Link></li>
              
            </ul>
          </div>

          {/* Column 3 */}
          <div className="col-lg-3 col-md-6 single-footer-widget">
            <h4>User Login</h4>
            <ul>
              <li><Link href="#">User Login</Link></li>
              <li><Link href="#">Insurer Login</Link></li>
              <li><Link href="#">Admin Login</Link></li>
              <li><Link href="#">Doctor Login</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          

          {/* Newsletter Column */}
          <div className="col-lg-3 col-md-6 single-footer-widget">
            <h4>Newsletter</h4>
            <p>You can trust us. We only send promo offers.</p>
            <div className="form-wrap" id="mc_embed_signup">
              <form
                target="_blank"
                action="https://spondonit.us12.list-manage.com/subscribe/post?u=1462626880ade1ac87bd9c93a&amp;id=92a4423d01"
                method="get"
                className="form-inline"
              >
                <input
                  className="form-control"
                  name="EMAIL"
                  placeholder="Your Email Address"
                  required
                  type="email"
                />
                <button className="click-btn btn btn-default" type="submit">
                  <span className="lnr lnr-arrow-right"></span>
                </button>
                <div style={{ position: 'absolute', left: '-5000px' }}>
                  <input name="b_36c4fd991d266f23781ded980_aefe40901a" tabIndex={-1} defaultValue="" type="text" />
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom row align-items-center mt-4">
          <p className="footer-text m-0 col-lg-6 col-md-12">
            &copy; {new Date().getFullYear()} All rights reserved 
          </p>
          <div className="col-lg-6 col-md-6 social-link">
            <div className="download-button d-flex flex-row justify-content-end">
              <div className="buttons gray d-flex flex-row align-items-center">
                <i className="fa fa-apple" aria-hidden="true"></i>
                <div className="desc ms-2">
                  <a href="#">
                    <p>
                      <span>Available</span> <br /> on App Store
                    </p>
                  </a>
                </div>
              </div>
              <div className="buttons gray d-flex flex-row align-items-center ms-3">
                <i className="fa fa-android" aria-hidden="true"></i>
                <div className="desc ms-2">
                  <a href="#">
                    <p>
                      <span>Available</span> <br /> on Play Store
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
