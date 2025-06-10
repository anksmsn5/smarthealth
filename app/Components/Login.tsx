'use client';

import Image from 'next/image';
import Link from 'next/link';
import iphone from '@/public/img/iphone.png';
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast';
import { userLogin } from '@/lib/constants';
interface LoginProps {
  redirection: boolean;
  logintype: string;
  onSuccess?: () => void;

}

export default function Login({ redirection, onSuccess, logintype }: LoginProps) {
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // start loader
    const type = logintype === 'User' ? 7 : 3;
    try {
      const response = await fetch(userLogin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password,type })
      });

      const data = await response.json();

      if (response.ok) {

        localStorage.setItem('name', data.user.name);
        localStorage.setItem('id', data.user.id);
        localStorage.setItem('type', data.user.type);
        
        if (redirection) {
          if(data.user.type==7)
          {
            alert(data.user.type);
            router.push('/userpanel/dashboard');
          }

          if(data.user.type==3)
            {
              alert(data.user.type);
              router.push('/agent/dashboard');
            }
          
        }
        else {
          onSuccess?.();
          location.reload();
        }
      } else {
        toast.error(data?.message || "Invalid Credentials.");
      }
    } catch (error) {
      toast.error("Invalid Credentials.");
      console.error(error);
    } finally {
      setLoading(false); // stop loader
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-12 form-group"><h3>{logintype} Login</h3></div>
        <div className="col-md-12 form-group">
          <label>Enter Mobile Number</label>
          <input type="text" name="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} className="form-control"></input>
        </div>
        <div className="col-md-12 form-group">
          <label>Enter Password</label>
          <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control"></input>
        </div>
        <div className="col-md-12 form-group">
          <input
            type="submit"
            className="btn btn-primary"
            value={loading ? "Logging in..." : "Login"}
            disabled={loading}
          />
        </div>
        
      </div>
    </form>
  );
}
