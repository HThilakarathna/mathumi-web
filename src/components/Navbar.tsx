"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function Navbar() {
  const { items, setCartOpen, isCartOpen, removeItem, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleInquirySubmit = async () => {
    if (!customerName.trim() || !contactNumber.trim()) {
      alert("Please provide both your name and contact number so we can reach back to you!");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.mathumibridal.com'}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          contactNumber,
          items: items.map(item => item.id)
        })
      });
      if (res.ok) {
        alert("Your inquiry request has been submitted successfully! We will contact you soon.");
        clearCart();
        setCustomerName("");
        setContactNumber("");
        setCartOpen(false);
      } else {
        const errorData = await res.json();
        alert("Failed to submit inquiry: " + (errorData.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Failed to submit inquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <nav className="w-full relative z-30 flex justify-center pt-6 mb-2">
        {/* Background horizontal band */}
        <div className="absolute top-6 left-0 right-0 h-20 bg-gradient-to-r from-[#eacda3] to-[#e4c29b] shadow-sm z-0"></div>
        
        <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-6 h-20 flex items-center justify-between relative z-10">
          {/* Logo Area */}
          <div className="relative flex-shrink-0 transition-all duration-300 hover:scale-105 z-20 flex items-center md:-ml-4">
            <Link href="/">
              <Image src="/logo.png" alt="Mathumi Bridal Boutique Logo" width={220} height={220} className="object-cover h-24 w-24 md:h-32 md:w-32 drop-shadow-md rounded-full border-2 border-[#d4af37]" />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4 md:space-x-6 lg:space-x-10 flex-shrink-0 relative z-10 h-full">
            <Link href="/" className="text-[#4a2511] text-sm md:text-lg lg:text-xl font-serif font-bold tracking-widest hover:text-[#800020] transition-colors">HOME</Link>
            <Link href="/salon" className="text-[#4a2511] text-sm md:text-lg lg:text-xl font-serif font-bold tracking-widest hover:text-[#800020] transition-colors">SERVICES</Link>
            <Link href="/academy" className="text-[#4a2511] text-sm md:text-lg lg:text-xl font-serif font-bold tracking-widest hover:text-[#800020] transition-colors">ACADEMY</Link>
            <Link href="/gallery" className="text-[#4a2511] text-sm md:text-lg lg:text-xl font-serif font-bold tracking-widest hover:text-[#800020] transition-colors">GALLERY</Link>
            <Link href="/rental-jewellery" className="text-[#4a2511] text-sm md:text-lg lg:text-xl font-serif font-bold tracking-widest hover:text-[#800020] transition-colors">RENTAL JEWELLERY</Link>
            
            {/* Booking Button */}
            <Link href="/booking" className="gold-button px-4 py-1 md:px-6 md:py-1.5 lg:px-8 lg:py-2 text-xs md:text-lg lg:text-xl rounded-full shadow-md font-sans">
              BOOKING
            </Link>
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <div className="md:hidden flex items-center z-20">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#4a2511] hover:text-[#800020] focus:outline-none p-2 border border-[#4a2511]/20 rounded bg-[#fdf5eb]/50 shadow-sm"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-out Inquiry Cart */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#1c1512]/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#fbf9f6] h-full shadow-2xl flex flex-col transform transition-transform duration-300 border-l border-[#c2a670]/15">
            <div className="p-6 border-b border-[#c2a670]/15 flex justify-between items-center bg-[#c2a670]/5">
              <h2 className="text-xl font-medium text-[#1c1512] font-serif tracking-widest">YOUR INQUIRIES</h2>
              <button onClick={() => setCartOpen(false)} className="text-[#6e1224] hover:text-red-700 font-bold p-2 cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <p className="text-center text-[#1c1512]/60 text-sm mt-10 font-sans font-medium">Your inquiry list is empty. Explore the Boutique to add items.</p>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex gap-4 border border-[#c2a670]/15 p-3 rounded bg-white shadow-sm items-center">
                    <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-[#1c1512] text-xs tracking-wider">{item.name}</p>
                      <p className="text-[10px] text-[#6e1224] font-serif uppercase tracking-wider mt-0.5">{item.category}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 cursor-pointer">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-[#c2a670]/15 bg-white space-y-4">
              {items.length > 0 && (
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[#4a2511] font-sans font-bold text-[9px] tracking-wider uppercase">Your Name *</label>
                    <input 
                      type="text" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: Anjali Kumar"
                      className="w-full p-2.5 border border-[#c2a670]/20 rounded bg-[#fbf9f6] text-xs text-[#1c1512] font-semibold focus:outline-none focus:border-[#6e1224]"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#4a2511] font-sans font-bold text-[9px] tracking-wider uppercase">Contact Number *</label>
                    <input 
                      type="tel" 
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="Ex: +94 77 123 4567"
                      className="w-full p-2.5 border border-[#c2a670]/20 rounded bg-[#fbf9f6] text-xs text-[#1c1512] font-semibold focus:outline-none focus:border-[#6e1224]"
                      required
                    />
                  </div>
                </div>
              )}
              <button 
                onClick={handleInquirySubmit}
                disabled={items.length === 0 || submitting} 
                className="gold-button w-full py-3.5 text-xs font-bold shadow-md uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? "SUBMITTING..." : "Submit Inquiry"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[100] md:hidden flex justify-end bg-[#1c1512]/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="w-full max-w-xs bg-[#fdf5eb] h-full shadow-2xl flex flex-col p-6 relative border-l border-[#d4af37]"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="absolute top-4 right-4 text-[#6e1224] hover:text-red-700 font-bold p-2 cursor-pointer text-2xl"
            >
              ✕
            </button>

            <div className="flex justify-center mb-8 mt-6">
              <Image 
                src="/logo.png" 
                alt="Mathumi Logo" 
                width={120} 
                height={120} 
                className="object-cover h-24 w-24 rounded-full border-2 border-[#d4af37] shadow-md" 
              />
            </div>

            <div className="flex flex-col gap-6 text-center mt-4">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#4a2511] text-lg font-serif font-bold tracking-widest hover:text-[#800020] transition-colors border-b border-[#d4af37]/20 pb-2"
              >
                HOME
              </Link>
              <Link 
                href="/salon" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#4a2511] text-lg font-serif font-bold tracking-widest hover:text-[#800020] transition-colors border-b border-[#d4af37]/20 pb-2"
              >
                SERVICES
              </Link>
              <Link 
                href="/academy" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#4a2511] text-lg font-serif font-bold tracking-widest hover:text-[#800020] transition-colors border-b border-[#d4af37]/20 pb-2"
              >
                ACADEMY
              </Link>
              <Link 
                href="/gallery" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#4a2511] text-lg font-serif font-bold tracking-widest hover:text-[#800020] transition-colors border-b border-[#d4af37]/20 pb-2"
              >
                GALLERY
              </Link>
              <Link 
                href="/rental-jewellery" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#4a2511] text-lg font-serif font-bold tracking-widest hover:text-[#800020] transition-colors border-b border-[#d4af37]/20 pb-2"
              >
                RENTAL JEWELLERY
              </Link>

              
              <Link 
                href="/booking" 
                onClick={() => setMobileMenuOpen(false)}
                className="gold-button py-3 mt-4 text-sm rounded-full shadow-md font-sans text-center font-bold tracking-widest block"
              >
                BOOKING
              </Link>
            </div>
            
            <div className="mt-auto text-center text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[#1c1512]/50">
              © 2026 Mathumi Boutique & Salon
            </div>
          </div>
        </div>
      )}
    </>
  );
}

