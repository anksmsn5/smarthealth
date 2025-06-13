"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { userRegister } from "@/lib/constants";
import { useRouter } from "next/navigation";
import GoogleMapAutocomplete from "./GoogleMapAutocomplete";

type FormFields = {
  id?: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirm_password: string;
};

type CustomerFormProps = {
  referredby?: string | number | undefined;
  type: string | number;
  onClose?: () => void;
  onSuccess?: () => void;
  redirection?: boolean;
  customerData?: Partial<FormFields> & {
    id?: number;
    address?: string;
    city?: string;
    state?: string;
    latitude?: number;
    longitude?: number;
  };
};

const CustomerForm: React.FC<CustomerFormProps> = ({
  referredby,
  type,
  onClose,
  onSuccess,
  customerData,
  redirection,
}) => {
  const [formData, setFormData] = useState<FormFields>({
    id: "",
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirm_password: "",
  });

  const [locationData, setLocationData] = useState<{
    latitude: number | null;
    longitude: number | null;
    city: string;
    address: string;
    state: string;
  }>({
    latitude: null,
    longitude: null,
    city: "",
    address: "",
    state: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (customerData) {
      setFormData({
        id: customerData.id,
        name: customerData.name || "",
        email: customerData.email || "",
        mobile: customerData.mobile || "",
        password: "",
        confirm_password: "",
      });

      setLocationData((prev) => ({
        ...prev,
        latitude: customerData.latitude ?? null,
        longitude: customerData.longitude ?? null,
        address: customerData.address ?? "",
        city: customerData.city ?? "",
        state: customerData.state ?? "",
      }));
    }
  }, [customerData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry || !place.address_components) return;

    const address = place.formatted_address || "";
    const latitude = place.geometry.location?.lat() ?? null;
    const longitude = place.geometry.location?.lng() ?? null;

    const cityComponent = place.address_components.find((c) =>
      c.types.includes("locality")
    );
    const stateComponent = place.address_components.find((c) =>
      c.types.includes("administrative_area_level_1")
    );

    setLocationData({
      latitude,
      longitude,
      address,
      city: cityComponent?.long_name || "",
      state: stateComponent?.long_name || "",
    });
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof FormFields, string>> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email.";
    if (!formData.mobile.match(/^\d{10}$/))
      newErrors.mobile = "Mobile must be 10 digits.";

    const isEditMode = !!customerData?.id;
    const hasPassword =
      formData.password.trim().length > 0 ||
      formData.confirm_password.trim().length > 0;

    if (!isEditMode || hasPassword) {
      if (formData.password.length < 6)
        newErrors.password = "Password must be at least 6 characters.";
      if (formData.password !== formData.confirm_password)
        newErrors.confirm_password = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setApiError(null);

    if (!validate()) return;

    setLoading(true);

    try {
      const payload: any = {
        ...formData,
        type,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        city: locationData.city,
        state: locationData.state,
        address: locationData.address,
      };

      if (referredby && !isNaN(Number(referredby))) {
        payload.referredby = Number(referredby);
      }

      const res = await fetch(userRegister, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.status === false) {
        toast.error(data?.message || "Something went wrong.");
        return;
      }

      toast.success("Registration successful!");

      if (referredby === "") {
        localStorage.setItem("name", data.data.name);
        localStorage.setItem("id", data.data.id);
        localStorage.setItem("type", data.data.type);
      }

      if (redirection) {
        if (data.data.type == 7) {
          router.push("/userpanel/dashboard");
        } else if (data.data.type == 3) {
          router.push("/agent/dashboard");
        }
      } else {
        onSuccess?.();
        location.reload();
      }

      onClose?.();
    } catch (err) {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        {!onClose && (
          <div className="col-md-12 form-group">
            <h3>
              Create {type === 3 ? "Agent" : type === 7 ? "Customer" : "User"} Account
            </h3>
          </div>
        )}

        {/* Name */}
        <div className="col-md-12 form-group">
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

        {/* Email */}
        <div className="col-md-12 form-group">
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
        <div className="col-md-12 form-group">
          <label>Mobile</label>
          <input
            type="text"
            name="mobile"
            className="form-control"
            value={formData.mobile}
            onChange={handleChange}
          />
          {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
        </div>

        {/* Google Autocomplete (only address input) */}
        <div className="col-md-12 form-group">
          <label>Address{referredby}</label>
          <GoogleMapAutocomplete onPlaceSelected={handlePlaceSelected} />
          {locationData.address && (
            <small className="form-text text-muted">{locationData.address}</small>
          )}
        </div>

        {/* City */}
        <div className="col-md-6 form-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            className="form-control"
            value={locationData.city}
            readOnly
          />
        </div>

        {/* State */}
        <div className="col-md-6 form-group">
          <label>State</label>
          <input
            type="text"
            name="state"
            className="form-control"
            value={locationData.state}
            readOnly
          />
        </div>

        {/* Password */}
        <div className="col-md-12 form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <small className="text-danger">{errors.password}</small>}
        </div>

        {/* Confirm Password */}
        <div className="col-md-12 form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirm_password"
            className="form-control"
            value={formData.confirm_password}
            onChange={handleChange}
          />
          {errors.confirm_password && (
            <small className="text-danger">{errors.confirm_password}</small>
          )}
        </div>

        {apiError && (
          <div className="col-md-12 form-group text-danger">{apiError}</div>
        )}
        {success && (
          <div className="col-md-12 form-group text-success">{success}</div>
        )}

        <div className="col-md-12 form-group">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          {onClose && (
            <button
              type="button"
              className="btn btn-secondary ml-5"
              onClick={onClose}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default CustomerForm;
