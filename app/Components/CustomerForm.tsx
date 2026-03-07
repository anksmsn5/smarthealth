"use client";

import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { userRegister, settingsApi, logoUrl } from "@/lib/constants";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AppSettings {
  title: string;
  email: string;
  mobile: string;
  address: string;
  logo: string;
}

type FormFields = {
  id?: string | number;
  name: string;
  email: string;
  mobile: string;
  pincode: string;
  address: string;
  state: string;
  city: string;
  latitude: string | number;
  longitude: string | number;
  aadhaar_front?: File | null;
  aadhaar_back?: File | null;
  pan_card?: File | null;
  profile_photo?: File | null;
};

type CustomerFormProps = {
  referredby?: string | number;
  type: string | number;
  onClose?: () => void;
  onSuccess?: () => void;
  redirection?: boolean;
  customerData?: Partial<FormFields>;
};

const SETTINGS_KEY = "app_settings";

const CustomerForm: React.FC<CustomerFormProps> = ({
  referredby,
  type,
  onClose,
  onSuccess,
  customerData,
  redirection,
}) => {
  const router = useRouter();

  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [formData, setFormData] = useState<FormFields>({
    id: "",
    name: "",
    email: "",
    mobile: "",
    pincode: "",
    address: "",
    state: "",
    city: "",
    latitude: "",
    longitude: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showOtpScreen, setShowOtpScreen] = useState(false);

  // OTP State
  const [otpValues, setOtpValues] = useState(Array(4).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [userId, setUserId] = useState<string | number | null>(null);
  const [mobile, setMobile] = useState<string | number | null>(null);
  const [userType, setUserType] = useState<string | number | null>(null);

  /** Load Settings */
  useEffect(() => {
    const localData = localStorage.getItem(SETTINGS_KEY);
    const parsedLocalData: AppSettings | null = localData ? JSON.parse(localData) : null;
    setSettings(parsedLocalData);

    fetch(settingsApi)
      .then((res) => res.json())
      .then((json) => {
        if (json.status && json.data?.length > 0) {
          const newData = json.data[0];
          const isDifferent = JSON.stringify(parsedLocalData) !== JSON.stringify(newData);

          if (isDifferent) {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(newData));
            setSettings(newData);
          }
        }
      })
      .catch((err) => console.error("Error fetching settings:", err));
  }, []);

  /** Populate form in edit mode */
  useEffect(() => {
    if (customerData) {
      setFormData((prev) => ({
        ...prev,
        ...customerData,
      }));
    }
  }, [customerData]);

  useEffect(() => {
    const savedMobile = localStorage.getItem("register_mobile");
    if (savedMobile) {
      setMobile(savedMobile);
      setFormData((prev) => ({ ...prev, mobile: savedMobile }));
    }
  }, []);

  /** Auto-fill city/state from pincode */
  useEffect(() => {
  if (formData.pincode.length === 6) {
    console.log("Fetching for pincode:", formData.pincode);
    fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
        if (data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
          const postOffice = data[0].PostOffice[0];
          setFormData((prev) => ({
            ...prev,
            city: postOffice.District || "",
            state: postOffice.State || "",
          }));
        } else {
          toast.error("Invalid Pincode");
          setFormData((prev) => ({ ...prev, city: "", state: "" }));
        }
      })
      .catch((err) => {
        console.error("Pincode fetch error:", err);
        toast.error("Failed to fetch location from pincode");
      });
  }
}, [formData.pincode]);


  /** Handle input change */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /** Validation */
  const validate = () => {
    const newErrors: Partial<Record<keyof FormFields, string>> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email.";
    if (!formData.mobile.match(/^\d{10}$/)) newErrors.mobile = "Mobile must be 10 digits.";
    if (!formData.pincode.match(/^\d{6}$/)) newErrors.pincode = "Pincode must be 6 digits.";
    if (!formData.state.trim()) newErrors.state = "State is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** Submit Form */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setApiError(null);

    if (!validate()) return;

    setLoading(true);
    const otp = localStorage.getItem("secret_otp");
    try {
      const formPayload = new FormData();
      formPayload.append("type", String(type));
      formPayload.append("name", formData.name);
      formPayload.append("email", formData.email);
      formPayload.append("mobile", formData.mobile);
      formPayload.append("otp", otp ?? '');
      formPayload.append("pincode", formData.pincode);
      formPayload.append("address", formData.address);
      formPayload.append("state", formData.state);
      formPayload.append("city", formData.city);
      formPayload.append("latitude", String(formData.latitude));
      formPayload.append("longitude", String(formData.longitude));

      if (referredby && !isNaN(Number(referredby))) {
        formPayload.append("referredby", String(referredby));
      }

      // Attach files if available
      if (formData.aadhaar_front) formPayload.append("aadhaar_front", formData.aadhaar_front);
      if (formData.aadhaar_back) formPayload.append("aadhaar_back", formData.aadhaar_back);
      if (formData.pan_card) formPayload.append("pan_card", formData.pan_card);
      if (formData.profile_photo) formPayload.append("profile_photo", formData.profile_photo);

      const res = await fetch(userRegister, {
        method: "POST",
        body: formPayload,
      });

      const data = await res.json();
      if (!res.ok || data.status === false) {
        toast.error(data?.message || "Something went wrong.");
        return;
      }

      toast.success("Registration successful! Redirecting to dashboard.");
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("id", data.user.id);
        localStorage.setItem("type", data.user.type);
        localStorage.setItem("address", data.user.address);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("mobile", data.user.mobile);
        localStorage.setItem("state", data.user.state);
        localStorage.setItem("city", data.user.city);
        localStorage.setItem("pincode", data.user.pincode);
        localStorage.setItem("package", JSON.stringify(data.user?.package));

        if (redirection) {
           if (data.user.type == 7) {
            if (data.user.password_changed == "Yes") {
          router.push("/userpanel/dashboard");
            } else {
              router.push("/userpanel/create-password");
            }
          }

          if (data.user.type == 3) {
            router.push("/agent/dashboard");
          }
        } else {
          onSuccess?.();
          location.reload();
        }
   

    } catch (err) {
      console.error(err);
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /** OTP Handlers */
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    if (value && index < otpValues.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

 

   
  return (
    <>
       
          <form onSubmit={handleSubmit}>
         

            {!onClose && (
              <h3>
                Create {type === 3 ? "Agent" : type === 7 ? "Customer" : "User"} Account
              </h3>
            )}

            {/* Name */}
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <small className="text-danger">{errors.name}</small>}
            </div>

           <div className="row">
            <div className="form-group col-md-6">
              <label>Email</label>
              <input
                type="text"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <small className="text-danger">{errors.email}</small>}
            </div>

            {/* Mobile */}
            <div className="form-group col-md-6">
              <label>Mobile</label>
              <input
                type="text"
                name="mobile"
                className="form-control"
                value={formData.mobile}
                onChange={handleChange}
                maxLength={10}
              />
              {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
            </div>
</div>
            {/* Address */}
            <div className="form-group">
              <label>Address</label>
              <input
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            {/* Pincode & City */}
            <div className="row">
              <div className="col-md-4 form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  className="form-control"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength={6}
                />
                {errors.pincode && <small className="text-danger">{errors.pincode}</small>}
              </div>
              <div className="col-md- form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  value={formData.city}
                   onChange={handleChange}
                   
                />
              </div>
              <div className="form-group col-md-4">
              <label>State</label>
              <input
                type="text"
                name="state"
                className="form-control"
                value={formData.state}
                 onChange={handleChange}
                 
              />
            </div>
            </div>

            {/* State */}
            

           <div className="row">
            <div className="form-group col-md-6">
              <label>Aadhaar Front Photo</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    aadhaar_front: e.target.files?.[0] || null,
                  }))
                }
              />
            </div>

            {/* Aadhaar Back */}
            <div className="form-group col-md-6">
              <label>Aadhaar Back Photo</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    aadhaar_back: e.target.files?.[0] || null,
                  }))
                }
              />
            </div>

            {/* PAN Card */}
            <div className="form-group col-md-6">
              <label>PAN Card Photo</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pan_card: e.target.files?.[0] || null,
                  }))
                }
              />
            </div>

            {/* Profile Photo */}
            <div className="form-group col-md-6">
              <label>Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    profile_photo: e.target.files?.[0] || null,
                  }))
                }
              />
            </div>
 </div>
            {/* API Messages */}
            {apiError && <div className="text-danger">{apiError}</div>}
            {success && <div className="text-success">{success}</div>}

            <div className="text-center d-flex flex-column align-items-center gap-2">
              <button type="submit" className="btn btn-primary w-50 border border-white" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>
              <Link href="/user/login" className="btn btn-danger w-50 border border-white mt-1">
                Have account? Login
              </Link>
              {onClose && (
                <button type="button" className="btn btn-secondary ml-2" onClick={onClose}>
                  Close
                </button>
              )}
            </div>
          </form>
        </>
    
  );
};

export default CustomerForm;
