'use client';
import Image from "next/image";
import Header from "../Components/Header";
import GoogleMapAutocomplete from "../Components/GoogleMapAutocomplete";
import Footer from "../Components/Footer";
import { useState } from "react";
import { search } from "@/lib/constants";

export default function Search() {
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    console.log(place);
    setSelectedPlace(place);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category) {
      alert("Please select a category");
      return;
    }

    if (!selectedPlace || !selectedPlace.geometry?.location) {
      alert("Please select a valid location");
      return;
    }

    const lat = selectedPlace.geometry.location.lat();
    const lng = selectedPlace.geometry.location.lng();

    const postData = {
      category,
      keyword,
      latitude: lat,
      longitude: lng,
    };

    try {
      const response = await fetch(search, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Search results:", data);
      setResults(data.results || []);
      // TODO: do something with the data, e.g. show results on page

    } catch (error) {
      console.error("Error searching providers:", error);
      alert("Failed to perform search. Please try again.");
    }
  };

  return (
    <>
      <Header/>
      <section className="banner-area">
        <div className="container">
          <div className="row banner-content">
            <div className="col-lg-12 d-flex align-items-center justify-content-between">
              <div className="left-part">
                <h1>Search Providers</h1>
                <p>Feel free to search the service as per your desire. We will provide you the best.</p>
              </div>
              <div className="right-part">
                <a href="/">home</a>
                <span className="fa fa-caret-right"></span>
                <a href="/search">Search Providers</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="">
        <div className="container">
          <div className="row">
            <div className="col-md-10 mx-auto">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="form-group col-md-4">
                    <label>Enter Location</label>
                    <GoogleMapAutocomplete onPlaceSelected={handlePlaceSelected} />
                  </div>

                  <div className="form-group col-md-3">
                    <label>Select Category</label>
                    <select
                      name="category"
                      className="form-control"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Pathology">Pathology</option>
                    </select>
                  </div>

                  <div className="form-group col-md-3">
                    <label>Enter Keywords</label>
                    <input
                      type="text"
                      className="form-control"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                  </div>

                  <div className="form-group col-md-2 d-flex align-items-end">
                    <button type="submit" className="btn btn-primary w-100">
                      <i className="fa fa-search"></i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="container">
        <div className="row mt-5">
            {results.length === 0 && (
              <div className="col-12 text-center text-muted">
                No results found. Try searching!
              </div>
            )}
            {results.map((item) => (
              <div key={item.user_id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  {/* Thumbnail placeholder */}
                  <Image
                    src="/doctor.jpg" // You can replace this with a real user image URL if available
                    className="card-img-top"
                    alt={item.user_name}
                    width={350}
                    height={200}
                    style={{ objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.user_name}</h5>
                    <p className="card-text">
                      <strong>Address:</strong> {item.address}<br />
                      <strong>Distance:</strong> {item.distance.toFixed(2)} km
                    </p>
                  </div>
                  <div className="card-footer text-center">
                    <a href={`https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                      View on Map
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer/>
    </>
  );
}
