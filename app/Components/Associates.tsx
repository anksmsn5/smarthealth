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
			<div className="row">
				<div className='col-md-3'>
					<img src="/associates/1.webp" className='img-fluid'/>
				</div>
				<div className='col-md-3'>
					<img src="/associates/2.webp" className='img-fluid'/>
				</div>
				<div className='col-md-3'>
					<img src="/associates/3.webp" className='img-fluid'/>
				</div>
				<div className='col-md-3'>
					<img src="/associates/4.webp" className='img-fluid'/>
				</div>
				<div className='col-md-3'>
					<img src="/associates/5.webp" className='img-fluid'/>
				</div>
				<div className='col-md-3'>
					<img src="/associates/6.webp" className='img-fluid'/>
				</div>

				<div className='col-md-3'>
					<img src="/associates/7.webp" className='img-fluid'/>
				</div>

				<div className='col-md-3'>
					<img src="/associates/8.webp" className='img-fluid'/>
				</div>
			</div>
		</div>
	</section>
  );
}
