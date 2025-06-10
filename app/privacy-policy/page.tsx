import Image from "next/image";
import Header from "../Components/Header";
import Banner from "../Components/Banner";
import About from "../Components/About";
import Associates from "../Components/Associates";
import Testimonials from "../Components/Testimonials";
import Footer from "../Components/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <section className="banner-area">
        <div className="container">
          <div className="row banner-content">
            <div className="col-lg-12 d-flex align-items-center justify-content-between">
              <div className="left-part">
                <h1>Privacy Policy</h1>
                <p>
                  Smart Health (“Smart Health”, “we”, “us”, or “our”) respects
                  the privacy of our users (“you” or “your”). This Privacy
                  Policy describes how we collect, use, disclose, and protect
                  your personal information when you access and use our website
                  (the “Website”) and our SaaS-based healthtech infrastructure
                  (the “Service”).
                </p>
              </div>
              <div className="right-part">
                <a href="/">home</a>
                <span className="fa fa-caret-right"></span>
                <a href="/terms-conditions">Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="feature-area2 section-gap-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <h4>Information We Collect</h4>

              <p>
                We collect several types of information from and about you when
                you use the Website and Service:
              </p>
              <p>
                <b>Personal Information:</b> This includes information that can
                be used to identify you directly, such as your name, email
                address, phone number, and postal address. We may collect this
                information when you create an account, contact us, or use
                certain features of the Service.
              </p>
              <p>
                <b>Usage Data:</b> We collect information about your activity on
                the Website and Service, such as the pages you visit, the
                features you use, and the time you spend on the Website and
                Service.
              </p>
              <p>
                <b>Device Information:</b> We collect information about the
                device you use to access the Website and Service, such as your
                device type, operating system, browser type, IP address, and
                device identifiers.
              </p>

              <h4>How We Use Your Information</h4>
              <p>We use your information to:</p>
              <ul className="listclass">
                <li>Provide and operate the Website and Service</li>
                <li>Process your requests and transactions</li>
                <li>
                  Send you important information about the Website and Service,
                  including updates, security alerts, and support messages
                </li>
                <li>
                  Communicate with you about your use of the Website and Service
                </li>
                <li>Monitor and improve the Website and Service</li>
                <li>Personalize your experience on the Website and Service</li>
                <li>Comply with legal and regulatory requirements</li>
              </ul>

              <h4 className="mt-2">Disclosure of Your Information</h4>
              <p>
                We may disclose your information to third-party service
                providers who help us operate the Website and Service. These
                service providers are obligated to protect your information and
                are only permitted to use it for the purposes we instruct them.
              </p>
              <p>
                We may also disclose your information if we are required to do
                so by law or in the good faith belief that such disclosure is
                necessary to:
              </p>

              <ul className="listclass">
                <li>Comply with a legal process</li>
                <li>
                  Protect the rights or safety of you, Smart Health, or others
                </li>
              </ul>

              <h4 className="mt-2">Data Retention</h4>
              <p>
                We will retain your information for as long as your account is
                active or as needed to provide you with the Website and Service.
                We may also retain your information for legal, regulatory, and
                audit purposes.
              </p>

              <h4>Your Choices</h4>
              <p>You have certain choices regarding your information:</p>

              <ul className="listclass">
                <li>
                  You can access and update your personal information through
                  your account settings.
                </li>
                <li>
                  You can unsubscribe from our marketing communications by
                  following the unsubscribe instructions in those
                  communications.
                </li>
              </ul>

              <h4 className="mt-2">Security</h4>
              <p>We take reasonable steps to protect your information from unauthorized access, disclosure, alteration, or destruction. However, no internet transmission or electronic storage is 100% secure.</p>

 <h4> Children’s Privacy</h4>
 <p>The Website and Service are not directed to children under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and you believe your child has provided us with personal information, please contact us.</p>


<h4>International Transfers</h4>
<p>Your information may be transferred to and processed in countries other than your own. These countries may have different data protection laws than your own country.</p>



<h4>Changes to this Privacy Policy</h4>
<p>We may update this Privacy Policy from time to time. We will post the updated Privacy Policy on the Website. You are advised to review this Privacy Policy periodically for any changes.</p>

<h4>Contact Us</h4>
<p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:contact@smarthealth.com">contact@smarthealth.com</a></p>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
