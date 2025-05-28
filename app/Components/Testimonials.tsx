'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

const testimonials = [1, 2, 3, 4];

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
          {testimonials.map(id => (
            <SwiperSlide key={id}>
              <div className="testi-item text-center" >
                <img src="/img/quote.png" alt="Quote" className="mx-auto mb-4" />
                <h4>Fanny Spencer</h4>
              
                <p>
                  As conscious traveling paupers, we must always be concerned about our dear Mother Earth.
                  You travel across her face <br /> and she is the host to your journey.
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        
      </div>
    </section>
  );
}
