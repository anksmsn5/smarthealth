'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

const testimonials = [
  {
    name: "Priya S.",
    text: "Smart Health made booking my doctor’s appointment so simple! I found a great physician and had confirmation in minutes. Highly recommended."
  },
  {
    name: "Rahul K.",
    text: "I loved the transparency — I could see all the doctor’s details and ratings before choosing. Plus, the reminders kept me on track!"
  },
  {
    name: "Anita M.",
    text: "Being able to search for both doctors and labs in one place saved me so much time. Smart Health is my go-to platform for healthcare."
  }
];

export default function Testimonials() {
  return (
    <section className="testimonials-area section-gap-top">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-lg-6">
            <div className="section-title text-center">
              <h2>Testimonials</h2>
            </div>
          </div>
        </div>

        {/* === Main Slider === */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000 }}
          loop
          spaceBetween={30}
          slidesPerView={1}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="testi-item text-center">
                <img src="/img/quote.png" alt="Quote" className="mx-auto mb-4" />
                <h4>{testimonial.name}</h4>
                <p>{testimonial.text}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
