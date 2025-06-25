'use client';

import Image from 'next/image';
import iphone from '@/public/img/iphone.png'; // adjust path if different
import Link from 'next/link';

export default function Associates() {
  return (
    <section className="screenshot-area section-gap-top">
		<div className="container">
			<div className="row d-flex justify-content-center">
				<div className="col-lg-6">
					<div className="section-title text-center">
						<h2>Our Associate</h2>
						
					</div>
				</div>
			</div>
		<div className="row justify-content-center">
  <div className="col-md-4">
    <img src="/associates/1.jpeg" className="img-fluid" alt="Logo" />
  </div>
</div>
		</div>
	</section>
  );
}
