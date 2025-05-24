"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

// --- Types ---
interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  postalCode: string;
}

// --- Validation Helpers ---
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{8,15}$/;

function validateField(name: keyof CheckoutFormData, value: string): string | null {
  switch (name) {
    case "fullName":
      return value.trim() ? null : "Full Name is required.";
    case "email":
      if (!value.trim()) return "Email Address is required.";
      if (!emailRegex.test(value)) return "Please enter a valid email address.";
      return null;
    case "phone":
      if (!value.trim()) return "Phone Number is required.";
      if (!phoneRegex.test(value.replace(/\s+/g, ""))) return "Enter a valid phone number (8-15 digits).";
      return null;
    case "address1":
      return value.trim() ? null : "Address Line 1 is required.";
    case "city":
      return value.trim() ? null : "City is required.";
    case "postalCode":
      return value.trim() ? null : "Postal Code is required.";
    default:
      return null;
  }
}

const LOCAL_STORAGE_KEY = "karvanaCheckoutForm";

/** --- Progress Bar Steps --- */
function StepIndicator({ step, label, active }: { step: number; label: string; active?: boolean }) {
  return (
    <div className="flex flex-col items-center flex-1 min-w-0">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
          active ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        {step}
      </div>
      <span className={`mt-2 text-xm font-medium ${active ? "text-blue-600" : "text-gray-500"} truncate`}>
        {label}
      </span>
    </div>
  );
}
function StepConnector() {
  return <div className="flex-1 h-1 bg-gray-200 mx-2 rounded" />;
}

// --- Main Page Component ---
export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getCartTotal } = useCart();  // --- Form State ---

  function getInitialForm(): CheckoutFormData {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object") {
            return {
              fullName: parsed.fullName || "",
              email: parsed.email || "",
              phone: parsed.phone || "",
              address1: parsed.address1 || "",
              address2: parsed.address2 || "",
              city: parsed.city || "",
              postalCode: parsed.postalCode || "",
            };
          }
        } catch {}
      }
    }
    return {
      fullName: "",
      email: "",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      postalCode: "",
    };
  }

  const [form, setForm] = useState<CheckoutFormData>(getInitialForm);

  // Track touched fields for error display
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutFormData, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  // Save form data to localStorage on every change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(form));
    }
  }, [form]);

  // --- Validation on Change/Blur ---
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name as keyof CheckoutFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name as keyof CheckoutFormData, value),
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name as keyof CheckoutFormData, value),
    }));
  };

  // --- Form Validation ---
  const validateForm = (): Partial<Record<keyof CheckoutFormData, string>> => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
    (Object.keys(form) as (keyof CheckoutFormData)[]).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });
    return newErrors;
  };

  const isFormValid = () => {
    const validation = validateForm();
    return Object.values(validation).every((v) => !v);
  };

  // --- Handle Submit (Proceed to Payment) ---
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleProceed = (e: FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      address1: true,
      city: true,
      postalCode: true,
      address2: true,
    });
    const validation = validateForm();
    setErrors(validation);
    setSubmitAttempted(true);

    if (Object.values(validation).every((v) => !v) && cartItems.length > 0) {
      // For now, just log the data. Payment integration in next step.
      console.log("Checkout Data:", form);
      console.log("Cart:", cartItems);
      // router.push("/payment"); // To be implemented in next block
    }
  };

  // --- UI ---

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Secure Checkout</h1>

      {/* Breadcrumbs */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-blue-600">Home</Link>
          </li>
          <li>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </li>
          <li>
            <Link href="/shop" className="hover:text-blue-600">Shop</Link>
          </li>
          <li>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </li>
          <li>
            <Link href="/bag" className="hover:text-blue-600">Shopping Cart</Link>
          </li>
          <li>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </li>
          <li className="font-semibold text-gray-800">Checkout</li>
        </ol>
      </nav>      

      <div className="mb-8">
        <div className="flex items-center justify-between w-full max-w-2xl mx-auto">
          <StepIndicator step={1} label="Personal Details" active />
          <StepConnector />
          <StepIndicator step={2} label="Secure Checkout" />
          <StepConnector />
          <StepIndicator step={3} label="Order Confirmation" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* --- Left: Checkout Form --- */}
        <form
          className="md:col-span-2 bg-white p-8 rounded-lg shadow-md"
          autoComplete="off"
          onSubmit={handleProceed}
          noValidate
        >
          <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
          {/* Full Name */}
          <div className="mb-4">
            <label htmlFor="fullName" className="block font-medium mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={form.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.fullName && touched.fullName ? "border-red-500" : "border-gray-300"}`}
              required
            />
            {errors.fullName && touched.fullName && (
              <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.email && touched.email ? "border-red-500" : "border-gray-300"}`}
              required
            />
            {errors.email && touched.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label htmlFor="phone" className="block font-medium mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.phone && touched.phone ? "border-red-500" : "border-gray-300"}`}
              required
              inputMode="numeric"
              pattern="[0-9]*"
            />
            {errors.phone && touched.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Address Line 1 */}
          <div className="mb-4">
            <label htmlFor="address1" className="block font-medium mb-1">
              Address Line 1 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address1"
              id="address1"
              value={form.address1}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.address1 && touched.address1 ? "border-red-500" : "border-gray-300"}`}
              required
            />
            {errors.address1 && touched.address1 && (
              <p className="text-red-600 text-sm mt-1">{errors.address1}</p>
            )}
          </div>

          {/* Address Line 2 (Optional) */}
          <div className="mb-4">
            <label htmlFor="address2" className="block font-medium mb-1">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              name="address2"
              id="address2"
              value={form.address2}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* City */}
          <div className="mb-4">
            <label htmlFor="city" className="block font-medium mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              id="city"
              value={form.city}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.city && touched.city ? "border-red-500" : "border-gray-300"}`}
              required
            />
            {errors.city && touched.city && (
              <p className="text-red-600 text-sm mt-1">{errors.city}</p>
            )}
          </div>

          {/* Postal Code */}
          <div className="mb-4">
            <label htmlFor="postalCode" className="block font-medium mb-1">
              Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="postalCode"
              id="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.postalCode && touched.postalCode ? "border-red-500" : "border-gray-300"}`}
              required
            />
            {errors.postalCode && touched.postalCode && (
              <p className="text-red-600 text-sm mt-1">{errors.postalCode}</p>
            )}
          </div>

          {/* Country (Singapore, non-editable) */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Country</label>
            <input
              type="text"
              value="Singapore"
              disabled
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
              tabIndex={-1}
            />
          </div>
          {/* Actions */}
          <div className="flex items-center mt-8 gap-4">
            <Link
              href="/bag"
              className="py-3 px-6 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
            >
              Return to Cart
            </Link>
          </div>
        </form>

        {/* --- Right: Order Summary + Payment Button --- */}
        <aside className="md:col-span-1 flex flex-col bg-gray-50 p-6 rounded-lg shadow-md min-h-[400px]">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartItems.length === 0 ? (
            <div className="text-gray-600 text-center py-8">Your cart is empty.</div>
          ) : (
              <div className="flex flex-col h-full">
                <ul className="divide-y divide-gray-200 mb-4">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex items-center py-3">
                      <div className="w-14 h-14 relative mr-3 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 truncate">{item.name}</div>
                        <div className="text-gray-600 text-sm">
                          Qty: {item.quantity} × SGD {item.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="font-semibold text-gray-800 ml-2 whitespace-nowrap text-right min-w-[80px]">
                        SGD {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between py-2 border-t border-gray-200">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-medium">SGD {getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">Total:</span>
                  <span className="font-bold text-lg">SGD {getCartTotal().toFixed(2)}</span>
                </div>
                {/* Payment Button */}
                <button
                  type="submit"
                  form="checkout-form"
                  className={`w-full py-3 mt-6 rounded-md font-semibold text-white transition ${
isFormValid() && cartItems.length > 0
? "bg-blue-600 hover:bg-blue-700"
: "bg-gray-400 cursor-not-allowed"
}`}
                  disabled={!isFormValid() || cartItems.length === 0}
                  onClick={handleProceed}
                >
                  Proceed to Payment
                </button>
                {/* If form is invalid and submit attempted, show a general error */}
                {submitAttempted && (!isFormValid() || cartItems.length === 0) && (
                  <div className="mt-4 text-red-600 text-sm text-center">
                    Please fill in all required fields correctly before proceeding.
                  </div>
                )}
              </div>
            )}
        </aside>
      </div>
    </div>
  );
}
