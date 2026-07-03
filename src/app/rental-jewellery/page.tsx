"use client";
import React, { useState, useEffect } from "react";

type JewelleryItem = {
  _id: string;
  name: string;
  jewelleryNumber: string;
  image: string;
  images?: string[];
  description: string;
  hidden?: boolean;
  category?: string;
};

type CategoryItem = {
  _id: string;
  name: string;
  image: string;
  hidden?: boolean;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
    ? 'http://localhost:5000' 
    : 'https://api.mathumibridal.com');

export default function RentalJewelleryPage() {
  const [items, setItems] = useState<JewelleryItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking Modal State
  const [selectedItem, setSelectedItem] = useState<JewelleryItem | null>(null);
  const [clientName, setClientName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [needDate, setNeedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Per-card image slider index
  const [cardImageIndex, setCardImageIndex] = useState<Record<string, number>>({});

  const getCardImages = (item: JewelleryItem): string[] => {
    const imgs = Array.isArray(item.images) && item.images.length > 0 ? item.images : (item.image ? [item.image] : ['/hero-saree.png']);
    return imgs;
  };

  const prevCardImage = (e: React.MouseEvent, itemId: string, total: number) => {
    e.stopPropagation();
    setCardImageIndex(prev => ({ ...prev, [itemId]: ((prev[itemId] ?? 0) - 1 + total) % total }));
  };

  const nextCardImage = (e: React.MouseEvent, itemId: string, total: number) => {
    e.stopPropagation();
    setCardImageIndex(prev => ({ ...prev, [itemId]: ((prev[itemId] ?? 0) + 1) % total }));
  };

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/rental-categories`);
      if (!res.ok) {
        throw new Error(`Server status: ${res.status}`);
      }
      const data = await res.json();
      const visibleCategories = Array.isArray(data) ? data.filter((cat: CategoryItem) => !cat.hidden) : [];
      setCategories(visibleCategories);
    } catch (err: any) {
      console.error("Error fetching categories:", err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/rental-jewellery`);
      if (!res.ok) {
        throw new Error(`Server returned status: ${res.status}`);
      }
      const data = await res.json();
      // Filter out hidden items
      const visibleItems = Array.isArray(data) ? data.filter((item: JewelleryItem) => !item.hidden) : [];
      setItems(visibleItems);
    } catch (err: any) {
      console.error("Error fetching jewellery:", err);
      setError("Failed to load rental jewellery. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = (item: JewelleryItem) => {
    setSelectedItem(item);
    setSuccess(false);
    setClientName("");
    setAddress("");
    setPhone("");
    setNeedDate("");
    setNotes("");
  };

  const handleCloseBooking = () => {
    setSelectedItem(null);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/rental-bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: clientName,
          address,
          phone,
          needDate,
          description: notes,
          category: selectedItem.category || selectedCategoryName || "Premium Jewellery",
          jewelleryName: selectedItem.name,
          jewelleryNumber: selectedItem.jewelleryNumber,
          jewelleryImage: selectedItem.image,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit rental booking request");
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Booking error:", err);
      alert("Something went wrong while submitting your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#fdf5eb]">

      {/* ─── HERO: Gallery-style split layout ─── */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-10 pb-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14">

          {/* Left: Text */}
          <div className="w-full lg:w-[50%] flex flex-col items-start justify-center text-left">
            <span className="text-[#6e1224] font-sans font-bold tracking-[0.25em] uppercase mb-4 text-[10px] sm:text-xs">
              ROYAL COLLECTION · PREMIUM HIRE
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-[45px] font-serif font-bold text-[#4a2511] leading-[1.25] mb-4 tracking-[0.05em] uppercase">
              RENTAL JEWELLERY
              <span className="text-[#6e1224] font-serif font-semibold text-lg sm:text-xl md:text-2xl tracking-[0.12em] mt-2 block">
                Adorned for Your Grand Day.
              </span>
            </h1>

            <div className="kolam-separator !justify-start w-full mt-1 mb-5">
              <div className="kolam-line max-w-[100px]"></div>
              <div className="kolam-ornament font-light tracking-[0.3em] text-[#d4af37]">✧</div>
            </div>

            <p className="text-[#1c1512]/80 font-sans text-base sm:text-lg font-medium mb-6 leading-relaxed">
              Accentuate your bridal splendor with our handpicked, premium designer bridal jewellery sets.
              Exquisite traditional craftsmanship — available on hire for your grand day.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-start mt-2">
              <a href="#catalogue" className="gold-button rounded-full text-center py-3 px-8 text-[11px] sm:text-xs tracking-[0.2em] font-sans font-bold shadow-md uppercase block w-full sm:w-auto">
                EXPLORE COLLECTION
              </a>
              <a href="/booking" className="border border-[#4a2511] text-[#4a2511] rounded-full text-center py-3 px-8 text-[11px] sm:text-xs tracking-[0.2em] font-sans font-bold uppercase block w-full sm:w-auto hover:bg-[#4a2511] hover:text-white transition-colors duration-300">
                BOOK A SESSION
              </a>
            </div>
          </div>

          {/* Right: 3-Card Overlapping Jewellery Composition */}
          <div className="w-full lg:w-[50%] flex justify-center lg:justify-end items-center relative py-6">
            <div className="relative w-full max-w-[480px] h-[420px] sm:h-[490px] lg:h-[530px]">

              {/* CARD 1: Main — jewellery set stand */}
              <div className="absolute top-0 left-6 w-[75%] h-[85%] rounded-2xl overflow-hidden border-4 border-[#d4af37] bg-[#fdf5eb] shadow-[0_16px_40px_rgba(74,37,17,0.18)] transition-all duration-500 ease-out hover:-translate-y-4 hover:scale-[1.03] hover:shadow-[0_28px_55px_rgba(74,37,17,0.28)] z-10 hover:z-30 cursor-pointer group">
                <img src="/jewelry/jewellery_hero_stand.png" alt="Antique Bridal Jewellery Set" className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-2 border border-[#d4af37]/30 rounded-xl pointer-events-none z-10" />
                <div className="absolute bottom-3 left-3 bg-[#1c1512]/60 backdrop-blur-sm rounded-full px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[#d4af37] font-sans font-bold text-[8px] tracking-[0.2em] uppercase">Royal Gold Set</span>
                </div>
              </div>

              {/* CARD 2: Bottom-Left — bride with diamond necklace */}
              <div className="absolute bottom-2 left-0 w-[48%] h-[52%] rounded-2xl overflow-hidden border-4 border-white bg-[#fdf5eb] shadow-[0_12px_30px_rgba(74,37,17,0.22)] transition-all duration-500 ease-out hover:-translate-y-4 hover:scale-[1.06] hover:shadow-[0_22px_45px_rgba(74,37,17,0.32)] z-20 hover:z-30 cursor-pointer group -rotate-3 hover:rotate-0">
                <img src="/jewelry/jewellery_hero_bride1.png" alt="Bride with Diamond Jewellery" className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-1.5 border border-[#d4af37]/25 rounded-xl pointer-events-none z-10" />
                <div className="absolute bottom-2 left-2 bg-[#1c1512]/60 backdrop-blur-sm rounded-full px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[#d4af37] font-sans font-bold text-[7px] tracking-[0.18em] uppercase">Diamond Set</span>
                </div>
              </div>

              {/* CARD 3: Bottom-Right — bride with gold necklace */}
              <div className="absolute bottom-0 right-0 w-[46%] h-[46%] rounded-2xl overflow-hidden border-4 border-white bg-[#fdf5eb] shadow-[0_12px_30px_rgba(74,37,17,0.22)] transition-all duration-500 ease-out hover:-translate-y-4 hover:scale-[1.06] hover:shadow-[0_22px_45px_rgba(74,37,17,0.32)] z-20 hover:z-30 cursor-pointer group rotate-2 hover:rotate-0">
                <img src="/jewelry/jewellery_hero_bride2.png" alt="Bride with Gold Jewellery" className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-1.5 border border-[#d4af37]/25 rounded-xl pointer-events-none z-10" />
                <div className="absolute bottom-2 left-2 bg-[#1c1512]/60 backdrop-blur-sm rounded-full px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[#d4af37] font-sans font-bold text-[7px] tracking-[0.18em] uppercase">Gold Set</span>
                </div>
              </div>

              {/* Gold ✧ floating ornament */}
              <div className="absolute top-[78%] left-[68%] text-[#d4af37] text-2xl z-30 pointer-events-none animate-pulse select-none drop-shadow">✧</div>

            </div>
          </div>
        </div>
      </div>

      {/* ─── Catalogue Section ─── */}
      <div id="catalogue" className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">

        {/* Section divider */}
        <div className="text-center mb-10">
          <div className="kolam-separator">
            <div className="kolam-line"></div>
            <div className="kolam-ornament font-bold">✦</div>
            <div className="kolam-line"></div>
          </div>
          <p className="text-xs sm:text-sm text-[#4a2511]/60 font-sans uppercase tracking-widest font-semibold mt-2">
            {selectedCategoryName ? `${selectedCategoryName} Collection` : "Browse Our Exclusive Catalogue"}
          </p>
        </div>

        {/* Breadcrumb / Back button if category is selected */}
        {selectedCategoryName && (
          <div className="mb-6 flex justify-start">
            <button
              onClick={() => setSelectedCategoryName(null)}
              className="gold-button !py-2 !px-5 text-[10px] tracking-wider flex items-center gap-2 border border-[#7a5420]"
            >
              ← Back to Categories
            </button>
          </div>
        )}

        {/* Loader, Error, Empty, and Grid States */}
        {loading || categoriesLoading ? (
          <div className="flex justify-center items-center py-24">
            <p className="text-[#800020] font-bold text-xl animate-pulse tracking-widest font-serif">
              UNVEILING ROYAL COLLECTION...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-[#f4e8d3]/50 border border-[#d4af37]/35 rounded-xl p-8 max-w-lg mx-auto shadow-sm">
            <p className="text-red-700 font-semibold mb-4">{error}</p>
            <button
              onClick={() => { fetchItems(); fetchCategories(); }}
              className="gold-button px-6 py-2 text-xs uppercase"
            >
              Retry
            </button>
          </div>
        ) : !selectedCategoryName ? (
          /* Landing Categories View */
          categories.length === 0 ? (
            <div className="text-center py-20 bg-white/40 border border-[#d4af37]/20 rounded-2xl p-8 shadow-sm">
              <p className="text-[#4a2511]/70 font-serif text-lg tracking-wide">
                No categories available at the moment.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Please check back soon or contact us directly for inquiries.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  onClick={() => setSelectedCategoryName(cat.name)}
                  className="relative h-80 rounded-2xl overflow-hidden group shadow-lg border-2 border-[#d4af37]/35 cursor-pointer bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(74,37,17,0.22)]"
                >
                  <img
                    src={cat.image || "/hero-saree.png"}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c1512]/90 via-[#1c1512]/40 to-transparent" />
                  <div className="absolute inset-4 border border-[#d4af37]/30 rounded-xl pointer-events-none transition-all duration-500 group-hover:inset-3 group-hover:border-[#d4af37]/65" />
                  <div className="absolute bottom-6 left-6 right-6 text-center">
                    <h3 className="text-lg sm:text-xl font-serif text-[#eacda3] font-bold tracking-widest uppercase transition-all duration-300 group-hover:text-white drop-shadow">
                      {cat.name}
                    </h3>
                    <span className="inline-block mt-2 text-[9px] sm:text-[10px] text-[#d4af37] font-sans font-bold tracking-[0.25em] uppercase border-t border-[#d4af37]/40 pt-2 px-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      EXPLORE COLLECTION ✧
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Selected Category Items View */
          (() => {
            const filteredItems = items.filter(item => item.category === selectedCategoryName);
            return filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-white/40 border border-[#d4af37]/20 rounded-2xl p-8 shadow-sm">
                <p className="text-[#4a2511]/70 font-serif text-lg tracking-wide">
                  No items found in "{selectedCategoryName}" category.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  We are updating this collection. Please select another category or check back later!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => {
                  const imgs = getCardImages(item);
                  const currentIdx = cardImageIndex[item._id] ?? 0;
                  const hasMultiple = imgs.length > 1;
                  return (
                    <div
                      key={item._id}
                      className="gold-panel bg-white border border-[#c2a670]/15 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full"
                    >
                      {/* Image Slider */}
                      <div className="relative w-full h-72 bg-[#fdf5eb] border-b border-[#d4af37]/20 overflow-hidden group">
                        <img
                          src={imgs[currentIdx] || "/hero-saree.png"}
                          alt={item.name}
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
                        />

                        {/* ID Badge */}
                        <div className="absolute top-3 left-3 bg-[#4a2511]/90 text-[#fdf5eb] text-[10px] font-sans font-bold px-3 py-1 rounded border border-[#d4af37]/30 tracking-widest uppercase shadow z-10">
                          ID: {item.jewelleryNumber}
                        </div>

                        {/* Image counter badge */}
                        {hasMultiple && (
                          <div className="absolute top-3 right-3 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                            {currentIdx + 1} / {imgs.length}
                          </div>
                        )}

                        {/* Left / Right arrows */}
                        {hasMultiple && (
                          <>
                            <button
                              onClick={(e) => prevCardImage(e, item._id, imgs.length)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#1c1512]/60 hover:bg-[#4a2511]/90 text-white flex items-center justify-center shadow transition-all duration-200 opacity-0 group-hover:opacity-100"
                              aria-label="Previous image"
                            >
                              &#8592;
                            </button>
                            <button
                              onClick={(e) => nextCardImage(e, item._id, imgs.length)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#1c1512]/60 hover:bg-[#4a2511]/90 text-white flex items-center justify-center shadow transition-all duration-200 opacity-0 group-hover:opacity-100"
                              aria-label="Next image"
                            >
                              &#8594;
                            </button>

                            {/* Dot indicators */}
                            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
                              {imgs.map((_, dotIdx) => (
                                <button
                                  key={dotIdx}
                                  onClick={(e) => { e.stopPropagation(); setCardImageIndex(prev => ({ ...prev, [item._id]: dotIdx })); }}
                                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                                    dotIdx === currentIdx ? 'bg-[#d4af37] w-3' : 'bg-white/60 hover:bg-white'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Card Details */}
                      <div className="p-5 flex-grow flex flex-col justify-between pt-6">
                        <div>
                          <h3 className="text-lg sm:text-xl font-serif text-[#4a2511] font-bold tracking-wide line-clamp-1 mb-2">
                            {item.name}
                          </h3>
                          <p className="text-xs text-[#800020] font-sans uppercase font-bold tracking-widest mb-3">
                            {selectedCategoryName}
                          </p>
                          <p className="text-sm text-[#4a2511]/70 font-sans leading-relaxed line-clamp-3 mb-6">
                            {item.description || "Beautiful premium set to elevate your traditional bridal drape."}
                          </p>
                        </div>

                        {/* Actions */}
                        <div>
                          <button
                            onClick={() => handleOpenBooking(item)}
                            className="gold-button w-full py-2.5 text-xs font-bold shadow-md uppercase tracking-wider"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()
        )}

        {/* Elegant Modal Form for Book Now */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1c1512]/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-[#fbf9f6] w-full max-w-lg rounded-xl overflow-hidden border border-[#d4af37] shadow-2xl relative">
              {/* Modal Header */}
              <div className="p-6 border-b border-[#c2a670]/15 bg-gradient-to-r from-[#4a2511] to-[#6e1224] text-white flex justify-between items-center relative">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-sans text-[#eacda3] font-bold">
                    Reservation Form
                  </span>
                  <h2 className="text-lg sm:text-xl font-serif tracking-wide mt-0.5">
                    Rent {selectedItem.name}
                  </h2>
                </div>
                <button
                  onClick={handleCloseBooking}
                  className="text-white/80 hover:text-white transition-colors p-2 text-xl font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[75vh]">
                {success ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-300">
                      <span className="text-3xl font-bold">✓</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-[#4a2511] mb-2">
                      Booking Request Submitted!
                    </h3>
                    <p className="text-sm text-[#4a2511]/70 max-w-sm mx-auto mb-6">
                      Thank you for choosing Mathumi Bridal. We have received your booking request for set 
                      <strong> {selectedItem.name} ({selectedItem.jewelleryNumber})</strong>. Our team will contact you shortly to confirm the availability and details.
                    </p>
                    <button
                      onClick={handleCloseBooking}
                      className="gold-button px-8 py-2 text-xs uppercase"
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitBooking} className="space-y-4">
                    {/* Selected Item Summary Box */}
                    <div className="flex gap-4 p-3 bg-[#fdf5eb] rounded-lg border border-[#c2a670]/20 items-center">
                      <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0 border border-[#d4af37]/35 bg-white">
                        <img
                          src={selectedItem.image || "/hero-saree.png"}
                          alt={selectedItem.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-[#4a2511] text-sm tracking-wide">
                          {selectedItem.name}
                        </p>
                        <p className="text-xs text-[#800020] font-sans font-bold uppercase mt-0.5 tracking-wider">
                          ID: {selectedItem.jewelleryNumber}
                        </p>
                        <p className="text-[10px] text-[#4a2511]/60 font-sans uppercase font-bold tracking-wider mt-0.5">
                          Category: {selectedItem.category || selectedCategoryName || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[#4a2511] font-sans font-bold text-[10px] tracking-wider uppercase mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Your Name (e.g., Priyadharshini Raman)"
                          className="w-full p-2.5 border border-[#c2a670]/20 rounded bg-white text-xs text-[#4a2511] font-medium focus:outline-none focus:border-[#800020]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#4a2511] font-sans font-bold text-[10px] tracking-wider uppercase mb-1">
                          Address *
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Your Complete Address"
                          className="w-full p-2.5 border border-[#c2a670]/20 rounded bg-white text-xs text-[#4a2511] font-medium focus:outline-none focus:border-[#800020] resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[#4a2511] font-sans font-bold text-[10px] tracking-wider uppercase mb-1">
                          Need Date / Event Date (Optional)
                        </label>
                        <input
                          type="date"
                          value={needDate}
                          onChange={(e) => setNeedDate(e.target.value)}
                          className="w-full p-2.5 border border-[#c2a670]/20 rounded bg-white text-xs text-[#4a2511] font-medium focus:outline-none focus:border-[#800020]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#4a2511] font-sans font-bold text-[10px] tracking-wider uppercase mb-1">
                          Contact / Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g., +94 77 123 4567"
                          className="w-full p-2.5 border border-[#c2a670]/20 rounded bg-white text-xs text-[#4a2511] font-medium focus:outline-none focus:border-[#800020]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#4a2511] font-sans font-bold text-[10px] tracking-wider uppercase mb-1">
                          Special Notes (Optional)
                        </label>
                        <textarea
                          rows={3}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Preferred wedding/event dates or queries..."
                          className="w-full p-2.5 border border-[#c2a670]/20 rounded bg-white text-xs text-[#4a2511] font-medium focus:outline-none focus:border-[#800020] resize-none"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="gold-button w-full py-3.5 text-xs font-bold shadow-md uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {submitting ? "SUBMITTING REQUEST..." : "SUBMIT BOOKING REQUEST"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
