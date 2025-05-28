"use client"
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image";
import Header from "@/app/Components/Header";

import Footer from "@/app/Components/Footer";
import Link from "next/link";

export default function Login() {
   const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await signIn('credentials', {
      redirect: false,
      mobile,
      password,
    })

    if (res?.ok) {
      router.push('/dashboard') // your protected page
    } else {
      alert('Invalid credentials')
    }
  }

  return (
    <>
    <Header/>
    <section className="banner-area">
		<div className="container">
			<div className="row banner-content">
				<div className="col-lg-12 d-flex align-items-center justify-content-between">
					<div className="row">
                    <div className="col-md-7">
						<form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-12 form-group"><h3>Login</h3></div>
                                <div className="col-md-12 form-group">
                                    <label>Enter Mobile Number</label>
                                    <input type="text" name="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} className="form-control"></input>
                                </div>
                                <div className="col-md-12 form-group">
                                    <label>Enter Password</label>
                                    <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control"></input>
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
