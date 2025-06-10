import Image from "next/image";
import Header from "../Components/Header";
import Banner from "../Components/Banner";
import About from "../Components/About";
import Associates from "../Components/Associates";
import Testimonials from "../Components/Testimonials";
import Footer from "../Components/Footer";

export default function ShippingPolicy() {
  return (
    <>
      <Header />
      <section className="banner-area">
        <div className="container">
          <div className="row banner-content">
            <div className="col-lg-12 d-flex align-items-center justify-content-between">
              <div className="left-part">
                <h1>Shipping Policy</h1>
                <p>
                  <b>Smart Health </b> believes in helping its customers as far
                  as possible, and has therefore a liberal Shipping policy.
                  Under this policy
                </p>
              </div>
              <div className="right-part">
                <a href="/">home</a>
                <span className="fa fa-caret-right"></span>
                <a href="/shipping-policy">Shipping Policy</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="feature-area2 section-gap-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <ul className="listclass">
                <li>
                  <b>Service Fulfillment:</b>
                  <p>
                   All service orders are fulfilled by our empaneled health providers through their qualified technicians, phlebotomists, or staff members.
                  </p>
                </li>

                <li>
                  <b>Product Shipping:</b>
                  <p>
                   All product orders are shipped via registered domestic courier companies and/or India Post Speed Post only.
                  </p>
                </li>

                <li>
                  <b>Shipping Timelines:</b>
                  <p>
                   Orders are typically shipped within 0–7 days, or as per the delivery timeline agreed upon at the time of order confirmation. Final delivery timelines are subject to courier or postal service norms.
                  </p>
                </li>

                <li>
                  <b>Responsibility for Delivery:</b>
                  <p>
                    Smart Health is not responsible for any delays caused by the courier or postal authorities. Our responsibility is limited to handing over the consignment to the designated courier or postal service within 0–7 days from the date of order and payment confirmation, or as per the agreed delivery date.


                  </p>
                </li>

                  <li>
                  <b>Shipping Address:</b>
                  <p>
                    All products will be delivered to the address provided by the buyer at the time of placing the order.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
