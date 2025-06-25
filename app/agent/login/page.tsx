"use client"
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image";
import Header from "@/app/Components/Header";
import LoginComponent from '@/app/Components/Login';
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
						<LoginComponent redirection={true} logintype="Agent"/>
						 
					</div>
                    <div className="col-md-5 right-part">
						<a href="/">home</a>
						<span className="fa fa-caret-right"></span>
						<a href="/agent/login">Partner Login</a>
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
