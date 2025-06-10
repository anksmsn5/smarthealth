import Image from "next/image";
import Header from "../Components/Header";
import Banner from "../Components/Banner";
import About from "../Components/About";
import Associates from "../Components/Associates";
import Testimonials from "../Components/Testimonials";
import Footer from "../Components/Footer";

export default function CancellationPolicy() {
  return (
    <>
      <Header />
      <section className="banner-area">
        <div className="container">
          <div className="row banner-content">
            <div className="col-lg-12 d-flex align-items-center justify-content-between">
              <div className="left-part">
                <h1>Cancellation Policy</h1>
                <p>
                  <b>Smart Health </b> believes in helping its customers as far
                  as possible, and has therefore a liberal cancellation policy.
                  Under this policy
                </p>
              </div>
              <div className="right-part">
                <a href="/">home</a>
                <span className="fa fa-caret-right"></span>
                <a href="/cancellation-policy">Cancellation Policy</a>
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
                  <b>Order Cancellations:</b>
                  <p>
                    Cancellations will be considered only if the request is made
                    within 7 days of placing the order. However, cancellation
                    requests may not be entertained if the order has already
                    been communicated to our vendors/partners and the shipping
                    or service process has been initiated.
                  </p>
                </li>

                <li>
                  <b>Non-Cancellable Orders:</b>
                  <p>
                    Smart Health does not accept cancellation requests for
                    orders that are already in process, in transit, or
                    completed. However, a refund or replacement may be issued if
                    the customer provides sufficient proof that the quality of
                    the product/service delivered is not satisfactory.
                  </p>
                </li>

                <li>
                  <b>Improper Delivery or Inaccurate Results:</b>
                  <p>
                    If you experience improper delivery of services or receive
                    inaccurate results, please report the issue to our Customer
                    Service team. The complaint will be addressed only after
                    verification by the respective healthcare provider or
                    service expert. Such issues must be reported within 7 days
                    of receiving the service or result.
                  </p>
                </li>

                <li>
                  <b>Discrepancy in Service or Expectations:</b>
                  <p>
                    If you believe that the product or service received is not
                    as promised or does not meet your expectations, please
                    notify our Customer Service team within 7 days of receipt.
                    After reviewing your complaint, Smart Health will take an
                    appropriate and fair decision.
                  </p>
                </li>

                  <li>
                  <b>Refund Processing Time:</b>
                  <p>
                    If a refund is approved by Smart Health, it will be processed within 6–8 business days to the original payment method of the customer.
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
