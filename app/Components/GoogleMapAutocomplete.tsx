'use client';
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google: typeof google;
  }
}

export default function GoogleMapAutocomplete({
  onPlaceSelected,
}: {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocompleteReady, setAutocompleteReady] = useState(false);

  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    const loadGoogleScript = () => {
      if (document.getElementById('google-maps')) {
        setAutocompleteReady(true);
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-maps';
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBDGiOkN66dsD9vfXhO_GEg6JPpPVd5mDs&libraries=places`;
      script.async = true;
      script.onload = () => setAutocompleteReady(true);
      document.body.appendChild(script);
    };

    if (typeof window !== 'undefined') {
      loadGoogleScript();
    }
  }, []);

  useEffect(() => {
    if (!autocompleteReady || !window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current!, {
      types: ['geocode'],
      componentRestrictions: { country: 'in' },
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;

      const addressComponents = place.address_components;

      const getComponent = (type: string) =>
        addressComponents.find(comp => comp.types.includes(type))?.long_name || '';

      const cityVal = getComponent('locality') || getComponent('administrative_area_level_2');
      const stateVal = getComponent('administrative_area_level_1');
      const pinVal = getComponent('postal_code');

      setCity(cityVal);
      setState(stateVal);
      setPincode(pinVal);

      // Extract latitude and longitude
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();

      setLatitude(lat?.toString() || '');
      setLongitude(lng?.toString() || '');

      onPlaceSelected(place);
    });
  }, [autocompleteReady, onPlaceSelected]);

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter a location"
        className="form-control mb-2"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
          }
        }}
      />
      {/* Hidden fields */}
      <input type="hidden" name="city" value={city} />
      <input type="hidden" name="state" value={state} />
      <input type="hidden" name="pincode" value={pincode} />
      <input type="hidden" name="latitude" value={latitude} />
      <input type="hidden" name="longitude" value={longitude} />
    </>
  );
}
