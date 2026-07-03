"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/components/Toast';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000' : 'https://api.mathumibridal.com');

export default function AdminDashboard() {
  const { showToast, ToastElement } = useToast();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'inquiries' | 'manageSarees' | 'manageAcademy' | 'manageSalon' | 'manageCategories' | 'manageGallery' | 'manageStaff' | 'billingCategories' | 'billingServices' | 'billingCustomers' | 'billingPOS' | 'manageJewellery' | 'jewelleryBookings' | 'manageJewelleryCategories'>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isPOSExpanded, setIsPOSExpanded] = useState(false);

  // Rental Jewellery state
  const [rentalJewellery, setRentalJewellery] = useState<any[]>([]);
  const [isJewelleryModalOpen, setIsJewelleryModalOpen] = useState(false);
  const [jewelleryForm, setJewelleryForm] = useState({
    _id: '',
    name: '',
    jewelleryNumber: '',
    image: '',
    images: [] as string[],
    description: '',
    hidden: false,
    category: ''
  });
  const [isEditingJewellery, setIsEditingJewellery] = useState(false);
  const [selectedJewellery, setSelectedJewellery] = useState<any>(null);
  const [isJewelleryViewModalOpen, setIsJewelleryViewModalOpen] = useState(false);
  const [openJewelleryMenuId, setOpenJewelleryMenuId] = useState<string | null>(null);
  const [searchJewellery, setSearchJewellery] = useState('');
  const [statusFilterJewellery, setStatusFilterJewellery] = useState<'all' | 'visible' | 'hidden'>('all');
  const [sortJewellery, setSortJewellery] = useState<'name-asc' | 'name-desc' | 'number-asc' | 'number-desc'>('name-asc');
  const [categoryFilterJewellery, setCategoryFilterJewellery] = useState('all');

  // Rental Jewellery Categories state
  const [rentalCategories, setRentalCategories] = useState<any[]>([]);
  const [isJewelleryCategoryModalOpen, setIsJewelleryCategoryModalOpen] = useState(false);
  const [jewelleryCategoryForm, setJewelleryCategoryForm] = useState({
    _id: '',
    name: '',
    image: '/hero-saree.png',
    hidden: false
  });
  const [isEditingJewelleryCategory, setIsEditingJewelleryCategory] = useState(false);
  const [searchJewelleryCategory, setSearchJewelleryCategory] = useState('');
  const [statusFilterJewelleryCategory, setStatusFilterJewelleryCategory] = useState<'all' | 'visible' | 'hidden'>('all');
  const [selectedJewelleryCategory, setSelectedJewelleryCategory] = useState<any>(null);
  const [isJewelleryCategoryViewModalOpen, setIsJewelleryCategoryViewModalOpen] = useState(false);
  const [openJewelleryCategoryMenuId, setOpenJewelleryCategoryMenuId] = useState<string | null>(null);

  // Rental Bookings state
  const [rentalBookings, setRentalBookings] = useState<any[]>([]);
  const [searchRentalBooking, setSearchRentalBooking] = useState('');
  const [statusFilterRentalBooking, setStatusFilterRentalBooking] = useState<'all' | 'Pending' | 'Contacted' | 'Confirmed' | 'Cancelled'>('all');
  const [dateFilterRentalBooking, setDateFilterRentalBooking] = useState('');
  const [selectedRentalBooking, setSelectedRentalBooking] = useState<any>(null);
  const [isRentalBookingModalOpen, setIsRentalBookingModalOpen] = useState(false);

  // Billing Categories POS
  const [billingCategories, setBillingCategories] = useState<any[]>([]);
  const [billingCategoryForm, setBillingCategoryForm] = useState({ _id: '', name: '' });
  const [isBillingCategoryModalOpen, setIsBillingCategoryModalOpen] = useState(false);
  const [isEditingBillingCategory, setIsEditingBillingCategory] = useState(false);
  const [searchBillingCategory, setSearchBillingCategory] = useState('');

  // Billing Services POS
  const [billingServices, setBillingServices] = useState<any[]>([]);
  const [billingServiceForm, setBillingServiceForm] = useState({ _id: '', name: '', category: '', price: '', commissionValue: '', commissionType: 'percentage' });
  const [isBillingServiceModalOpen, setIsBillingServiceModalOpen] = useState(false);
  const [isEditingBillingService, setIsEditingBillingService] = useState(false);
  const [searchBillingService, setSearchBillingService] = useState('');

  // Customers POS
  const [billingCustomers, setBillingCustomers] = useState<any[]>([]);
  const [customerForm, setCustomerForm] = useState({ _id: '', name: '', whatsapp: '', phone: '', address: '' });
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isCustomerViewModalOpen, setIsCustomerViewModalOpen] = useState(false);
  const [searchCustomer, setSearchCustomer] = useState('');
  
  // POS Billing Cart State
  const [invoiceCart, setInvoiceCart] = useState<any[]>([]);
  const [selectedPOSCustomer, setSelectedPOSCustomer] = useState<any>(null);
  const [selectedPOSServiceId, setSelectedPOSServiceId] = useState('');
  const [selectedPOSStaffId, setSelectedPOSStaffId] = useState('');
  const [posDiscount, setPosDiscount] = useState<number>(0);
  const [bookings, setBookings] = useState<any[]>([]);
  // State for Booking Details Modal
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);
  // State for Inquiry Details Modal
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [sarees, setSarees] = useState<any[]>([]);
  const [academyCourses, setAcademyCourses] = useState<any[]>([]);
  const [salonServices, setSalonServices] = useState<any[]>([]);
  const [salonCategories, setSalonCategories] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Add/Edit Saree State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sareeForm, setSareeForm] = useState<{
    _id: string;
    name: string;
    price: string;
    image: string;
    images: string[];
    color: string;
    category: string;
    type: string;
    fabric: string;
    zari: string;
    description: string;
  }>({ 
    _id: '', 
    name: '', 
    price: '', 
    image: '/hero-saree.png', 
    images: [],
    color: '',
    category: 'Pure Kanchipuram Silk Sarees',
    type: 'SAREE',
    fabric: '',
    zari: '',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [openSareeMenuId, setOpenSareeMenuId] = useState<string | null>(null);
  const [selectedSaree, setSelectedSaree] = useState<any>(null);
  const [isSareeViewModalOpen, setIsSareeViewModalOpen] = useState(false);

  const handleRemoveSareeImage = (indexToRemove: number) => {
    setSareeForm(p => {
      const newImages = (p.images || []).filter((_, idx) => idx !== indexToRemove);
      return {
        ...p,
        images: newImages,
        image: newImages.length > 0 ? newImages[0] : '/hero-saree.png'
      };
    });
  };

  // Add/Edit Salon Category State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState<{ _id: string, name: string, description: string, image: string, images: string[] }>({ _id: '', name: '', description: '', image: '', images: [] });
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [openCategoryMenuId, setOpenCategoryMenuId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isCategoryViewModalOpen, setIsCategoryViewModalOpen] = useState(false);

  const handleRemoveCategoryImage = (indexToRemove: number) => {
    setCategoryForm(p => {
      const newImages = p.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...p,
        images: newImages,
        image: newImages.length > 0 ? newImages[0] : ''
      };
    });
  };

  // Add/Edit Salon Service State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceForm, setServiceForm] = useState<{ _id: string, title: string, category: string, description: string, image: string, images: string[] }>({ _id: '', title: '', category: 'Hair Styling', description: '', image: '', images: [] });
  const [isEditingService, setIsEditingService] = useState(false);
  const [openServiceMenuId, setOpenServiceMenuId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isServiceViewModalOpen, setIsServiceViewModalOpen] = useState(false);

  const handleRemoveServiceImage = (indexToRemove: number) => {
    setServiceForm(p => {
      const newImages = p.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...p,
        images: newImages,
        image: newImages.length > 0 ? newImages[0] : ''
      };
    });
  };

  // Add/Edit Staff State
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [openStaffMenuId, setOpenStaffMenuId] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [isStaffViewModalOpen, setIsStaffViewModalOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({
    _id: '', name: '', address: '', mobile: '', whatsapp: '', nic: '', dob: '', photo: '', role: 'Beauty Therapist'
  });
  const [isEditingStaff, setIsEditingStaff] = useState(false);

  const handleRemoveStaffPhoto = () => {
    setStaffForm(p => ({ ...p, photo: '' }));
  };

  // Add/Edit Academy Course State
  const [isAcademyModalOpen, setIsAcademyModalOpen] = useState(false);
  const [academyForm, setAcademyForm] = useState({ _id: '', title: '', duration: '', price: '', image: '', images: [] as string[], syllabus: '' });
  const [isEditingAcademy, setIsEditingAcademy] = useState(false);
  const [openAcademyMenuId, setOpenAcademyMenuId] = useState<string | null>(null);
  const [selectedAcademy, setSelectedAcademy] = useState<any>(null);
  const [isAcademyViewModalOpen, setIsAcademyViewModalOpen] = useState(false);

  const handleRemoveAcademyImage = (indexToRemove: number) => {
    setAcademyForm(p => {
      const newImages = (p.images || []).filter((_, idx) => idx !== indexToRemove);
      return {
        ...p,
        images: newImages,
        image: newImages.length > 0 ? newImages[0] : ''
      };
    });
  };

  // Add/Edit Gallery State
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState({ _id: '', title: '', category: 'Bridal', url: '' });
  const [isEditingGallery, setIsEditingGallery] = useState(false);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) return data.imageUrl;
      showToast("Image upload failed: " + data.message, "error");
    } catch (err) {
      console.error(err);
      showToast("Error uploading image", "error");
    }
    return null;
  };

  const onDropSaree = async (files: File[]) => { 
    if (!files || files.length === 0) {
      showToast("Invalid file format. Please upload a valid image (JPG, PNG, WebP)!", "error");
      return;
    }
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const url = await uploadImage(file);
      if(url) uploadedUrls.push(url);
    }
    if (uploadedUrls.length > 0) {
      setSareeForm(p => {
        const newImages = [...(p.images || []), ...uploadedUrls];
        return {
          ...p,
          image: p.image && p.image !== '/hero-saree.png' && p.image !== '' ? p.image : uploadedUrls[0],
          images: newImages
        };
      });
    }
  };
  const onDropCategory = async (files: File[]) => { 
    if (!files || files.length === 0) {
      showToast("Invalid file format. Please upload a valid image (JPG, PNG, WebP)!", "error");
      return;
    }
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const url = await uploadImage(file);
      if(url) uploadedUrls.push(url);
    }
    if (uploadedUrls.length > 0) {
      setCategoryForm(p => {
        const newImages = [...(p.images || []), ...uploadedUrls];
        return {
          ...p,
          image: p.image || uploadedUrls[0],
          images: newImages
        };
      });
    }
  };
  const onDropService = async (files: File[]) => { 
    if (!files || files.length === 0) {
      showToast("Invalid file format. Please upload a valid image (JPG, PNG, WebP)!", "error");
      return;
    }
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const url = await uploadImage(file);
      if(url) uploadedUrls.push(url);
    }
    if (uploadedUrls.length > 0) {
      setServiceForm(p => {
        const newImages = [...(p.images || []), ...uploadedUrls];
        return {
          ...p,
          image: p.image || uploadedUrls[0],
          images: newImages
        };
      });
    }
  };
  const onDropAcademy = async (files: File[]) => { 
    if (!files || files.length === 0) {
      showToast("Invalid file format. Please upload a valid image (JPG, PNG, WebP)!", "error");
      return;
    }
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const url = await uploadImage(file);
      if (url) uploadedUrls.push(url);
    }
    if (uploadedUrls.length > 0) {
      setAcademyForm(p => {
        const newImages = [...(p.images || []), ...uploadedUrls];
        return {
          ...p,
          image: p.image && p.image !== '' ? p.image : uploadedUrls[0],
          images: newImages
        };
      });
    }
  };
  const onDropGallery = async (files: File[]) => { 
    if (!files || files.length === 0) {
      showToast("Invalid file format. Please upload a valid image (JPG, PNG, WebP)!", "error");
      return;
    }
    const url = await uploadImage(files[0]); 
    if(url) setGalleryForm(p => ({...p, url: url})); 
  };
  const onDropStaff = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const url = await uploadImage(files[0]);
    if (url) setStaffForm(p => ({ ...p, photo: url }));
  };
  const onDropJewellery = async (files: File[]) => {
    if (!files || files.length === 0) {
      showToast("Invalid file format. Please upload a valid image (JPG, PNG, WebP)!", "error");
      return;
    }
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const url = await uploadImage(file);
      if (url) uploadedUrls.push(url);
    }
    if (uploadedUrls.length > 0) {
      setJewelleryForm(p => {
        const newImages = [...(p.images || []), ...uploadedUrls];
        return { ...p, image: p.image || uploadedUrls[0], images: newImages };
      });
    }
  };

  const onDropJewelleryCategory = async (files: File[]) => {
    if (!files || files.length === 0) {
      showToast("Invalid file format. Please upload a valid image (JPG, PNG, WebP)!", "error");
      return;
    }
    const url = await uploadImage(files[0]);
    if (url) {
      setJewelleryCategoryForm(p => ({ ...p, image: url }));
    }
  };

  const { getRootProps: getSareeProps, getInputProps: getSareeInput, isDragActive: isSareeDrag } = useDropzone({ 
    onDrop: onDropSaree, 
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    useFsAccessApi: false
  });
  const { getRootProps: getCategoryProps, getInputProps: getCategoryInput, isDragActive: isCategoryDrag } = useDropzone({ 
    onDrop: onDropCategory, 
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    useFsAccessApi: false
  });
  const { getRootProps: getServiceProps, getInputProps: getServiceInput, isDragActive: isServiceDrag } = useDropzone({ 
    onDrop: onDropService, 
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    useFsAccessApi: false
  });
  const { getRootProps: getAcademyProps, getInputProps: getAcademyInput, isDragActive: isAcademyDrag } = useDropzone({ 
    onDrop: onDropAcademy, 
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    useFsAccessApi: false,
    multiple: true
  });
  const { getRootProps: getGalleryProps, getInputProps: getGalleryInput, isDragActive: isGalleryDrag } = useDropzone({ 
    onDrop: onDropGallery, 
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    useFsAccessApi: false
  });
  const { getRootProps: getStaffProps, getInputProps: getStaffInput, isDragActive: isStaffDrag } = useDropzone({
    onDrop: onDropStaff,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    useFsAccessApi: false
  });
  const { getRootProps: getJewelleryProps, getInputProps: getJewelleryInput, isDragActive: isJewelleryDrag } = useDropzone({
    onDrop: onDropJewellery,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    useFsAccessApi: false,
    multiple: true
  });
  const { getRootProps: getJewelleryCategoryProps, getInputProps: getJewelleryCategoryInput, isDragActive: isJewelleryCategoryDrag } = useDropzone({
    onDrop: onDropJewelleryCategory,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] },
    useFsAccessApi: false,
    multiple: false
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchAllData(token);
  }, [router]);

  // Safely parse JSON — returns fallback if the response is HTML or non-JSON
  const safeJson = async (res: Response, fallback: any = []) => {
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Non-JSON response from:', res.url, '(status:', res.status + ')');
      return fallback;
    }
    try {
      return await res.json();
    } catch {
      console.warn('Failed to parse JSON from:', res.url);
      return fallback;
    }
  };

  const fetchAllData = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const API = API_BASE;
      const authHeaders = { 'Authorization': `Bearer ${token}` };

      const safeFetch = async (url: string, options?: RequestInit) => {
        try {
          const res = await fetch(url, options);
          return res;
        } catch (err) {
          console.warn(`Fetch connection error for ${url}:`, err);
          return new Response(JSON.stringify([]), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      };

      const [
        bRes, iRes, sRes, aRes, salonRes, gRes, catRes, staffRes, billingCatRes, billingServRes, customerRes,
        jewRes, jewBookRes, jewCatRes
      ] = await Promise.all([
        safeFetch(`${API}/api/bookings`, { headers: authHeaders }),
        safeFetch(`${API}/api/inquiries`, { headers: authHeaders }),
        safeFetch(`${API}/api/sarees`),
        safeFetch(`${API}/api/academy-courses`),
        safeFetch(`${API}/api/salon-services`),
        safeFetch(`${API}/api/gallery`),
        safeFetch(`${API}/api/salon-categories`),
        safeFetch(`${API}/api/staff`, { headers: authHeaders }),
        safeFetch(`${API}/api/billing-categories`, { headers: authHeaders }),
        safeFetch(`${API}/api/billing-services`, { headers: authHeaders }),
        safeFetch(`${API}/api/customers`, { headers: authHeaders }),
        safeFetch(`${API}/api/rental-jewellery`),
        safeFetch(`${API}/api/rental-bookings`, { headers: authHeaders }),
        safeFetch(`${API}/api/rental-categories`)
      ]);

      if (bRes.status === 401 || bRes.status === 400) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
        return;
      }

      // Gracefully handle each endpoint — only auth failures redirect to login
      if (bRes.ok) setBookings(await safeJson(bRes, []));
      else console.warn('Bookings endpoint error:', bRes.status);

      if (iRes.ok) setInquiries(await safeJson(iRes, []));
      else console.warn('Inquiries endpoint error:', iRes.status);

      if (sRes.ok) setSarees(await safeJson(sRes, []));
      else console.warn('Sarees endpoint error:', sRes.status);

      if (aRes.ok) setAcademyCourses(await safeJson(aRes, []));
      else console.warn('Academy-courses endpoint error:', aRes.status);

      if (salonRes.ok) setSalonServices(await safeJson(salonRes, []));
      else console.warn('Salon-services endpoint error:', salonRes.status);

      if (gRes.ok) setGallery(await safeJson(gRes, []));
      else console.warn('Gallery endpoint error:', gRes.status);

      if (catRes.ok) setSalonCategories(await safeJson(catRes, []));
      else console.warn('Salon-categories endpoint error:', catRes.status);

      if (staffRes.ok) setStaffList(await safeJson(staffRes, []));
      else console.warn('Staff endpoint error:', staffRes.status);

      if (billingCatRes.ok) setBillingCategories(await safeJson(billingCatRes, []));
      else console.warn('Billing-categories endpoint error:', billingCatRes.status);

      if (billingServRes.ok) setBillingServices(await safeJson(billingServRes, []));
      else console.warn('Billing-services endpoint error:', billingServRes.status);

      if (customerRes.ok) setBillingCustomers(await safeJson(customerRes, []));
      else console.warn('Customers endpoint error:', customerRes.status);

      if (jewRes.ok) setRentalJewellery(await safeJson(jewRes, []));
      else console.warn('Rental Jewellery endpoint error:', jewRes.status);
      
      if (jewBookRes.ok) setRentalBookings(await safeJson(jewBookRes, []));
      else console.warn('Rental Bookings endpoint error:', jewBookRes.status);

      if (jewCatRes && jewCatRes.ok) setRentalCategories(await safeJson(jewCatRes, []));
      else console.warn('Rental Categories endpoint error:', jewCatRes?.status);
    } catch (err: any) {
      console.error("Dashboard connection error:", err);
      setError(err.message || 'Failed to connect to the backend server. Please make sure the backend is running.');
    }
    setLoading(false);
  };

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        const errorData = await res.json();
        showToast('Failed to update booking status: ' + (errorData.message || 'Unknown error'), 'error');
      } else {
        showToast('Booking status updated successfully!', 'success');
        
        // If the booking is marked as Confirmed, open a WhatsApp link with a custom message
        if (status === 'Confirmed') {
          const booking = bookings.find(item => item._id === id);
          if (booking && booking.contactNumber) {
            let phone = booking.contactNumber.trim();
            // If phone starts with 0, replace with Sri Lankan country code (94)
            if (phone.startsWith('0')) {
              phone = '94' + phone.substring(1);
            }
            // Remove spaces, plus signs, dashes
            phone = phone.replace(/[\s+\-]/g, '');
            
            const messageText = `Dear ${booking.fullName},\n\nYour booking for *${booking.serviceRequested}* on *${booking.preferredDate || 'the requested date'}* at *${booking.timeSlot || 'the requested time'}* has been *Confirmed*! ✦\n\nThank you for choosing Mathumi.\nWe look forward to seeing you.`;
            const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(messageText)}`;
            window.open(waUrl, '_blank');
          }
        }
      }
      fetchAllData(token!);
    } catch (err) {
      console.error(err);
      showToast('Network error while updating status.', 'error');
    }
  };

  const handleUpdateSareeStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/sarees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        const errorData = await res.json();
        showToast('Failed to update saree status: ' + (errorData.message || 'Unknown error'), 'error');
      } else {
        showToast('Saree status updated successfully!', 'success');
        fetchAllData(token!);
      }
    } catch (err) {
      console.error(err);
      showToast('Network error while updating saree status.', 'error');
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/inquiries/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        const errorData = await res.json();
        showToast('Failed to update inquiry status: ' + (errorData.message || 'Unknown error'), 'error');
      } else {
        showToast('Inquiry status updated successfully!', 'success');
      }
      fetchAllData(token!);
    } catch (err) {
      console.error(err);
      showToast('Network error while updating status.', 'error');
    }
  };

  const handleSaveSaree = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = isEditing ? `${API_BASE}/api/sarees/${sareeForm._id}` : `${API_BASE}/api/sarees`;
    const method = isEditing ? 'PUT' : 'POST';

    // Remove empty _id so Mongoose generates one
    const payload: any = { ...sareeForm };
    if (!payload._id) {
      delete payload._id;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(isEditing ? "Saree updated successfully!" : "Saree added successfully!", 'success');
        setIsEditModalOpen(false);
        fetchAllData(token!);
      } else {
        const errorData = await res.json();
        showToast("Failed to save saree: " + (errorData.message || 'Unknown error'), 'error');
      }
    } catch (err) {
      console.error(err);
      showToast("Network error while saving saree.", 'error');
    }
  };

  const handleDeleteSaree = async (id: string) => {
    if (!confirm("Are you sure you want to delete this saree?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/sarees/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast("Saree deleted successfully!", 'success');
        fetchAllData(token!);
      } else {
        showToast("Failed to delete saree", 'error');
      }
    } catch (err) {
      console.error(err);
      showToast("Network error while deleting saree.", 'error');
    }
  };

  const openAddModal = () => {
    setSareeForm({ 
      _id: '', 
      name: '', 
      price: '', 
      image: '', 
      images: [],
      color: '',
      category: '',
      type: 'SAREE',
      fabric: '',
      zari: '',
      description: ''
    });
    setIsEditing(false);
    setIsEditModalOpen(true);
  };

  const openEditModal = (saree: any) => {
    setSareeForm({
      _id: saree._id || '',
      name: saree.name || '',
      price: saree.price || '',
      image: saree.image || '',
      images: Array.isArray(saree.images) ? saree.images : (saree.image ? [saree.image] : []),
      color: saree.color || '',
      category: saree.category || 'Pure Kanchipuram Silk Sarees',
      type: saree.type || 'SAREE',
      fabric: saree.fabric || '',
      zari: saree.zari || '',
      description: saree.description || saree.desc || ''
    });
    setIsEditing(true);
    setIsEditModalOpen(true);
  };

  // --- SERVICE HANDLERS ---
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = isEditingService ? `${API_BASE}/api/salon-services/${serviceForm._id}` : `${API_BASE}/api/salon-services`;
    const method = isEditingService ? 'PUT' : 'POST';
    const payload: any = { ...serviceForm };
    if (!payload._id) delete payload._id;

    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(payload) });
      if (res.ok) { 
        showToast("Service saved successfully!", "success"); 
        setIsServiceModalOpen(false); 
        fetchAllData(token!); 
      } else {
        showToast("Failed to save service", "error");
      }
    } catch (err) { 
      console.error(err);
      showToast("Network error while saving service.", "error");
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/salon-services/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { 
        showToast("Service deleted successfully!", "success"); 
        fetchAllData(token!); 
      } else {
        showToast("Failed to delete service", "error");
      }
    } catch (err) { 
      console.error(err); 
      showToast("Network error while deleting service.", "error");
    }
  };

  const openAddServiceModal = () => { 
    const defaultCat = salonCategories.length > 0 ? salonCategories[0].name : 'Hair Styling';
    setServiceForm({ _id: '', title: '', category: defaultCat, description: '', image: '', images: [] }); 
    setIsEditingService(false); 
    setIsServiceModalOpen(true); 
  };
  const openEditServiceModal = (s: any) => { 
    setServiceForm({
      ...s,
      images: s.images || (s.image ? s.image.split(',') : [])
    }); 
    setIsEditingService(true); 
    setIsServiceModalOpen(true); 
  };

  // --- SALON CATEGORY HANDLERS ---
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = isEditingCategory ? `${API_BASE}/api/salon-categories/${categoryForm._id}` : `${API_BASE}/api/salon-categories`;
    const method = isEditingCategory ? 'PUT' : 'POST';
    const payload: any = { ...categoryForm };
    if (!payload._id) delete payload._id;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(isEditingCategory ? "Category updated successfully!" : "Category added successfully!", "success");
        setIsCategoryModalOpen(false);
        fetchAllData(token!);
      } else {
        const errorData = await res.json();
        showToast("Failed to save category: " + (errorData.message || 'Unknown error'), "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving category", "error");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? Any services in this category might need to be reassigned manually.")) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/salon-categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast("Category deleted successfully!", "success");
        fetchAllData(token!);
      } else {
        showToast("Failed to delete category", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error while deleting category.", "error");
    }
  };

  const openAddCategoryModal = () => {
    setCategoryForm({ _id: '', name: '', description: '', image: '', images: [] });
    setIsEditingCategory(false);
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (c: any) => {
    setCategoryForm({
      _id: c._id || '',
      name: c.name || '',
      description: c.description || '',
      image: c.image || '',
      images: c.images || (c.image ? [c.image] : [])
    });
    setIsEditingCategory(true);
    setIsCategoryModalOpen(true);
  };

  // --- GALLERY HANDLERS ---
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = isEditingGallery ? `${API_BASE}/api/gallery/${galleryForm._id}` : `${API_BASE}/api/gallery`;
    const method = isEditingGallery ? 'PUT' : 'POST';
    const payload: any = { ...galleryForm };
    if (!payload._id) delete payload._id;

    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(payload) });
      if (res.ok) { 
        showToast("Gallery image saved successfully!", "success"); 
        setIsGalleryModalOpen(false); 
        fetchAllData(token!); 
      } else {
        showToast("Failed to save gallery image", "error");
      }
    } catch (err) { 
      console.error(err);
      showToast("Network error while saving gallery image.", "error");
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/gallery/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { 
        showToast("Gallery image deleted successfully!", "success"); 
        fetchAllData(token!); 
      } else {
        showToast("Failed to delete gallery image", "error");
      }
    } catch (err) { 
      console.error(err);
      showToast("Network error while deleting gallery image.", "error");
    }
  };

  const openAddGalleryModal = () => { setGalleryForm({ _id: '', title: '', category: 'Bridal', url: '' }); setIsEditingGallery(false); setIsGalleryModalOpen(true); };
  const openEditGalleryModal = (g: any) => { setGalleryForm(g); setIsEditingGallery(true); setIsGalleryModalOpen(true); };

  // --- ACADEMY HANDLERS ---
  const handleSaveAcademy = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = isEditingAcademy ? `${API_BASE}/api/academy-courses/${academyForm._id}` : `${API_BASE}/api/academy-courses`;
    const method = isEditingAcademy ? 'PUT' : 'POST';
    
    let parsedSyllabus: string | string[] = academyForm.syllabus;
    if (typeof parsedSyllabus === 'string') {
      parsedSyllabus = parsedSyllabus.split('\n').filter(s => s.trim() !== '');
    }

    const payload: any = { ...academyForm, syllabus: parsedSyllabus };
    if (!payload._id) delete payload._id;

    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(payload) });
      if (res.ok) { 
        showToast("Academy course saved successfully!", "success"); 
        setIsAcademyModalOpen(false); 
        fetchAllData(token!); 
      } else {
        showToast("Failed to save academy course", "error");
      }
    } catch (err) { 
      console.error(err);
      showToast("Network error while saving academy course.", "error");
    }
  };

  const handleDeleteAcademy = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/academy-courses/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { 
        showToast("Academy course deleted successfully!", "success"); 
        fetchAllData(token!); 
      } else {
        showToast("Failed to delete academy course", "error");
      }
    } catch (err) { 
      console.error(err);
      showToast("Network error while deleting academy course.", "error");
    }
  };

  const openAddAcademyModal = () => { setAcademyForm({ _id: '', title: '', duration: '', price: '', image: '', images: [], syllabus: '' }); setIsEditingAcademy(false); setIsAcademyModalOpen(true); };
  const openEditAcademyModal = (c: any) => { 
    const syllabusString = Array.isArray(c.syllabus) ? c.syllabus.join('\n') : (c.syllabus || '');
    const courseImages = Array.isArray(c.images) && c.images.length > 0 ? c.images : (c.image ? [c.image] : []);
    setAcademyForm({ ...c, syllabus: syllabusString, images: courseImages }); 
    setIsEditingAcademy(true); 
    setIsAcademyModalOpen(true); 
  };

  // --- STAFF HANDLERS ---
  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    if (!token) {
      showToast('Authentication token missing. Please log in again.', 'error');
      router.push('/admin/login');
      return;
    }
    const url = isEditingStaff
      ? `${API_BASE}/api/staff/${staffForm._id}`
      : `${API_BASE}/api/staff`;
    const method = isEditingStaff ? 'PUT' : 'POST';
    const payload: any = { ...staffForm };
    if (!payload._id) delete payload._id;
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(isEditingStaff ? 'Staff member updated!' : 'Staff member added!', 'success');
        setIsStaffModalOpen(false);
        fetchAllData(token);
      } else {
        // Detailed error logging for debugging
        const errorStatus = res.status;
        const errorBody = await res.text();
        console.error('Staff save failed with status', errorStatus, 'and body', errorBody);
        const err = await safeJson(res, {});
        showToast('Failed to save staff: ' + (err.message || 'Unknown error'), 'error');
      }

    } catch (err) {
      console.error(err);
      showToast('Network error while saving staff member.', 'error');
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/staff/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) { 
        showToast('Staff member deleted!', 'success'); 
        fetchAllData(token!); 
      } else {
        showToast('Failed to delete staff member', 'error');
      }
    } catch (err) { 
      console.error(err); 
      showToast('Network error while deleting staff member.', 'error');
    }
  };

  const openAddStaffModal = () => {
    setStaffForm({ _id: '', name: '', address: '', mobile: '', whatsapp: '', nic: '', dob: '', photo: '', role: 'Beauty Therapist' });
    setIsEditingStaff(false);
    setIsStaffModalOpen(true);
  };
  const openEditStaffModal = (s: any) => {
    setStaffForm({ ...s });
    setIsEditingStaff(true);
    setIsStaffModalOpen(true);
  };

  // --- BILLING CATEGORY POS HANDLERS ---
  const handleSaveBillingCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = isEditingBillingCategory 
      ? `${API_BASE}/api/billing-categories/${billingCategoryForm._id}` 
      : `${API_BASE}/api/billing-categories`;
    const method = isEditingBillingCategory ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: billingCategoryForm.name })
      });
      if (res.ok) {
        showToast(isEditingBillingCategory ? "Category updated successfully!" : "Category added successfully!", 'success');
        setIsBillingCategoryModalOpen(false);
        fetchAllData(token!);
      } else {
        const errorData = await res.json().catch(() => ({}));
        showToast("Failed to save category: " + (errorData.message || `Status ${res.status}`), 'error');
      }
    } catch (err) {
      console.error(err);
      showToast("Network error while saving category", 'error');
    }
  };

  const handleDeleteBillingCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/billing-categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast("Category deleted successfully!", 'success');
        fetchAllData(token!);
      } else {
        showToast("Failed to delete category", 'error');
      }
    } catch (err) {
      console.error(err);
      showToast("Network error while deleting category", 'error');
    }
  };

  const openAddBillingCategoryModal = () => {
    setBillingCategoryForm({ _id: '', name: '' });
    setIsEditingBillingCategory(false);
    setIsBillingCategoryModalOpen(true);
  };

  const openEditBillingCategoryModal = (cat: any) => {
    setBillingCategoryForm({ _id: cat._id, name: cat.name });
    setIsEditingBillingCategory(true);
    setIsBillingCategoryModalOpen(true);
  };

  // --- BILLING SERVICE POS HANDLERS ---
  const handleSaveBillingService = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = isEditingBillingService 
      ? `${API_BASE}/api/billing-services/${billingServiceForm._id}` 
      : `${API_BASE}/api/billing-services`;
    const method = isEditingBillingService ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(billingServiceForm)
      });
      if (res.ok) {
        showToast(isEditingBillingService ? "Service updated successfully!" : "Service added successfully!", 'success');
        setIsBillingServiceModalOpen(false);
        fetchAllData(token!);
      } else {
        const errorData = await res.json().catch(() => ({}));
        showToast("Failed to save service: " + (errorData.message || `Status ${res.status}`), 'error');
      }
    } catch (err) {
      console.error(err);
      showToast("Network error while saving service", 'error');
    }
  };

  const handleDeleteBillingService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/billing-services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast("Service deleted successfully!", 'success');
        fetchAllData(token!);
      } else {
        showToast("Failed to delete service", 'error');
      }
    } catch (err) {
      console.error(err);
      showToast("Network error while deleting service", 'error');
    }
  };

  const openAddBillingServiceModal = () => {
    const defaultCat = billingCategories.length > 0 ? billingCategories[0].name : '';
    setBillingServiceForm({ _id: '', name: '', category: defaultCat, price: '', commissionValue: '', commissionType: 'percentage' });
    setIsEditingBillingService(false);
    setIsBillingServiceModalOpen(true);
  };

  const openEditBillingServiceModal = (s: any) => {
    setBillingServiceForm({
      _id: s._id || '',
      name: s.name || '',
      category: s.category || '',
      price: s.price || '',
      commissionValue: s.commissionValue !== undefined ? s.commissionValue : (s.commission || ''),
      commissionType: s.commissionType || 'percentage'
    });
    setIsEditingBillingService(true);
    setIsBillingServiceModalOpen(true);
  };

  // --- CUSTOMER POS HANDLERS ---
  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappClean = customerForm.whatsapp.trim();
    if (!/^\d+$/.test(whatsappClean)) {
      showToast("WhatsApp number must contain only digits!", 'error');
      return;
    }
    const isDuplicate = billingCustomers.some(c => c.whatsapp.trim() === whatsappClean && c._id !== customerForm._id);
    if (isDuplicate) {
      showToast("WhatsApp number must be unique! This number is already registered.", 'error');
      return;
    }

    const token = localStorage.getItem('adminToken');
    const url = isEditingCustomer 
      ? `${API_BASE}/api/customers/${customerForm._id}` 
      : `${API_BASE}/api/customers`;
    const method = isEditingCustomer ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(customerForm)
      });
      if (res.ok) {
        showToast(isEditingCustomer ? "Customer updated successfully!" : "Customer registered successfully!", 'success');
        setIsCustomerModalOpen(false);
        fetchAllData(token!);
      } else {
        const errorData = await res.json().catch(() => ({}));
        showToast("Failed to save customer data: " + (errorData.message || `Status ${res.status}`), 'error');
      }
    } catch (err) {
      console.error(err);
      showToast("Network error while saving customer data", 'error');
    }
  };

  const openAddCustomerModal = () => {
    setCustomerForm({ _id: '', name: '', whatsapp: '', phone: '', address: '' });
    setIsEditingCustomer(false);
    setIsCustomerModalOpen(true);
  };

  const openEditCustomerModal = (c: any) => {
    setCustomerForm({ ...c });
    setIsEditingCustomer(true);
    setIsCustomerModalOpen(true);
  };

  // --- RENTAL JEWELLERY HANDLERS ---
  const handleSaveJewellery = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = isEditingJewellery 
      ? `${API_BASE}/api/rental-jewellery/${jewelleryForm._id}` 
      : `${API_BASE}/api/rental-jewellery`;
    const method = isEditingJewellery ? 'PUT' : 'POST';

    // Validation: Check if Jewellery Number is unique in the catalog
    const enteredNumber = jewelleryForm.jewelleryNumber.trim().toLowerCase();
    const isDuplicate = rentalJewellery.some(item => {
      // Skip check against self if editing
      if (isEditingJewellery && item._id === jewelleryForm._id) {
        return false;
      }
      return item.jewelleryNumber?.trim().toLowerCase() === enteredNumber;
    });

    if (isDuplicate) {
      showToast(`Jewellery ID "${jewelleryForm.jewelleryNumber}" is already in use. Please enter a unique ID.`, 'error');
      return;
    }

    const payload: any = { ...jewelleryForm };
    if (!payload._id) delete payload._id;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(isEditingJewellery ? "Jewellery updated successfully!" : "Jewellery added successfully!", 'success');
        setIsJewelleryModalOpen(false);
        fetchAllData(token!);
      } else {
        const errorData = await res.json().catch(() => ({}));
        showToast("Failed to save jewellery: " + (errorData.message || `Status ${res.status}`), 'error');
      }
    } catch (err) {
      console.error(err);
      showToast("Network error while saving jewellery", 'error');
    }
  };

  const handleDeleteJewellery = async (id: string) => {
    if (!confirm("Are you sure you want to delete this jewellery item?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/rental-jewellery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast("Jewellery item deleted successfully!", 'success');
        fetchAllData(token!);
      } else {
        showToast("Failed to delete jewellery item", 'error');
      }
    } catch (err) {
      console.error(err);
      showToast("Network error while deleting jewellery item", 'error');
    }
  };

  const handleToggleHideJewellery = async (item: any) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/rental-jewellery/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...item, hidden: !item.hidden })
      });
      if (res.ok) {
        showToast(item.hidden ? "Jewellery item is now visible!" : "Jewellery item is now hidden!", 'success');
        fetchAllData(token!);
      } else {
        showToast("Failed to update status", 'error');
      }
    } catch (err) {
      console.error(err);
      showToast("Network error while updating status", 'error');
    }
  };

  const openAddJewelleryModal = () => {
    const defaultCat = rentalCategories.length > 0 ? rentalCategories[0].name : '';
    setJewelleryForm({
      _id: '',
      name: '',
      jewelleryNumber: '',
      image: '',
      images: [],
      description: '',
      hidden: false,
      category: defaultCat
    });
    setIsEditingJewellery(false);
    setIsJewelleryModalOpen(true);
  };

  const openEditJewelleryModal = (item: any) => {
    const imgs: string[] = Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : (item.image ? [item.image] : []);
    setJewelleryForm({
      _id: item._id || '',
      name: item.name || '',
      jewelleryNumber: item.jewelleryNumber || '',
      image: item.image || (imgs[0] || ''),
      images: imgs,
      description: item.description || '',
      hidden: !!item.hidden,
      category: item.category || ''
    });
    setIsEditingJewellery(true);
    setIsJewelleryModalOpen(true);
  };

  // --- RENTAL JEWELLERY CATEGORY HANDLERS ---
  const handleSaveJewelleryCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = isEditingJewelleryCategory 
      ? `${API_BASE}/api/rental-categories/${jewelleryCategoryForm._id}` 
      : `${API_BASE}/api/rental-categories`;
    const method = isEditingJewelleryCategory ? 'PUT' : 'POST';

    if (!jewelleryCategoryForm.name.trim()) {
      showToast("Category name is required", 'error');
      return;
    }

    const payload: any = { ...jewelleryCategoryForm };
    if (!payload._id) delete payload._id;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast(isEditingJewelleryCategory ? "Category updated successfully!" : "Category added successfully!", 'success');
        setIsJewelleryCategoryModalOpen(false);
        fetchAllData(token!);
      } else {
        const errorData = await res.json().catch(() => ({}));
        showToast("Failed to save category: " + (errorData.message || `Status ${res.status}`), 'error');
      }
    } catch (err) {
      console.error(err);
      showToast("Network error while saving category", 'error');
    }
  };

  const handleDeleteJewelleryCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? Any items belonging to this category will need category updates.")) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/rental-categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast("Category deleted successfully!", 'success');
        fetchAllData(token!);
      } else {
        showToast("Failed to delete category", 'error');
      }
    } catch (err) {
      console.error(err);
      showToast("Network error while deleting category", 'error');
    }
  };

  const handleToggleHideJewelleryCategory = async (item: any) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/rental-categories/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...item, hidden: !item.hidden })
      });
      if (res.ok) {
        showToast(item.hidden ? "Category is now visible!" : "Category is now hidden!", 'success');
        fetchAllData(token!);
      } else {
        showToast("Failed to update status", 'error');
      }
    } catch (err) {
      console.error(err);
      showToast("Network error while updating status", 'error');
    }
  };

  const openAddJewelleryCategoryModal = () => {
    setJewelleryCategoryForm({
      _id: '',
      name: '',
      image: '/hero-saree.png',
      hidden: false
    });
    setIsEditingJewelleryCategory(false);
    setIsJewelleryCategoryModalOpen(true);
  };

  const openEditJewelleryCategoryModal = (item: any) => {
    setJewelleryCategoryForm({
      _id: item._id || '',
      name: item.name || '',
      image: item.image || '/hero-saree.png',
      hidden: !!item.hidden
    });
    setIsEditingJewelleryCategory(true);
    setIsJewelleryCategoryModalOpen(true);
  };

  const handleUpdateRentalBookingStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${API_BASE}/api/rental-bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        showToast('Failed to update rental booking status: ' + (errorData.message || 'Unknown error'), 'error');
      } else {
        showToast('Rental booking status updated successfully!', 'success');
        fetchAllData(token!);
      }
    } catch (err) {
      console.error(err);
      showToast('Network error while updating booking status.', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-[#f4e8d3] w-full relative">
      
      {/* ── Mobile Overlay Backdrop ── */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-[#3a1f0d] text-[#fdf5eb] flex flex-col shadow-2xl z-50
        transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto md:shrink-0
      `}>
        <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.jpeg" 
              alt="Mathumi Logo" 
              className="object-cover h-14 w-14 rounded-full border-2 border-[#d4af37]" 
            />
            <h1 className="text-lg md:text-xl font-bold font-serif tracking-wider">Admin Panel</h1>
          </div>
          {/* Close button inside sidebar on mobile */}
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden text-[#d4af37] hover:text-white focus:outline-none p-1"
            aria-label="Close Navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Sidebar nav links */}
        <div className="flex flex-col flex-grow p-4 gap-2 overflow-y-auto">
          {([
            { key: 'dashboard', label: '📊 Dashboard' },
            { key: 'bookings', label: '📅 Bookings' },
            { key: 'inquiries', label: '💌 Inquiries' },
            { key: 'manageSarees', label: '👘 Manage Sarees' },
            { key: 'manageAcademy', label: '🎓 Manage Academy' },
            { key: 'manageSalon', label: '✂️ Salon Services' },
            { key: 'manageCategories', label: '🏷️ Salon Categories' },
            { key: 'manageGallery', label: '🖼️ Gallery' },
            { key: 'manageStaff', label: '👤 Staff Members' },
            { key: 'manageJewellery', label: '💎 Rental Jewellery' },
            { key: 'manageJewelleryCategories', label: '🗂️ Jewellery Categories' },
            { key: 'jewelleryBookings', label: '📿 Jewellery Bookings' },
          ] as { key: string; label: string }[]).map(({ key, label }) => (
            <button 
              key={key}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-all text-sm ${
                activeTab === key 
                  ? 'bg-[#d4af37] text-[#3a1f0d] shadow-md' 
                  : 'text-[#eacda3] hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => {
                setActiveTab(key as any);
                setIsMobileSidebarOpen(false);
              }}
            >
              <span className="capitalize">{label}</span>
            </button>
          ))}

          {/* Billing & POS Group */}
          <div className="flex flex-col gap-1 mt-2">
            <button 
              className={`text-left px-4 py-3 rounded-lg font-medium transition-all text-sm flex justify-between items-center ${
                activeTab === 'billingCategories' || activeTab === 'billingServices' || activeTab === 'billingCustomers' || activeTab === 'billingPOS'
                  ? 'bg-[#d4af37]/20 text-[#d4af37]' 
                  : 'text-[#eacda3] hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => setIsPOSExpanded(!isPOSExpanded)}
            >
              <span>💳 Billing & POS</span>
              <span className="text-[10px]">{isPOSExpanded ? '▼' : '▶'}</span>
            </button>
            
            {isPOSExpanded && (
              <div className="pl-4 flex flex-col gap-1 mt-1 border-l border-[#d4af37]/30">
                <button
                  className={`text-left px-4 py-2 rounded-lg font-medium transition-all text-xs ${
                    activeTab === 'billingPOS'
                      ? 'bg-[#d4af37] text-[#3a1f0d] shadow-md'
                      : 'text-[#eacda3] hover:bg-white/5 hover:text-white'
                  }`}
                  onClick={() => {
                    setActiveTab('billingPOS');
                    setIsMobileSidebarOpen(false);
                  }}
                >
                  🔸 Create Invoice / POS
                </button>
                <button
                  className={`text-left px-4 py-2 rounded-lg font-medium transition-all text-xs ${
                    activeTab === 'billingServices'
                      ? 'bg-[#d4af37] text-[#3a1f0d] shadow-md'
                      : 'text-[#eacda3] hover:bg-white/5 hover:text-white'
                  }`}
                  onClick={() => {
                    setActiveTab('billingServices');
                    setIsMobileSidebarOpen(false);
                  }}
                >
                  🔸 Categories & Services
                </button>
                <button
                  className={`text-left px-4 py-2 rounded-lg font-medium transition-all text-xs ${
                    activeTab === 'billingCustomers'
                      ? 'bg-[#d4af37] text-[#3a1f0d] shadow-md'
                      : 'text-[#eacda3] hover:bg-white/5 hover:text-white'
                  }`}
                  onClick={() => {
                    setActiveTab('billingCustomers');
                    setIsMobileSidebarOpen(false);
                  }}
                >
                  🔸 Customer Registry
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full bg-[#800020] text-white px-4 py-3 rounded-lg font-bold tracking-wider shadow hover:bg-red-800 transition">
            LOGOUT
          </button>
        </div>
      </div>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden sticky top-0 z-30 bg-[#3a1f0d] text-[#fdf5eb] px-4 py-3 flex items-center gap-3 shadow-lg">
          <button 
            onClick={() => setIsMobileSidebarOpen(true)}
            className="text-[#d4af37] hover:text-white focus:outline-none p-1"
            aria-label="Open Navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <img src="/logo.jpeg" alt="Mathumi Logo" className="object-cover h-8 w-8 rounded-full border border-[#d4af37]" />
          <span className="font-bold font-serif tracking-wider text-sm">Admin Panel</span>
          <span className="ml-auto text-[#d4af37] font-sans font-bold text-xs uppercase tracking-widest capitalize">{activeTab.replace(/([A-Z])/g, ' $1').trim()}</span>
        </div>

        {/* Main Content */}
        <div className="flex-grow p-4 md:p-8 overflow-y-auto">
          <div className="glass-panel bg-white/70 p-4 md:p-8 rounded-2xl border border-white/40 shadow-lg min-h-full">
          {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-[#4a2511] font-bold text-xl animate-pulse">Loading data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50/90 border border-red-200 text-red-900 p-8 rounded-2xl text-center shadow-lg max-w-xl mx-auto my-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-3xl font-bold">⚠️</span>
            </div>
            <h3 className="text-2xl font-bold font-serif text-[#4a2511] mb-2">Connection Error</h3>
            <p className="text-sm font-semibold mb-6 text-red-700">{error}</p>
            <button 
              onClick={() => {
                const token = localStorage.getItem('adminToken');
                if (token) fetchAllData(token);
              }} 
              className="bg-[#6e1224] text-white font-bold py-3 px-8 rounded-full hover:bg-red-800 transition shadow-md tracking-wider text-xs uppercase"
            >
              Retry Connection
            </button>
          </div>
        ) : activeTab === 'dashboard' ? (
          <div className="space-y-8 w-full">
            {/* Bookings Section */}
            <div>
              <h2 className="text-md font-serif font-bold text-[#4a2511] uppercase tracking-wider mb-4 border-b border-[#d4af37]/25 pb-2">Bookings Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                
                {/* Pending Bookings */}
                <div 
                  onClick={() => setActiveTab('bookings')}
                  className="gold-panel p-6 text-center bg-white border border-[#c2a670]/15 shadow-sm hover:shadow-md hover:border-[#6e1224]/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 relative flex flex-col justify-between min-h-[140px]"
                >
                  <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Pending</div>
                  <div>
                    <h3 className="text-[10px] font-bold text-[#1c1512]/60 uppercase tracking-widest mb-1.5 mt-2">Pending</h3>
                    <p className="text-4xl font-light text-[#b45309] font-serif">{bookings.filter(b => b.status === 'Pending' || !b.status).length}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-3 border-t border-[#c2a670]/10 pt-2 font-medium">Awaiting response</div>
                </div>

                {/* Confirmed Bookings */}
                <div 
                  onClick={() => setActiveTab('bookings')}
                  className="gold-panel p-6 text-center bg-white border border-[#c2a670]/15 shadow-sm hover:shadow-md hover:border-[#6e1224]/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 relative flex flex-col justify-between min-h-[140px]"
                >
                  <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Confirmed</div>
                  <div>
                    <h3 className="text-[10px] font-bold text-[#1c1512]/60 uppercase tracking-widest mb-1.5 mt-2">Confirmed</h3>
                    <p className="text-4xl font-light text-[#1d4ed8] font-serif">{bookings.filter(b => b.status === 'Confirmed').length}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-3 border-t border-[#c2a670]/10 pt-2 font-medium">Scheduled slots</div>
                </div>

                {/* Completed Bookings */}
                <div 
                  onClick={() => setActiveTab('bookings')}
                  className="gold-panel p-6 text-center bg-white border border-[#c2a670]/15 shadow-sm hover:shadow-md hover:border-[#6e1224]/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 relative flex flex-col justify-between min-h-[140px]"
                >
                  <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Completed</div>
                  <div>
                    <h3 className="text-[10px] font-bold text-[#1c1512]/60 uppercase tracking-widest mb-1.5 mt-2">Completed</h3>
                    <p className="text-4xl font-light text-[#16a34a] font-serif">{bookings.filter(b => b.status === 'Completed').length}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-3 border-t border-[#c2a670]/10 pt-2 font-medium">Fulfilled sessions</div>
                </div>

                {/* Cancelled Bookings */}
                <div 
                  onClick={() => setActiveTab('bookings')}
                  className="gold-panel p-6 text-center bg-white border border-[#c2a670]/15 shadow-sm hover:shadow-md hover:border-[#6e1224]/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 relative flex flex-col justify-between min-h-[140px]"
                >
                  <div className="absolute top-2 right-2 bg-red-100 text-red-800 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Cancelled</div>
                  <div>
                    <h3 className="text-[10px] font-bold text-[#1c1512]/60 uppercase tracking-widest mb-1.5 mt-2">Cancelled</h3>
                    <p className="text-4xl font-light text-[#dc2626] font-serif">{bookings.filter(b => b.status === 'Cancelled').length}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-3 border-t border-[#c2a670]/10 pt-2 font-medium">Revoked requests</div>
                </div>

                {/* Total Bookings */}
                <div 
                  onClick={() => setActiveTab('bookings')}
                  className="gold-panel p-6 text-center bg-white border border-[#c2a670]/15 shadow-sm hover:shadow-md hover:border-[#6e1224]/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 relative flex flex-col justify-between min-h-[140px]"
                >
                  <div className="absolute top-2 right-2 bg-[#6e1224]/10 text-[#6e1224] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">All</div>
                  <div>
                    <h3 className="text-[10px] font-bold text-[#1c1512]/60 uppercase tracking-widest mb-1.5 mt-2">Total</h3>
                    <p className="text-4xl font-light text-[#6e1224] font-serif">{bookings.length}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-3 border-t border-[#c2a670]/10 pt-2 font-medium">All time reservations</div>
                </div>

              </div>
            </div>

            {/* Business Operations Section */}
            <div>
              <h2 className="text-md font-serif font-bold text-[#4a2511] uppercase tracking-wider mb-4 border-b border-[#d4af37]/25 pb-2">Catalog & Inquiries Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

                {/* New Inquiries */}
                <div 
                  onClick={() => setActiveTab('inquiries')}
                  className="gold-panel p-6 text-center bg-white border border-[#c2a670]/15 shadow-sm hover:shadow-md hover:border-[#6e1224]/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 relative flex flex-col justify-between min-h-[140px]"
                >
                  <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">New</div>
                  <div>
                    <h3 className="text-[10px] font-bold text-[#1c1512]/60 uppercase tracking-widest mb-1.5 mt-2">New Inquiries</h3>
                    <p className="text-4xl font-light text-[#b45309] font-serif">{inquiries.filter(i => i.status === 'New' || i.status === 'Pending' || !i.status).length}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-3 border-t border-[#c2a670]/10 pt-2 font-medium">Boutique items</div>
                </div>

                {/* Total Inquiries */}
                <div 
                  onClick={() => setActiveTab('inquiries')}
                  className="gold-panel p-6 text-center bg-white border border-[#c2a670]/15 shadow-sm hover:shadow-md hover:border-[#6e1224]/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 relative flex flex-col justify-between min-h-[140px]"
                >
                  <div className="absolute top-2 right-2 bg-[#6e1224]/10 text-[#6e1224] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Total</div>
                  <div>
                    <h3 className="text-[10px] font-bold text-[#1c1512]/60 uppercase tracking-widest mb-1.5 mt-2">Total Inquiries</h3>
                    <p className="text-4xl font-light text-[#6e1224] font-serif">{inquiries.length}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-3 border-t border-[#c2a670]/10 pt-2 font-medium">All shop requests</div>
                </div>

                {/* Saree Catalog */}
                <div 
                  onClick={() => setActiveTab('manageSarees')}
                  className="gold-panel p-6 text-center bg-white border border-[#c2a670]/15 shadow-sm hover:shadow-md hover:border-[#6e1224]/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 relative flex flex-col justify-between min-h-[140px]"
                >
                  <div className="absolute top-2 right-2 bg-[#c2a670]/15 text-[#c2a670] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Items</div>
                  <div>
                    <h3 className="text-[10px] font-bold text-[#1c1512]/60 uppercase tracking-widest mb-1.5 mt-2">Saree Catalog</h3>
                    <p className="text-4xl font-light text-[#4a2511] font-serif">{sarees.length}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-3 border-t border-[#c2a670]/10 pt-2 font-medium">Boutique stock size</div>
                </div>

                {/* Salon Services */}
                <div 
                  onClick={() => setActiveTab('manageSalon')}
                  className="gold-panel p-6 text-center bg-white border border-[#c2a670]/15 shadow-sm hover:shadow-md hover:border-[#6e1224]/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 relative flex flex-col justify-between min-h-[140px]"
                >
                  <div className="absolute top-2 right-2 bg-[#c2a670]/15 text-[#c2a670] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Salon</div>
                  <div>
                    <h3 className="text-[10px] font-bold text-[#1c1512]/60 uppercase tracking-widest mb-1.5 mt-2">Salon Services</h3>
                    <p className="text-4xl font-light text-[#4a2511] font-serif">{salonServices.length}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-3 border-t border-[#c2a670]/10 pt-2 font-medium">Hair & skin treatments</div>
                </div>

                {/* Academy Courses */}
                <div 
                  onClick={() => setActiveTab('manageAcademy')}
                  className="gold-panel p-6 text-center bg-white border border-[#c2a670]/15 shadow-sm hover:shadow-md hover:border-[#6e1224]/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 relative flex flex-col justify-between min-h-[140px]"
                >
                  <div className="absolute top-2 right-2 bg-[#c2a670]/15 text-[#c2a670] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Accredited</div>
                  <div>
                    <h3 className="text-[10px] font-bold text-[#1c1512]/60 uppercase tracking-widest mb-1.5 mt-2">Academy Courses</h3>
                    <p className="text-4xl font-light text-[#4a2511] font-serif">{academyCourses.length}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-3 border-t border-[#c2a670]/10 pt-2 font-medium">Active curriculums</div>
                </div>

              </div>
            </div>

            {/* Rental Categories Section */}
            <div>
              <h2 className="text-md font-serif font-bold text-[#4a2511] uppercase tracking-wider mb-4 border-b border-[#d4af37]/25 pb-2">Jewellery Categories Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                
                {/* Total Categories */}
                <div 
                  onClick={() => setActiveTab('manageJewelleryCategories')}
                  className="gold-panel p-6 text-center bg-white border border-[#c2a670]/15 shadow-sm hover:shadow-md hover:border-[#6e1224]/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 relative flex flex-col justify-between min-h-[140px]"
                >
                  <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Total</div>
                  <div>
                    <h3 className="text-[10px] font-bold text-[#1c1512]/60 uppercase tracking-widest mb-1.5 mt-2">Total Categories</h3>
                    <p className="text-4xl font-light text-[#4a2511] font-serif">{rentalCategories.length}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-3 border-t border-[#c2a670]/10 pt-2 font-medium">All item categories</div>
                </div>

                {/* Active Categories */}
                <div 
                  onClick={() => setActiveTab('manageJewelleryCategories')}
                  className="gold-panel p-6 text-center bg-white border border-[#c2a670]/15 shadow-sm hover:shadow-md hover:border-[#6e1224]/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 relative flex flex-col justify-between min-h-[140px]"
                >
                  <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Active</div>
                  <div>
                    <h3 className="text-[10px] font-bold text-[#1c1512]/60 uppercase tracking-widest mb-1.5 mt-2">Active Categories</h3>
                    <p className="text-4xl font-light text-green-700 font-serif">{rentalCategories.filter(c => !c.hidden).length}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-3 border-t border-[#c2a670]/10 pt-2 font-medium">Visible to customers</div>
                </div>

                {/* Hidden Categories */}
                <div 
                  onClick={() => setActiveTab('manageJewelleryCategories')}
                  className="gold-panel p-6 text-center bg-white border border-[#c2a670]/15 shadow-sm hover:shadow-md hover:border-[#6e1224]/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 relative flex flex-col justify-between min-h-[140px]"
                >
                  <div className="absolute top-2 right-2 bg-gray-100 text-gray-800 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Hidden</div>
                  <div>
                    <h3 className="text-[10px] font-bold text-[#1c1512]/60 uppercase tracking-widest mb-1.5 mt-2">Hidden Categories</h3>
                    <p className="text-4xl font-light text-gray-600 font-serif">{rentalCategories.filter(c => c.hidden).length}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-3 border-t border-[#c2a670]/10 pt-2 font-medium">Unpublished categories</div>
                </div>

              </div>
            </div>

            {/* Rental Jewellery Section */}
            <div>
              <h2 className="text-md font-serif font-bold text-[#4a2511] uppercase tracking-wider mb-4 border-b border-[#d4af37]/25 pb-2">Rental Jewellery Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">

                {/* Total Jewellery Items */}
                <div 
                  onClick={() => setActiveTab('manageJewellery')}
                  className="gold-panel p-6 text-center bg-white border border-[#c2a670]/15 shadow-sm hover:shadow-md hover:border-[#6e1224]/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 relative flex flex-col justify-between min-h-[140px]"
                >
                  <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Total</div>
                  <div>
                    <h3 className="text-[10px] font-bold text-[#1c1512]/60 uppercase tracking-widest mb-1.5 mt-2">Total Jewellery</h3>
                    <p className="text-4xl font-light text-[#4a2511] font-serif">{rentalJewellery.length}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-3 border-t border-[#c2a670]/10 pt-2 font-medium">All items in inventory</div>
                </div>

                {/* Active/Visible Jewellery */}
                <div 
                  onClick={() => setActiveTab('manageJewellery')}
                  className="gold-panel p-6 text-center bg-white border border-[#c2a670]/15 shadow-sm hover:shadow-md hover:border-[#6e1224]/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 relative flex flex-col justify-between min-h-[140px]"
                >
                  <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Active</div>
                  <div>
                    <h3 className="text-[10px] font-bold text-[#1c1512]/60 uppercase tracking-widest mb-1.5 mt-2">Active</h3>
                    <p className="text-4xl font-light text-green-700 font-serif">{rentalJewellery.filter(j => !j.hidden).length}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-3 border-t border-[#c2a670]/10 pt-2 font-medium">Visible to customers</div>
                </div>

                {/* Hidden Jewellery */}
                <div 
                  onClick={() => setActiveTab('manageJewellery')}
                  className="gold-panel p-6 text-center bg-white border border-[#c2a670]/15 shadow-sm hover:shadow-md hover:border-[#6e1224]/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 relative flex flex-col justify-between min-h-[140px]"
                >
                  <div className="absolute top-2 right-2 bg-gray-100 text-gray-800 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Hidden</div>
                  <div>
                    <h3 className="text-[10px] font-bold text-[#1c1512]/60 uppercase tracking-widest mb-1.5 mt-2">Hidden</h3>
                    <p className="text-4xl font-light text-gray-600 font-serif">{rentalJewellery.filter(j => j.hidden).length}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-3 border-t border-[#c2a670]/10 pt-2 font-medium">Unpublished items</div>
                </div>

                {/* Total Booking Requests */}
                <div 
                  onClick={() => setActiveTab('jewelleryBookings')}
                  className="gold-panel p-6 text-center bg-white border border-[#c2a670]/15 shadow-sm hover:shadow-md hover:border-[#6e1224]/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 relative flex flex-col justify-between min-h-[140px]"
                >
                  <div className="absolute top-2 right-2 bg-[#6e1224]/10 text-[#6e1224] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">All</div>
                  <div>
                    <h3 className="text-[10px] font-bold text-[#1c1512]/60 uppercase tracking-widest mb-1.5 mt-2">Total Bookings</h3>
                    <p className="text-4xl font-light text-[#800020] font-serif">{rentalBookings.length}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-3 border-t border-[#c2a670]/10 pt-2 font-medium">Rental requests</div>
                </div>

                {/* Pending Bookings */}
                <div 
                  onClick={() => setActiveTab('jewelleryBookings')}
                  className="gold-panel p-6 text-center bg-white border border-[#c2a670]/15 shadow-sm hover:shadow-md hover:border-[#6e1224]/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 relative flex flex-col justify-between min-h-[140px]"
                >
                  <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Pending</div>
                  <div>
                    <h3 className="text-[10px] font-bold text-[#1c1512]/60 uppercase tracking-widest mb-1.5 mt-2">Pending</h3>
                    <p className="text-4xl font-light text-[#b45309] font-serif">{rentalBookings.filter(b => b.status === 'Pending' || !b.status).length}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-3 border-t border-[#c2a670]/10 pt-2 font-medium">Awaiting action</div>
                </div>

                {/* Confirmed Bookings */}
                <div 
                  onClick={() => setActiveTab('jewelleryBookings')}
                  className="gold-panel p-6 text-center bg-white border border-[#c2a670]/15 shadow-sm hover:shadow-md hover:border-[#6e1224]/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 relative flex flex-col justify-between min-h-[140px]"
                >
                  <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Confirmed</div>
                  <div>
                    <h3 className="text-[10px] font-bold text-[#1c1512]/60 uppercase tracking-widest mb-1.5 mt-2">Confirmed</h3>
                    <p className="text-4xl font-light text-blue-700 font-serif">{rentalBookings.filter(b => b.status === 'Confirmed').length}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-3 border-t border-[#c2a670]/10 pt-2 font-medium">Approved hires</div>
                </div>

              </div>
            </div>
          </div>
        ) : activeTab === 'bookings' ? (
          <div className="flex flex-col h-full space-y-4">
            <div className="flex gap-4 overflow-x-auto pb-4 items-start h-[70vh] custom-scrollbar">
              {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map(status => (
                <div key={status} className="flex-shrink-0 w-80 bg-[#fdf5eb]/60 rounded-xl border border-[#d4af37]/30 flex flex-col h-full max-h-full shadow-sm">
                  <div className="p-4 border-b border-[#d4af37]/30 bg-gradient-to-r from-[#4a2511] to-[#6a3519] rounded-t-xl font-bold text-white flex justify-between items-center sticky top-0 z-10 shadow-sm">
                    <span className="tracking-wide">{status}</span>
                    <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-semibold border border-white/20">
                      {bookings.filter(b => (b.status || 'Pending') === status).length}
                    </span>
                  </div>
                  <div className="p-3 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
                    {bookings.filter(b => (b.status || 'Pending') === status).map(b => (
                      <div key={b._id} className="bg-white p-4 rounded-xl shadow-sm border border-[#d4af37]/20 relative hover:shadow-md transition-all duration-200 group">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1 pr-2">
                            <p className="font-bold text-[#4a2511] text-sm leading-tight">{b.fullName}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{b.contactNumber}</p>
                          </div>
                          <button
                            title="View Details"
                            onClick={() => { setSelectedBooking(b); setIsDetailsModalOpen(true); }}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#fdf5eb] hover:bg-[#d4af37]/20 text-[#4a2511] hover:text-[#800020] transition-all duration-200 border border-[#d4af37]/30 hover:border-[#d4af37] shadow-sm flex-shrink-0"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                        </div>
                        <div className="text-xs space-y-1.5 mb-4 bg-gray-50/80 p-2.5 rounded-lg border border-gray-100">
                          <p className="flex justify-between"><span className="font-semibold text-gray-500">Service:</span> <span className="text-[#800020] font-bold text-right pl-2 truncate">{b.serviceRequested}</span></p>
                          <p className="flex justify-between"><span className="font-semibold text-gray-500">Date:</span> <span className="text-[#4a2511] font-medium">{b.preferredDate || 'No Date'}</span></p>
                          <p className="flex justify-between"><span className="font-semibold text-gray-500">Time:</span> <span className="text-[#4a2511] font-medium">{b.timeSlot || 'No Time'}</span></p>
                        </div>
                        <div className="relative">
                          <select 
                            value=""
                            onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                            className={`w-full p-2 text-xs rounded-lg font-bold border appearance-none outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#d4af37]/50 transition-colors ${
                              b.status === 'Pending' || !b.status ? 'bg-yellow-50 text-yellow-800 border-yellow-300' : 
                              b.status === 'Confirmed' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                              b.status === 'Completed' ? 'bg-green-50 text-green-800 border-green-300' :
                              'bg-red-50 text-red-800 border-red-300'
                            }`}
                          >
                            <option value="" disabled>Update Status</option>
                            <option value="Pending">🔄 Pending</option>
                            <option value="Confirmed">✅ Confirmed</option>
                            <option value="Completed">🏁 Completed</option>
                            <option value="Cancelled">❌ Cancelled</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="fill-current h-4 w-4 opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                          </div>
                        </div>
                      </div>
                    ))}
                    {bookings.filter(b => (b.status || 'Pending') === status).length === 0 && (
                      <div className="text-center text-xs text-gray-400 py-8 italic border-2 border-dashed border-gray-200 rounded-xl mx-2">No {status.toLowerCase()} bookings</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'inquiries' ? (
          <div className="flex flex-col h-full space-y-4">
            <div className="flex gap-4 overflow-x-auto pb-4 items-start h-[70vh] custom-scrollbar">
              {['New', 'Contacted', 'Closed'].map(status => {
                const filteredInquiries = inquiries.filter(i => {
                  const currentStatus = i.status || 'New';
                  if (status === 'New') {
                    return currentStatus === 'New' || currentStatus === 'Pending';
                  }
                  return currentStatus === status;
                });

                return (
                  <div key={status} className="flex-shrink-0 w-80 bg-[#fdf5eb]/60 rounded-xl border border-[#d4af37]/30 flex flex-col h-full max-h-full shadow-sm">
                    {/* Header */}
                    <div className="p-4 border-b border-[#d4af37]/30 bg-gradient-to-r from-[#4a2511] to-[#6a3519] rounded-t-xl font-bold text-white flex justify-between items-center sticky top-0 z-10 shadow-sm">
                      <span className="tracking-wide">{status}</span>
                      <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-semibold border border-white/20">
                        {filteredInquiries.length}
                      </span>
                    </div>

                    {/* Column Content */}
                    <div className="p-3 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
                      {filteredInquiries.map(i => (
                        <div key={i._id} className="bg-white p-4 rounded-xl shadow-sm border border-[#d4af37]/20 relative hover:shadow-md transition-all duration-200 group">
                          
                          {/* Dates */}
                          <div className="flex justify-between text-[10px] text-gray-400 mb-2 border-b border-gray-100 pb-1.5 font-medium">
                            <span>📅 {i.createdAt ? new Date(i.createdAt).toLocaleDateString('en-GB') : '—'}</span>
                            <span>🔄 {i.updatedAt ? new Date(i.updatedAt).toLocaleDateString('en-GB') : 'Not updated'}</span>
                          </div>

                          {/* Customer Info */}
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 pr-2">
                              <p className="font-bold text-[#4a2511] text-sm leading-tight">{i.customerName || 'Guest User'}</p>
                              <p className="text-[10px] text-[#800020] font-semibold mt-0.5">{i.contactNumber || 'No Contact'}</p>
                            </div>
                            
                            {/* View Details Button */}
                            <button
                              title="View Details"
                              onClick={() => { setSelectedInquiry(i); setIsInquiryModalOpen(true); }}
                              className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#fdf5eb] hover:bg-[#d4af37]/20 text-[#4a2511] hover:text-[#800020] transition-all duration-200 border border-[#d4af37]/30 hover:border-[#d4af37] shadow-sm flex-shrink-0"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>
                          </div>

                          {/* Items Inquired list preview */}
                          <div className="mb-3">
                            <span className="bg-[#e5c07b]/40 text-[#4a2511] px-2 py-0.5 rounded text-[10px] font-bold mb-1.5 inline-block">
                              🛍️ {i.items?.length || 0} items
                            </span>
                            <div className="text-[11px] text-[#4a2511] max-w-xs space-y-1 mt-1 max-h-24 overflow-y-auto custom-scrollbar">
                              {i.items?.map((item: any, idx: number) => (
                                <div key={item._id || idx} className="flex items-center gap-1.5 bg-[#fdf5eb]/40 p-1.5 rounded border border-[#eacda3]/40">
                                  {item.image && <img src={item.image} alt="" className="w-6 h-6 object-cover rounded shadow-sm flex-shrink-0" />}
                                  <div className="truncate">
                                    <p className="font-bold text-[10px] leading-tight truncate">{item.name || 'Unknown Item'}</p>
                                    <p className="text-[8px] text-gray-500 leading-none">{item.price || 'No Price'}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Status Dropdown */}
                          <div className="relative">
                            <select 
                              value={i.status || 'New'}
                              onChange={(e) => handleUpdateInquiryStatus(i._id, e.target.value)}
                              className={`w-full p-2 text-xs rounded-lg font-bold border appearance-none outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#d4af37]/50 transition-colors ${
                                i.status === 'New' || i.status === 'Pending' || !i.status ? 'bg-green-50 text-green-800 border-green-300' : 
                                i.status === 'Contacted' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                                'bg-gray-50 text-gray-800 border-gray-300'
                              }`}
                            >
                              <option value="New">🟢 New</option>
                              <option value="Contacted">🔵 Contacted</option>
                              <option value="Closed">⚫ Closed</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                              <svg className="fill-current h-4 w-4 opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                          </div>

                        </div>
                      ))}
                      {filteredInquiries.length === 0 && (
                        <div className="text-center text-xs text-gray-400 py-8 italic border-2 border-dashed border-gray-200 rounded-xl mx-2">No inquiries in {status.toLowerCase()}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : activeTab === 'manageSarees' ? (
          <div className="flex flex-col h-full space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold font-serif text-[#4a2511]">Saree Catalog</h2>
              <button onClick={openAddModal} className="gold-button px-4 py-2 text-sm shadow">
                + Add New Saree
              </button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 items-start h-[70vh] custom-scrollbar">
              {['Available', 'Rented/Booked', 'Maintenance', 'Archived'].map(status => {
                const filteredSarees = sarees.filter(s => (s.status || 'Available') === status);
                return (
                  <div key={status} className="flex-shrink-0 w-80 bg-[#fdf5eb]/60 rounded-xl border border-[#d4af37]/30 flex flex-col h-full max-h-full shadow-sm">
                    {/* Header */}
                    <div className="p-4 border-b border-[#d4af37]/30 bg-gradient-to-r from-[#4a2511] to-[#6a3519] rounded-t-xl font-bold text-white flex justify-between items-center sticky top-0 z-10 shadow-sm">
                      <span className="tracking-wide">{status}</span>
                      <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-semibold border border-white/20">
                        {filteredSarees.length}
                      </span>
                    </div>
                    
                    {/* Column Content */}
                    <div className="p-3 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
                      {filteredSarees.map(s => (
                        <div key={s._id} className="bg-white p-4 rounded-xl shadow-sm border border-[#d4af37]/20 relative hover:shadow-md transition-all duration-200 group">
                          
                          {/* Image */}
                          <div className="h-32 w-full overflow-hidden bg-gray-100 rounded-lg mb-3 relative">
                            <img 
                              src={s.image || '/hero-saree.png'} 
                              alt={s.name} 
                              className="w-full h-full object-cover" 
                            />
                            
                            {/* Absolute Actions Button */}
                            <div className="absolute top-1.5 right-1.5 z-20">
                              <button
                                onClick={() => openEditModal(s)}
                                className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#4a2511] hover:text-[#800020] transition-all duration-200 border border-gray-200 hover:border-[#d4af37] shadow-sm flex-shrink-0"
                                title="Edit Saree Details"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          
                          {/* Saree details */}
                          <div className="text-xs space-y-1.5 mb-3">
                            <p className="font-bold text-[#4a2511] text-sm leading-tight line-clamp-1">{s.name}</p>
                            <p className="flex justify-between"><span className="font-semibold text-gray-500">Price:</span> <span className="text-[#800020] font-bold">{s.price}</span></p>
                            <p className="flex justify-between"><span className="font-semibold text-gray-500">Color:</span> <span className="text-[#4a2511] font-medium capitalize">{s.color || 'N/A'}</span></p>
                          </div>

                          {/* Quick Switch Dropdown */}
                          <div className="relative">
                            <select 
                              value=""
                              onChange={(e) => handleUpdateSareeStatus(s._id, e.target.value)}
                              className={`w-full p-2 text-xs rounded-lg font-bold border appearance-none outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#d4af37]/50 transition-colors ${
                                (s.status || 'Available') === 'Available' ? 'bg-green-50 text-green-800 border-green-300' : 
                                (s.status || 'Available') === 'Rented/Booked' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                                (s.status || 'Available') === 'Maintenance' ? 'bg-yellow-50 text-yellow-800 border-yellow-300' :
                                'bg-gray-50 text-gray-800 border-gray-300'
                              }`}
                            >
                              <option value="" disabled>Update Status</option>
                              <option value="Available">🟢 Available</option>
                              <option value="Rented/Booked">🔵 Rented/Booked</option>
                              <option value="Maintenance">🟡 Maintenance</option>
                              <option value="Archived">⚫ Archived</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                              <svg className="fill-current h-4 w-4 opacity-60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                          </div>

                        </div>
                      ))}
                      {filteredSarees.length === 0 && (
                        <div className="text-center text-xs text-gray-400 py-8 italic border-2 border-dashed border-gray-200 rounded-xl mx-2">No sarees in {status.toLowerCase()}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : activeTab === 'manageAcademy' ? (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold font-serif text-[#4a2511]">Academy Courses</h2>
              <button onClick={openAddAcademyModal} className="gold-button px-4 py-2 text-sm shadow">
                + Add Course
              </button>
            </div>
            {academyCourses.length === 0 ? (
              <div className="text-center py-12 bg-white/60 rounded-xl border border-[#d4af37]/20">
                <p className="text-gray-500 italic">No courses found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
                {academyCourses.map(c => (
                  <div key={c._id} className="bg-white rounded-xl shadow-sm border border-[#d4af37]/30 hover:border-[#d4af37] hover:shadow-md transition-all duration-300 relative flex flex-col overflow-hidden group">
                    {/* Course Image */}
                    <div className="h-44 w-full overflow-hidden bg-gray-100 flex-shrink-0 relative">
                      <img 
                        src={c.image || '/academy_class1.png'} 
                        alt={c.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    
                    {/* Content Details */}
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-[#4a2511] text-base mb-1 leading-snug line-clamp-2" title={c.title}>
                          {c.title}
                        </h3>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">Duration</span>
                        {/* Duration Badge */}
                        <span className="text-xs bg-[#fdf5eb] text-[#800020] font-semibold px-2.5 py-1 rounded-md border border-[#d4af37]/30">
                          ⏱️ {c.duration}
                        </span>
                      </div>
                    </div>

                    {/* Absolute Actions Button */}
                    <div className="absolute top-2 right-2 z-20">
                      <button
                        onClick={() => setOpenAcademyMenuId(openAcademyMenuId === c._id ? null : c._id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#4a2511] hover:text-[#800020] transition-all duration-200 border border-gray-200 hover:border-[#d4af37] shadow-sm flex-shrink-0"
                        title="Actions"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      {openAcademyMenuId === c._id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenAcademyMenuId(null)}></div>
                          <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-20 border border-gray-200 py-1 overflow-hidden text-left menu-popup">
                            <button
                              onClick={() => { setOpenAcademyMenuId(null); setSelectedAcademy(c); setIsAcademyViewModalOpen(true); }}
                              className="block w-full text-left px-4 py-2 text-sm text-[#4a2511] font-semibold hover:bg-[#fdf5eb]"
                            >
                              View
                            </button>
                            <button
                              onClick={() => { setOpenAcademyMenuId(null); openEditAcademyModal(c); }}
                              className="block w-full text-left px-4 py-2 text-sm text-blue-600 font-semibold hover:bg-blue-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => { setOpenAcademyMenuId(null); handleDeleteAcademy(c._id); }}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 font-semibold hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'manageSalon' ? (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold text-[#4a2511]">Salon Services</h2>
              <button onClick={openAddServiceModal} className="gold-button px-4 py-2 text-sm shadow">
                + Add Service
              </button>
            </div>
            <div className="overflow-x-auto pb-32">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f4e8d3] text-[#4a2511] border-b border-[#d4af37]">
                    <th className="p-3">Image</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salonServices.map(s => (
                    <tr key={s._id} className="border-b border-[#eacda3] hover:bg-[#fdf5eb]">
                      <td className="p-3">
                        <img src={s.image || '/salon-service.png'} alt="service" className="w-12 h-12 object-cover rounded shadow" />
                      </td>
                      <td className="p-3 font-semibold text-[#4a2511]">{s.title}</td>
                      <td className="p-3 text-sm">{s.category}</td>
                      <td className="p-3 text-xs text-gray-700">{s.description}</td>
                      <td className="p-3 text-right whitespace-nowrap relative">
                        <button
                          onClick={() => setOpenServiceMenuId(openServiceMenuId === s._id ? null : s._id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#fdf5eb] hover:bg-[#d4af37]/20 text-[#4a2511] hover:text-[#800020] transition-all duration-200 border border-[#d4af37]/30 hover:border-[#d4af37] shadow-sm flex-shrink-0"
                          title="Actions"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        {openServiceMenuId === s._id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenServiceMenuId(null)}></div>
                            <div className="absolute right-full mr-2 top-0 w-32 bg-white rounded-md shadow-lg z-20 border border-gray-200 py-1 overflow-hidden text-left menu-popup">
                              <button
                                onClick={() => { setOpenServiceMenuId(null); setSelectedService(s); setIsServiceViewModalOpen(true); }}
                                className="block w-full text-left px-4 py-2 text-sm text-[#4a2511] font-semibold hover:bg-[#fdf5eb]"
                              >
                                View
                              </button>
                              <button
                                onClick={() => { setOpenServiceMenuId(null); openEditServiceModal(s); }}
                                className="block w-full text-left px-4 py-2 text-sm text-blue-600 font-semibold hover:bg-blue-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => { setOpenServiceMenuId(null); handleDeleteService(s._id); }}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 font-semibold hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {salonServices.length === 0 && <tr><td colSpan={3} className="p-4 text-center">No services found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'manageCategories' ? (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold text-[#4a2511]">Salon Categories</h2>
              <button onClick={openAddCategoryModal} className="gold-button px-4 py-2 text-sm shadow">
                + Add Category
              </button>
            </div>
            <div className="overflow-x-auto pb-32">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f4e8d3] text-[#4a2511] border-b border-[#d4af37]">
                    <th className="p-3">Image</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salonCategories.map(c => (
                    <tr key={c._id} className="border-b border-[#eacda3] hover:bg-[#fdf5eb]">
                      <td className="p-3">
                        <img src={c.image || '/salon-service.png'} alt="category" className="w-12 h-12 object-cover rounded shadow" />
                      </td>
                      <td className="p-3 font-semibold text-[#4a2511]">{c.name}</td>
                      <td className="p-3 text-xs text-gray-700">{c.description}</td>
                      <td className="p-3 text-right whitespace-nowrap relative">
                        <button
                          onClick={() => setOpenCategoryMenuId(openCategoryMenuId === c._id ? null : c._id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#fdf5eb] hover:bg-[#d4af37]/20 text-[#4a2511] hover:text-[#800020] transition-all duration-200 border border-[#d4af37]/30 hover:border-[#d4af37] shadow-sm flex-shrink-0"
                          title="Actions"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        {openCategoryMenuId === c._id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenCategoryMenuId(null)}></div>
                            <div className="absolute right-full mr-2 top-0 w-32 bg-white rounded-md shadow-lg z-20 border border-gray-200 py-1 overflow-hidden text-left menu-popup">
                              <button
                                onClick={() => { setOpenCategoryMenuId(null); setSelectedCategory(c); setIsCategoryViewModalOpen(true); }}
                                className="block w-full text-left px-4 py-2 text-sm text-[#4a2511] font-semibold hover:bg-[#fdf5eb]"
                              >
                                View
                              </button>
                              <button
                                onClick={() => { setOpenCategoryMenuId(null); openEditCategoryModal(c); }}
                                className="block w-full text-left px-4 py-2 text-sm text-blue-600 font-semibold hover:bg-blue-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => { setOpenCategoryMenuId(null); handleDeleteCategory(c._id); }}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 font-semibold hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {salonCategories.length === 0 && <tr><td colSpan={4} className="p-4 text-center">No categories found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'manageGallery' ? (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold text-[#4a2511]">Gallery Images</h2>
              <button onClick={openAddGalleryModal} className="gold-button px-4 py-2 text-sm shadow">
                + Upload Image
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {gallery.map(img => (
                <div key={img._id} className="relative rounded overflow-hidden border-2 border-[#d4af37] h-32 group shadow-sm hover:shadow-lg transition">
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute bottom-0 left-0 right-0 bg-[#4a2511] bg-opacity-80 text-[#fdf5eb] text-xs p-1 truncate text-center font-semibold">
                    {img.title}
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditGalleryModal(img)} className="bg-blue-600 text-white p-2 rounded shadow hover:bg-blue-700">✎</button>
                    <button onClick={() => handleDeleteGallery(img._id)} className="bg-red-600 text-white p-2 rounded shadow hover:bg-red-700">🗑</button>
                  </div>
                </div>
              ))}
              {gallery.length === 0 && <p className="col-span-full text-center py-4">No gallery images found</p>}
            </div>
          </div>
        ) : activeTab === 'manageStaff' ? (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold text-[#4a2511]">Staff Members</h2>
                <p className="text-xs text-gray-500 mt-0.5">Manage staff members for the beauty salon</p>
              </div>
              <button onClick={openAddStaffModal} className="gold-button px-4 py-2 text-sm shadow">
                + Add Staff Member
              </button>
            </div>
            <div className="overflow-x-auto pb-32">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f4e8d3] text-[#4a2511] border-b border-[#d4af37]">
                    <th className="p-3 text-xs">Photo</th>
                    <th className="p-3 text-xs">Name</th>
                    <th className="p-3 text-xs">Role</th>
                    <th className="p-3 text-xs">Contact Details</th>
                    <th className="p-3 text-xs">NIC & DOB</th>
                    <th className="p-3 text-xs">Address</th>
                    <th className="p-3 text-xs">Timestamps</th>
                    <th className="p-3 text-xs text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map(s => (
                    <tr key={s._id} className="border-b border-[#eacda3] hover:bg-[#fdf5eb]">
                      <td className="p-3">
                        <img 
                          src={s.photo || '/avatar-placeholder.png'} 
                          alt={s.name} 
                          className="w-10 h-10 object-cover rounded-full border border-[#d4af37] shadow-sm bg-white" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(s.name);
                          }}
                        />
                      </td>
                      <td className="p-3 font-semibold text-[#4a2511] text-sm">{s.name}</td>
                      <td className="p-3">
                        <span className="bg-[#d4af37]/10 text-[#3a1f0d] border border-[#d4af37]/35 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {s.role || 'Beauty Therapist'}
                        </span>
                      </td>
                      <td className="p-3 text-xs space-y-0.5">
                        <p className="font-medium">📞 {s.mobile || '—'}</p>
                        <p className="text-[#075e54] font-medium">💬 {s.whatsapp || '—'}</p>
                      </td>
                      <td className="p-3 text-xs space-y-0.5">
                        <p><span className="text-gray-500 font-medium">NIC:</span> {s.nic || '—'}</p>
                        <p><span className="text-gray-500 font-medium">DOB:</span> {s.dob ? new Date(s.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</p>
                      </td>
                      <td className="p-3 text-xs text-gray-700 max-w-xs truncate" title={s.address}>{s.address || '—'}</td>
                      <td className="p-3">
                        <p className="text-[10px] text-gray-500">
                          <span className="font-semibold text-gray-400">Created: </span> 
                          {s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-GB') : '—'}
                        </p>
                        {s.updatedAt && (
                          <p className="text-[10px] text-gray-500">
                            <span className="font-semibold text-gray-400">Updated: </span> 
                            {new Date(s.updatedAt).toLocaleDateString('en-GB')}
                          </p>
                        )}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap relative">
                        <button
                          onClick={() => setOpenStaffMenuId(openStaffMenuId === s._id ? null : s._id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#fdf5eb] hover:bg-[#d4af37]/20 text-[#4a2511] hover:text-[#800020] transition-all duration-200 border border-[#d4af37]/30 hover:border-[#d4af37] shadow-sm flex-shrink-0"
                          title="Actions"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        {openStaffMenuId === s._id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenStaffMenuId(null)}></div>
                            <div className="absolute right-full mr-2 top-0 w-32 bg-white rounded-md shadow-lg z-20 border border-gray-200 py-1 overflow-hidden text-left menu-popup">
                              <button
                                onClick={() => { setOpenStaffMenuId(null); setSelectedStaff(s); setIsStaffViewModalOpen(true); }}
                                className="block w-full text-left px-4 py-2 text-sm text-[#4a2511] font-semibold hover:bg-[#fdf5eb]"
                              >
                                View
                              </button>
                              <button
                                onClick={() => { setOpenStaffMenuId(null); openEditStaffModal(s); }}
                                className="block w-full text-left px-4 py-2 text-sm text-blue-600 font-semibold hover:bg-blue-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => { setOpenStaffMenuId(null); handleDeleteStaff(s._id); }}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 font-semibold hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {staffList.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-sm text-gray-500">
                        No staff members found. Add your first member using the button above!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'manageJewellery' ? (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold font-serif text-[#4a2511]">Rental Jewellery Catalog</h2>
                <p className="text-xs text-gray-500 mt-0.5">Manage rental sets, status visibility, and unique jewellery codes</p>
              </div>
              <button onClick={openAddJewelleryModal} className="gold-button px-4 py-2 text-sm shadow">
                + Add Jewellery Item
              </button>
            </div>

            {/* Search, Filter, Sort Controls */}
            <div className="bg-[#fdf5eb]/50 p-4 rounded-xl border border-[#d4af37]/35 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="flex flex-col gap-1 w-full sm:w-48">
                  <label className="font-semibold text-stone-600">Search Jewellery</label>
                  <input
                    type="text"
                    placeholder="Search by Name or Number..."
                    value={searchJewellery}
                    onChange={e => setSearchJewellery(e.target.value)}
                    className="p-2 border border-[#d4af37]/40 rounded bg-white outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="flex flex-col gap-1 w-full sm:w-40">
                  <label className="font-semibold text-stone-600">Filter Category</label>
                  <select
                    value={categoryFilterJewellery}
                    onChange={e => setCategoryFilterJewellery(e.target.value)}
                    className="p-2 border border-[#d4af37]/40 rounded bg-white outline-none focus:border-[#d4af37]"
                  >
                    <option value="all">All Categories</option>
                    {rentalCategories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1 w-full sm:w-32">
                  <label className="font-semibold text-stone-600">Filter Status</label>
                  <select
                    value={statusFilterJewellery}
                    onChange={e => setStatusFilterJewellery(e.target.value as any)}
                    className="p-2 border border-[#d4af37]/40 rounded bg-white outline-none focus:border-[#d4af37]"
                  >
                    <option value="all">All Items</option>
                    <option value="visible">Visible Only</option>
                    <option value="hidden">Hidden Only</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full md:w-auto sm:w-40">
                <label className="font-semibold text-stone-600">Sort By</label>
                <select
                  value={sortJewellery}
                  onChange={e => setSortJewellery(e.target.value as any)}
                  className="p-2 border border-[#d4af37]/40 rounded bg-white outline-none focus:border-[#d4af37]"
                >
                  <option value="name-asc">Name (A - Z)</option>
                  <option value="name-desc">Name (Z - A)</option>
                  <option value="number-asc">Code (Ascending)</option>
                  <option value="number-desc">Code (Descending)</option>
                </select>
              </div>
            </div>

            {/* Catalogue Table */}
            <div className="overflow-x-auto pb-32">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f4e8d3] text-[#4a2511] border-b border-[#d4af37]">
                    <th className="p-3 text-xs">Image</th>
                    <th className="p-3 text-xs">Name</th>
                    <th className="p-3 text-xs">Category</th>
                    <th className="p-3 text-xs">Code / Unique ID</th>
                    <th className="p-3 text-xs">Description</th>
                    <th className="p-3 text-xs">Status</th>
                    <th className="p-3 text-xs text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rentalJewellery
                    .filter(item => {
                      const query = searchJewellery.toLowerCase();
                      const matchesSearch = 
                        item.name?.toLowerCase().includes(query) || 
                        item.jewelleryNumber?.toLowerCase().includes(query);
                      
                      const matchesStatus = 
                        statusFilterJewellery === 'all' ? true :
                        statusFilterJewellery === 'visible' ? !item.hidden :
                        item.hidden;

                      const matchesCategory = 
                        categoryFilterJewellery === 'all' ? true :
                        item.category === categoryFilterJewellery;

                      return matchesSearch && matchesStatus && matchesCategory;
                    })
                    .sort((a, b) => {
                      if (sortJewellery === 'name-asc') return (a.name || '').localeCompare(b.name || '');
                      if (sortJewellery === 'name-desc') return (b.name || '').localeCompare(a.name || '');
                      if (sortJewellery === 'number-asc') return (a.jewelleryNumber || '').localeCompare(b.jewelleryNumber || '');
                      return (b.jewelleryNumber || '').localeCompare(a.jewelleryNumber || '');
                    })
                    .map(item => (
                      <tr key={item._id} className="border-b border-[#eacda3] hover:bg-[#fdf5eb] text-sm">
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            {(Array.isArray(item.images) && item.images.length > 0 ? item.images : (item.image ? [item.image] : [])).slice(0, 3).map((img: string, idx: number) => (
                              <img key={idx} src={img} alt="" className="w-10 h-10 object-cover rounded border border-[#d4af37]/35 bg-white shadow-sm" />
                            ))}
                            {(Array.isArray(item.images) ? item.images.length : (item.image ? 1 : 0)) > 3 && (
                              <span className="text-[10px] font-bold text-[#800020] ml-0.5">+{(Array.isArray(item.images) ? item.images.length : 1) - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-semibold text-[#4a2511]">{item.name}</td>
                        <td className="p-3 font-sans text-xs font-bold text-[#800020] uppercase">{item.category || '—'}</td>
                        <td className="p-3 font-mono text-xs font-bold text-[#800020]">{item.jewelleryNumber}</td>
                        <td className="p-3 text-xs text-gray-600 max-w-xs truncate" title={item.description}>{item.description || '—'}</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            item.hidden 
                              ? 'bg-gray-100 text-gray-800 border-gray-300' 
                              : 'bg-green-50 text-green-700 border-green-300'
                          }`}>
                            {item.hidden ? 'Hidden' : 'Visible'}
                          </span>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap relative">
                          <button
                            onClick={() => setOpenJewelleryMenuId(openJewelleryMenuId === item._id ? null : item._id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#fdf5eb] hover:bg-[#d4af37]/20 text-[#4a2511] hover:text-[#800020] transition-all duration-200 border border-[#d4af37]/30 hover:border-[#d4af37] shadow-sm flex-shrink-0"
                            title="Actions"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          {openJewelleryMenuId === item._id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenJewelleryMenuId(null)}></div>
                              <div className="absolute right-full mr-2 top-0 w-36 bg-white rounded-md shadow-lg z-20 border border-gray-200 py-1 overflow-hidden text-left menu-popup">
                                <button
                                  onClick={() => { setOpenJewelleryMenuId(null); setSelectedJewellery(item); setIsJewelleryViewModalOpen(true); }}
                                  className="block w-full text-left px-4 py-2 text-sm text-[#4a2511] font-semibold hover:bg-[#fdf5eb]"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => { setOpenJewelleryMenuId(null); openEditJewelleryModal(item); }}
                                  className="block w-full text-left px-4 py-2 text-sm text-[#4a2511] font-semibold hover:bg-[#fdf5eb]"
                                >
                                  Edit Info
                                </button>
                                <button
                                  onClick={() => { setOpenJewelleryMenuId(null); handleToggleHideJewellery(item); }}
                                  className={`block w-full text-left px-4 py-2 text-sm font-semibold hover:bg-stone-50 ${item.hidden ? 'text-green-700' : 'text-stone-700'}`}
                                >
                                  {item.hidden ? 'Unhide' : 'Hide'}
                                </button>
                                <button
                                  onClick={() => { setOpenJewelleryMenuId(null); handleDeleteJewellery(item._id); }}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 font-semibold hover:bg-red-50"
                                >
                                  Delete Set
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  {rentalJewellery.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-sm text-gray-500">
                        No jewellery items in the catalog. Add one to start renting!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'jewelleryBookings' ? (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold font-serif text-[#4a2511]">Rental Jewellery Bookings</h2>
                <p className="text-xs text-gray-500 mt-0.5">Manage rental booking requests and hire status options</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-semibold text-stone-600">Filter Status</label>
                  <select
                    value={statusFilterRentalBooking}
                    onChange={e => setStatusFilterRentalBooking(e.target.value as any)}
                    className="p-2 border border-[#d4af37]/40 rounded bg-white text-xs outline-none focus:border-[#d4af37] font-semibold text-[#4a2511]"
                  >
                    <option value="all">All Bookings</option>
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-semibold text-stone-600">Need Date</label>
                  <div className="relative flex items-center gap-1.5">
                    <input
                      type="date"
                      value={dateFilterRentalBooking}
                      onChange={e => setDateFilterRentalBooking(e.target.value)}
                      className="p-1.5 border border-[#d4af37]/40 rounded bg-white text-xs outline-none focus:border-[#d4af37] font-semibold text-[#4a2511]"
                    />
                    {dateFilterRentalBooking && (
                      <button
                        type="button"
                        onClick={() => setDateFilterRentalBooking('')}
                        className="text-red-700 hover:text-red-900 text-[10px] font-bold px-2 py-1 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition-colors"
                        title="Clear calendar date filter"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-semibold text-stone-600">Search</label>
                  <input
                    type="text"
                    placeholder="Search name, code, phone..."
                    value={searchRentalBooking}
                    onChange={e => setSearchRentalBooking(e.target.value)}
                    className="p-2 border border-[#d4af37]/40 rounded bg-white text-xs outline-none w-60 focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="overflow-x-auto pb-32">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f4e8d3] text-[#4a2511] border-b border-[#d4af37]">
                    <th className="p-3 text-xs">Booking ID</th>
                    <th className="p-3 text-xs">Category</th>
                    <th className="p-3 text-xs">Jewellery Image</th>
                    <th className="p-3 text-xs">Jewellery Name</th>
                    <th className="p-3 text-xs">Jewellery Number</th>
                    <th className="p-3 text-xs">Customer Name</th>
                    <th className="p-3 text-xs">Address</th>
                    <th className="p-3 text-xs">Phone Number</th>
                    <th className="p-3 text-xs">Description</th>
                    <th className="p-3 text-xs">Booking Date</th>
                    <th className="p-3 text-xs">Booking Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rentalBookings
                    .filter(b => {
                      if (statusFilterRentalBooking !== 'all' && (b.status || 'Pending') !== statusFilterRentalBooking) {
                        return false;
                      }
                      if (dateFilterRentalBooking && b.needDate !== dateFilterRentalBooking) {
                        return false;
                      }
                      const query = searchRentalBooking.toLowerCase();
                      return (
                        b.customerName?.toLowerCase().includes(query) ||
                        b.jewelleryName?.toLowerCase().includes(query) ||
                        b.jewelleryNumber?.toLowerCase().includes(query) ||
                        b.phone?.toLowerCase().includes(query) ||
                        b.category?.toLowerCase().includes(query)
                      );
                    })
                    .map(b => (
                      <tr key={b._id} className="border-b border-[#eacda3] hover:bg-[#fdf5eb] text-sm">
                        <td className="p-3 font-mono text-[11px] font-bold text-stone-500">#{b._id}</td>
                        <td className="p-3 font-semibold text-xs text-[#800020] uppercase">{b.category || '—'}</td>
                        <td className="p-3">
                          <img src={b.jewelleryImage || '/hero-saree.png'} alt="" className="w-10 h-10 object-cover rounded shadow-sm border border-[#d4af37]/20 bg-white" />
                        </td>
                        <td className="p-3 font-semibold">{b.jewelleryName}</td>
                        <td className="p-3 font-mono text-xs font-bold text-[#800020]">{b.jewelleryNumber}</td>
                        <td className="p-3 font-medium">{b.customerName}</td>
                        <td className="p-3 text-xs text-gray-700 max-w-xs truncate" title={b.address}>{b.address}</td>
                        <td className="p-3 font-medium text-xs whitespace-nowrap">{b.phone}</td>
                        <td className="p-3 text-xs text-stone-500 max-w-xs truncate" title={b.description}>{b.description || '—'}</td>
                        <td className="p-3 text-xs font-bold text-[#800020] whitespace-nowrap">
                          {b.needDate ? new Date(b.needDate).toLocaleDateString('en-GB') : '—'}
                        </td>
                        <td className="p-3">
                          <select
                            value={b.status || 'Pending'}
                            onChange={e => handleUpdateRentalBookingStatus(b._id, e.target.value)}
                            className={`p-1.5 text-xs rounded font-bold border outline-none focus:ring-1 focus:ring-[#d4af37] ${
                              b.status === 'Confirmed' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                              b.status === 'Contacted' ? 'bg-indigo-100 text-indigo-800 border-indigo-300' :
                              b.status === 'Cancelled' ? 'bg-red-100 text-red-800 border-red-300' :
                              'bg-yellow-100 text-yellow-800 border-yellow-300'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  {rentalBookings.length === 0 && (
                    <tr>
                      <td colSpan={11} className="p-6 text-center text-sm text-gray-500">
                        No rental bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'manageJewelleryCategories' ? (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold font-serif text-[#4a2511]">Jewellery Categories</h2>
                <p className="text-xs text-gray-500 mt-0.5">Manage rental categories and status visibility</p>
              </div>
              <button onClick={openAddJewelleryCategoryModal} className="gold-button px-4 py-2 text-sm shadow">
                + Add Category
              </button>
            </div>

            {/* Search, Filter Controls */}
            <div className="bg-[#fdf5eb]/50 p-4 rounded-xl border border-[#d4af37]/35 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs">
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <div className="flex flex-col gap-1 w-full sm:w-60">
                  <label className="font-semibold text-stone-600">Search Categories</label>
                  <input
                    type="text"
                    placeholder="Search by Category Name..."
                    value={searchJewelleryCategory}
                    onChange={e => setSearchJewelleryCategory(e.target.value)}
                    className="p-2 border border-[#d4af37]/40 rounded bg-white outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="flex flex-col gap-1 w-full sm:w-40">
                  <label className="font-semibold text-stone-600">Filter Status</label>
                  <select
                    value={statusFilterJewelleryCategory}
                    onChange={e => setStatusFilterJewelleryCategory(e.target.value as any)}
                    className="p-2 border border-[#d4af37]/40 rounded bg-white outline-none focus:border-[#d4af37]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="visible">Visible Only</option>
                    <option value="hidden">Hidden Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Categories Table */}
            <div className="overflow-x-auto pb-32">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f4e8d3] text-[#4a2511] border-b border-[#d4af37]">
                    <th className="p-3 text-xs">Image</th>
                    <th className="p-3 text-xs">Category Name</th>
                    <th className="p-3 text-xs">Status</th>
                    <th className="p-3 text-xs text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rentalCategories
                    .filter(cat => {
                      const query = searchJewelleryCategory.toLowerCase();
                      const matchesSearch = cat.name?.toLowerCase().includes(query);
                      const matchesStatus = 
                        statusFilterJewelleryCategory === 'all' ? true :
                        statusFilterJewelleryCategory === 'visible' ? !cat.hidden :
                        cat.hidden;
                      return matchesSearch && matchesStatus;
                    })
                    .map(cat => (
                      <tr key={cat._id} className="border-b border-[#eacda3] hover:bg-[#fdf5eb] text-sm">
                        <td className="p-3">
                          <img src={cat.image || '/hero-saree.png'} alt={cat.name} className="w-12 h-12 object-cover rounded border border-[#d4af37]/35 bg-white shadow-sm" />
                        </td>
                        <td className="p-3 font-semibold text-[#4a2511]">{cat.name}</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            cat.hidden 
                              ? 'bg-gray-100 text-gray-800 border-gray-300' 
                              : 'bg-green-50 text-green-700 border-green-300'
                          }`}>
                            {cat.hidden ? 'Hidden' : 'Visible'}
                          </span>
                        </td>
                        <td className="p-3 text-right whitespace-nowrap relative">
                          <button
                            onClick={() => setOpenJewelleryCategoryMenuId(openJewelleryCategoryMenuId === cat._id ? null : cat._id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#fdf5eb] hover:bg-[#d4af37]/20 text-[#4a2511] hover:text-[#800020] transition-all duration-200 border border-[#d4af37]/30 hover:border-[#d4af37] shadow-sm flex-shrink-0"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          {openJewelleryCategoryMenuId === cat._id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenJewelleryCategoryMenuId(null)}></div>
                              <div className="absolute right-full mr-2 top-0 w-36 bg-white rounded-md shadow-lg z-20 border border-gray-200 py-1 overflow-hidden text-left menu-popup">
                                <button
                                  onClick={() => { setOpenJewelleryCategoryMenuId(null); setSelectedJewelleryCategory(cat); setIsJewelleryCategoryViewModalOpen(true); }}
                                  className="block w-full text-left px-4 py-2 text-sm text-[#4a2511] font-semibold hover:bg-[#fdf5eb]"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => { setOpenJewelleryCategoryMenuId(null); openEditJewelleryCategoryModal(cat); }}
                                  className="block w-full text-left px-4 py-2 text-sm text-[#4a2511] font-semibold hover:bg-[#fdf5eb]"
                                >
                                  Edit Info
                                </button>
                                <button
                                  onClick={() => { setOpenJewelleryCategoryMenuId(null); handleToggleHideJewelleryCategory(cat); }}
                                  className={`block w-full text-left px-4 py-2 text-sm font-semibold hover:bg-stone-50 ${cat.hidden ? 'text-green-700' : 'text-stone-700'}`}
                                >
                                  {cat.hidden ? 'Unhide' : 'Hide'}
                                </button>
                                <button
                                  onClick={() => { setOpenJewelleryCategoryMenuId(null); handleDeleteJewelleryCategory(cat._id); }}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 font-semibold hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  {rentalCategories.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-sm text-gray-500">
                        No categories found. Click "+ Add Category" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'billingCategories' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold font-serif text-[#4a2511]">POS Categories</h2>
                <p className="text-xs text-gray-500 mt-0.5">Manage product/service categories for internal billing</p>
              </div>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Search categories..." 
                  value={searchBillingCategory} 
                  onChange={e => setSearchBillingCategory(e.target.value)} 
                  className="p-2 border border-[#d4af37]/40 rounded bg-white text-xs outline-none w-48 focus:border-[#d4af37]"
                />
                <button onClick={openAddBillingCategoryModal} className="gold-button px-4 py-2 text-sm shadow">
                  + Add Category
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-32">
              {billingCategories
                .filter(cat => cat.name?.toLowerCase().includes(searchBillingCategory.toLowerCase()))
                .map(cat => (
                  <div key={cat._id} className="bg-white p-4 rounded-xl shadow-sm border border-[#d4af37]/30 hover:border-[#d4af37] flex items-center justify-between transition-all duration-200">
                    <span className="font-serif font-bold text-[#4a2511] text-sm">🏷️ {cat.name}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditBillingCategoryModal(cat)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-semibold p-1 hover:bg-blue-50 rounded"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteBillingCategory(cat._id)}
                        className="text-red-600 hover:text-red-800 text-xs font-semibold p-1 hover:bg-red-50 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              {billingCategories.length === 0 && (
                <p className="col-span-full text-center py-8 text-gray-400 italic">No billing categories found</p>
              )}
            </div>
          </div>
        ) : activeTab === 'billingServices' ? (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold font-serif text-[#4a2511]">POS Services</h2>
                <p className="text-xs text-gray-500 mt-0.5">Manage services/products and commissions for internal billing</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <input 
                  type="text" 
                  placeholder="Search service/category..." 
                  value={searchBillingService} 
                  onChange={e => setSearchBillingService(e.target.value)} 
                  className="p-2 border border-[#d4af37]/40 rounded bg-white text-xs outline-none w-full sm:w-64 focus:border-[#d4af37]"
                />
                <button onClick={openAddBillingServiceModal} className="gold-button px-4 py-2 text-sm shadow w-full sm:w-auto">
                  + Add Service
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
              {billingServices
                .filter(s => 
                  s.name?.toLowerCase().includes(searchBillingService.toLowerCase()) || 
                  s.category?.toLowerCase().includes(searchBillingService.toLowerCase())
                )
                .map(s => (
                  <div key={s._id} className="bg-white p-5 rounded-xl shadow-sm border border-[#d4af37]/30 hover:border-[#d4af37] flex flex-col justify-between transition-all duration-300 relative group">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] bg-[#fdf5eb] text-[#800020] border border-[#d4af37]/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          {s.category}
                        </span>
                        <div className="flex gap-2">
                          <button onClick={() => openEditBillingServiceModal(s)} className="text-blue-600 hover:text-blue-800 text-xs font-bold">Edit</button>
                          <button onClick={() => handleDeleteBillingService(s._id)} className="text-red-600 hover:text-red-800 text-xs font-bold">Delete</button>
                        </div>
                      </div>
                      <h3 className="font-serif font-bold text-[#4a2511] text-base mb-3 leading-snug">{s.name}</h3>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                      <div>
                        <p className="text-gray-400 font-semibold uppercase tracking-wider text-[9px]">Staff Commission</p>
                        <p className="font-bold text-[#4a2511]">
                          {s.commissionType === 'fixed' ? 'LKR ' : ''}
                          {s.commissionValue !== undefined ? s.commissionValue : s.commission}
                          {s.commissionType !== 'fixed' ? '%' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 font-semibold uppercase tracking-wider text-[9px]">Price</p>
                        <p className="font-extrabold text-[#800020] text-sm">LKR {s.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              {billingServices.length === 0 && (
                <p className="col-span-full text-center py-8 text-gray-400 italic">No billing services found</p>
              )}
            </div>
          </div>
        ) : activeTab === 'billingPOS' ? (
          <div>
            <style dangerouslySetInnerHTML={{__html: `
              @media print {
                @page {
                  size: 80mm auto;
                  margin: 0;
                }
                /* Hide all elements by default to remove them from print flow */
                body * {
                  display: none !important;
                }
                /* Enable display and strip desktop widths/transforms on ancestors to prevent shrinking */
                html, body, main, div:has(#print-section) {
                  display: block !important;
                  width: 100% !important;
                  min-width: 0 !important;
                  max-width: 100% !important;
                  height: auto !important;
                  min-height: 0 !important;
                  max-height: none !important;
                  overflow: visible !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  border: none !important;
                  box-shadow: none !important;
                  background: white !important;
                  background-image: none !important;
                  transform: none !important;
                }
                /* Explicitly show #print-section and its descendants */
                #print-section, #print-section * {
                  display: block !important;
                }
                #print-section {
                  position: static !important;
                  width: 100% !important;
                  max-width: 100% !important;
                  box-sizing: border-box !important;
                  margin: 0 !important;
                  padding: 12px !important;
                  border: none !important;
                  box-shadow: none !important;
                  border-radius: 0 !important;
                  background: white !important;
                  color: black !important;
                  page-break-inside: avoid !important;
                }
              }
            `}} />

            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold font-serif text-[#4a2511]">Generate & Print POS Invoice</h2>
                <p className="text-xs text-gray-500 mt-0.5">Quickly select services, assign staff, and print thermal receipt invoices</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-32">
              {/* Left Side: POS Cart Controls */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Section 1: Customer Selection */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#d4af37]/20">
                  <h3 className="text-base font-bold font-serif text-[#4a2511] mb-4 uppercase tracking-wider border-b border-[#d4af37]/20 pb-2">1. Select Customer</h3>
                  <div className="flex gap-4">
                    <select 
                      className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] text-sm focus:outline-none"
                      value={selectedPOSCustomer ? JSON.stringify(selectedPOSCustomer) : ''}
                      onChange={e => {
                        const val = e.target.value;
                        setSelectedPOSCustomer(val ? JSON.parse(val) : null);
                      }}
                    >
                      <option value="">-- Walk-in Customer (Guest) --</option>
                      {billingCustomers.map(c => (
                        <option key={c._id} value={JSON.stringify(c)}>{c.name} ({c.whatsapp})</option>
                      ))}
                    </select>
                  </div>
                  {selectedPOSCustomer && (
                    <div className="mt-3 text-xs bg-[#fdf5eb] p-3 rounded border border-[#d4af37]/30 text-stone-700">
                      <p><strong>Name:</strong> {selectedPOSCustomer.name}</p>
                      <p><strong>WhatsApp:</strong> {selectedPOSCustomer.whatsapp}</p>
                      {selectedPOSCustomer.address && <p><strong>Address:</strong> {selectedPOSCustomer.address}</p>}
                    </div>
                  )}
                </div>

                {/* Section 2: Add Service Rate to Invoice */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#d4af37]/20">
                  <h3 className="text-base font-bold font-serif text-[#4a2511] mb-4 uppercase tracking-wider border-b border-[#d4af37]/20 pb-2">2. Add Service Rate</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-gray-500">Choose Service</label>
                      <select 
                        className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] text-sm focus:outline-none"
                        value={selectedPOSServiceId}
                        onChange={e => setSelectedPOSServiceId(e.target.value)}
                      >
                        <option value="">-- Choose Service --</option>
                        {billingServices.map(s => (
                          <option key={s._id} value={s._id}>{s.name} - LKR {s.price}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1 text-gray-500">Performed By (Staff)</label>
                        <select 
                          className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] text-sm focus:outline-none"
                          value={selectedPOSStaffId}
                          onChange={e => setSelectedPOSStaffId(e.target.value)}
                        >
                          <option value="">-- Choose Staff Member --</option>
                          {staffList.map(st => (
                            <option key={st._id} value={st.name}>{st.name} ({st.role})</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button 
                          onClick={() => {
                            if (!selectedPOSServiceId) {
                              showToast("Please choose a service rate!", "error");
                              return;
                            }
                            const service = billingServices.find(s => s._id === selectedPOSServiceId);
                            if (!service) return;

                            const item = {
                              id: Date.now().toString(),
                              serviceId: service._id,
                              name: service.name,
                              price: Number(service.price),
                              staff: selectedPOSStaffId || "Walk-in Staff/None"
                            };

                            setInvoiceCart([...invoiceCart, item]);
                            setSelectedPOSServiceId('');
                            setSelectedPOSStaffId('');
                            showToast("Item added to invoice!", "success");
                          }}
                          className="gold-button w-full py-2.5 text-xs font-bold uppercase tracking-wider"
                        >
                          + Add Item
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Cart Table */}
                <div className="bg-white rounded-xl shadow-sm border border-[#d4af37]/20 overflow-hidden">
                  <div className="p-4 border-b border-[#d4af37]/10 bg-stone-50">
                    <h3 className="font-serif font-bold text-[#4a2511] text-sm">Invoice Cart List</h3>
                  </div>
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-[#fdf5eb] text-[#4a2511] text-xs font-bold uppercase">
                        <th className="p-3">Service</th>
                        <th className="p-3">Staff</th>
                        <th className="p-3 text-right">Price</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {invoiceCart.map((item) => (
                        <tr key={item.id} className="hover:bg-stone-50">
                          <td className="p-3 font-semibold text-[#4a2511]">{item.name}</td>
                          <td className="p-3 text-stone-600 text-xs">{item.staff}</td>
                          <td className="p-3 text-right font-mono">LKR {item.price.toLocaleString()}</td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => {
                                setInvoiceCart(invoiceCart.filter(i => i.id !== item.id));
                                showToast("Item removed from cart", "success");
                              }}
                              className="text-red-600 hover:text-red-800 text-xs font-bold"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                      {invoiceCart.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-gray-400 italic text-xs">No items added to invoice yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Side: Receipt Thermal View & Actions */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-[#d4af37]/30 rounded-xl shadow-md p-6">
                  
                  {/* Print invoice receipt area */}
                  <div 
                    id="print-section" 
                    className="border border-stone-300 p-6 bg-stone-50 rounded-lg shadow-inner text-black font-mono text-xs space-y-4 max-w-[350px] mx-auto bg-white"
                  >
                    <div className="text-center space-y-1">
                      <h4 className="font-bold text-sm uppercase">MATHUMI BRIDAL</h4>
                      <p className="text-[10px] text-stone-600">Boutique & Salon</p>
                      <p className="text-[9px] text-stone-500">Trinco Road, Near Signal Light, Batticaloa</p>
                      <p className="text-[9px] text-stone-500">Tel: +94 77 123 4567</p>
                    </div>

                    <div className="border-t border-dashed border-stone-400 pt-2 space-y-1 text-[10px]">
                      <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                      <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
                      <p><strong>Customer:</strong> {selectedPOSCustomer ? selectedPOSCustomer.name : 'Walk-in Customer'}</p>
                      {selectedPOSCustomer && <p><strong>WhatsApp:</strong> {selectedPOSCustomer.whatsapp}</p>}
                    </div>

                    <div className="border-t border-dashed border-stone-400 pt-2">
                      <table className="w-full text-left text-[10px]">
                        <thead>
                          <tr className="border-b border-dashed border-stone-300 font-bold">
                            <th>Service</th>
                            <th className="text-right">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoiceCart.map((item) => (
                            <tr key={item.id}>
                              <td className="py-1">
                                {item.name}
                                <div className="text-[8px] text-stone-500">By: {item.staff}</div>
                              </td>
                              <td className="text-right py-1">LKR {item.price.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="border-t border-dashed border-stone-400 pt-2 space-y-1 text-[10px]">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>LKR {invoiceCart.reduce((sum, item) => sum + item.price, 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span>LKR {posDiscount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-dashed border-stone-300 pt-1 text-xs">
                        <span>GRAND TOTAL:</span>
                        <span>LKR {Math.max(0, invoiceCart.reduce((sum, item) => sum + item.price, 0) - posDiscount).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-center pt-4 text-[9px] text-stone-500">
                      <p>Thank you for choosing Mathumi!</p>
                      <p>Have a beautiful day!</p>
                    </div>
                  </div>

                  {/* Settings and Print Button */}
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-[#4a2511]">Apply Discount (LKR)</label>
                      <input 
                        type="number"
                        className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] text-sm focus:outline-none"
                        value={posDiscount || ''}
                        onChange={e => setPosDiscount(Number(e.target.value))}
                        placeholder="Discount amount"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          if (invoiceCart.length === 0) {
                            showToast("Add items to the cart before printing!", "error");
                            return;
                          }
                          window.print();
                        }}
                        className="gold-button flex-1 py-3 text-sm font-bold uppercase tracking-wide flex justify-center items-center gap-2"
                      >
                        🖨️ Print Invoice
                      </button>
                      <button 
                        onClick={() => {
                          setInvoiceCart([]);
                          setSelectedPOSCustomer(null);
                          setPosDiscount(0);
                          showToast("Cart cleared!", "success");
                        }}
                        className="bg-stone-200 text-stone-700 px-4 py-3 rounded-lg text-xs font-bold hover:bg-stone-300 transition"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'billingCustomers' ? (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold font-serif text-[#4a2511]">POS Customer Directory</h2>
                <p className="text-xs text-gray-500 mt-0.5">Manage customer details for POS invoice generation (deletion disabled to protect billing integrity)</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <input 
                  type="text" 
                  placeholder="Search by name / WhatsApp..." 
                  value={searchCustomer} 
                  onChange={e => setSearchCustomer(e.target.value)} 
                  className="p-2 border border-[#d4af37]/40 rounded bg-white text-xs outline-none w-full sm:w-64 focus:border-[#d4af37]"
                />
                <button onClick={openAddCustomerModal} className="gold-button px-4 py-2 text-sm shadow w-full sm:w-auto">
                  + Add Customer
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#d4af37]/20 overflow-x-auto mb-32">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f4e8d3] text-[#4a2511]">
                    <th className="p-3 text-xs font-bold">Customer Name</th>
                    <th className="p-3 text-xs font-bold">WhatsApp Number</th>
                    <th className="p-3 text-xs font-bold">Phone Number</th>
                    <th className="p-3 text-xs font-bold">Address</th>
                    <th className="p-3 text-xs font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {billingCustomers
                    .filter(c => 
                      c.name?.toLowerCase().includes(searchCustomer.toLowerCase()) || 
                      c.whatsapp?.includes(searchCustomer)
                    )
                    .map(c => (
                      <tr key={c._id} className="border-b hover:bg-[#fdf5eb] text-sm">
                        <td className="p-3 font-semibold text-[#4a2511]">{c.name}</td>
                        <td className="p-3 text-[#075e54] font-bold">💬 {c.whatsapp}</td>
                        <td className="p-3">{c.phone || '—'}</td>
                        <td className="p-3 text-xs text-gray-600 truncate max-w-xs">{c.address || '—'}</td>
                        <td className="p-3 text-right space-x-2 whitespace-nowrap">
                          <button 
                            onClick={() => { setSelectedCustomer(c); setIsCustomerViewModalOpen(true); }}
                            className="text-[#4a2511] hover:underline font-bold text-xs"
                          >
                            👁 View
                          </button>
                          <button 
                            onClick={() => openEditCustomerModal(c)}
                            className="text-blue-600 hover:underline font-bold text-xs"
                          >
                            ✏️ Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  {billingCustomers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-400 italic">No customers found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
          </div>
        </div>
      </div>

      {/* Saree Add/Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[1000] p-4">
          <div className="gold-panel p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-2xl font-bold text-[#4a2511]">&times;</button>
            <h2 className="text-2xl font-bold text-[#4a2511] mb-6 uppercase text-center border-b border-[#d4af37] pb-2">
              {isEditing ? 'Edit Saree' : 'Add New Saree'}
            </h2>
            <form onSubmit={handleSaveSaree} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Saree Name</label>
                <input required type="text" className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" value={sareeForm.name} onChange={e => setSareeForm({...sareeForm, name: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Price</label>
                  <input required type="text" className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" value={sareeForm.price} onChange={e => setSareeForm({...sareeForm, price: e.target.value})} />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Color</label>
                  <input required type="text" className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" value={sareeForm.color} onChange={e => setSareeForm({...sareeForm, color: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Category</label>
                  <select required className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" value={sareeForm.category} onChange={e => setSareeForm({...sareeForm, category: e.target.value})}>
                    <option value="" disabled>-- Select Category --</option>
                    <option value="Pure Kanchipuram Silk Sarees">Pure Kanchipuram Silk Sarees</option>
                    <option value="Banarasi Silk Sarees">Banarasi Silk Sarees</option>
                    <option value="Bridal Sarees">Bridal Sarees</option>
                    <option value="Pattu Silk Sarees">Pattu Silk Sarees</option>
                    <option value="Cotton Sarees">Cotton Sarees</option>
                    <option value="Georgette Sarees">Georgette Sarees</option>
                    <option value="Chiffon Sarees">Chiffon Sarees</option>
                    <option value="Rich Aari Work Blouses">Rich Aari Work Blouses</option>
                    <option value="Embroidered Blouses">Embroidered Blouses</option>
                    <option value="Lehengas">Lehengas</option>
                    <option value="Half Sarees">Half Sarees</option>
                    <option value="Saree Sets">Saree Sets</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Type</label>
                  <input required type="text" className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" placeholder="SAREE or AARI BLOUSE" value={sareeForm.type} onChange={e => setSareeForm({...sareeForm, type: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Fabric (e.g. Pure Silk)</label>
                  <input type="text" className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" value={sareeForm.fabric} onChange={e => setSareeForm({...sareeForm, fabric: e.target.value})} />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Zari (e.g. Gold Zari)</label>
                  <input type="text" className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" value={sareeForm.zari} onChange={e => setSareeForm({...sareeForm, zari: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Description</label>
                <textarea rows={3} className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" value={sareeForm.description} onChange={e => setSareeForm({...sareeForm, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Saree Images</label>
                <div 
                  {...getSareeProps()} 
                  className={`border-2 border-dashed p-6 text-center cursor-pointer rounded bg-[#fdf5eb] ${isSareeDrag ? 'border-[#800020] bg-red-50' : 'border-[#d4af37]'}`}
                >
                  <input {...getSareeInput()} multiple />
                  <p className="text-[#4a2511]">{isSareeDrag ? 'Drop images...' : 'Drag & drop images here (you can select multiple)'}</p>
                </div>
                {sareeForm.images && sareeForm.images.length > 0 ? (
                  <div className="flex flex-wrap gap-3 mt-4 justify-center">
                    {sareeForm.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`Preview ${idx}`} className="h-20 w-20 object-cover border border-[#d4af37] rounded shadow-sm" />
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSareeImage(idx)} 
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : sareeForm.image && (
                  <img src={sareeForm.image} alt="Preview" className="h-20 mt-4 mx-auto object-cover border border-[#d4af37] rounded" />
                )}
              </div>
              <div className="flex gap-3 mt-6">
                {isEditing && (
                  <button 
                    type="button" 
                    onClick={() => { setIsEditModalOpen(false); handleDeleteSaree(sareeForm._id); }}
                    className="w-1/3 bg-red-600 hover:bg-red-700 text-white rounded text-xs py-3 uppercase font-bold transition-colors"
                  >
                    Delete
                  </button>
                )}
                <button type="submit" className={`${isEditing ? 'w-2/3' : 'w-full'} gold-button text-sm py-3 uppercase tracking-wide font-bold`}>
                  {isEditing ? 'Save Changes' : 'Add Saree'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Add/Edit Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[1000] p-4">
          <div className="gold-panel p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsServiceModalOpen(false)} className="absolute top-4 right-4 text-2xl font-bold text-[#4a2511]">&times;</button>
            <h2 className="text-2xl font-bold text-[#4a2511] mb-6 uppercase text-center border-b border-[#d4af37] pb-2">
              {isEditingService ? 'Edit Service' : 'Add New Service'}
            </h2>
            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Service Title</label>
                <input required type="text" className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb]" value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Category</label>
                <select className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb]" value={serviceForm.category} onChange={e => setServiceForm({...serviceForm, category: e.target.value})}>
                  {salonCategories.map((c: any) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Description</label>
                <textarea required className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb]" rows={3} value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Service Images</label>
                <div {...getServiceProps()} className={`border-2 border-dashed p-6 text-center cursor-pointer rounded bg-[#fdf5eb] ${isServiceDrag ? 'border-[#800020] bg-red-50' : 'border-[#d4af37]'}`}>
                  <input {...getServiceInput()} multiple />
                  <p className="text-[#4a2511]">{isServiceDrag ? 'Drop images...' : 'Drag & drop images here (you can select multiple)'}</p>
                </div>
                {serviceForm.images && serviceForm.images.length > 0 ? (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {serviceForm.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`Preview ${idx}`} className="h-20 w-20 object-cover border border-[#d4af37] rounded shadow-sm" />
                        <button type="button" onClick={() => handleRemoveServiceImage(idx)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                      </div>
                    ))}
                  </div>
                ) : serviceForm.image && (
                  <img src={serviceForm.image} alt="Preview" className="h-20 mt-4 mx-auto object-cover border border-[#d4af37] rounded" />
                )}
              </div>
              <button type="submit" className="gold-button w-full mt-6 text-sm py-3 uppercase">
                {isEditingService ? 'Save Changes' : 'Add Service'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Category Add/Edit Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[1000] p-4">
          <div className="gold-panel p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsCategoryModalOpen(false)} className="absolute top-4 right-4 text-2xl font-bold text-[#4a2511]">&times;</button>
            <h2 className="text-2xl font-bold text-[#4a2511] mb-6 uppercase text-center border-b border-[#d4af37] pb-2">
              {isEditingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Category Name</label>
                <input required type="text" className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb]" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Description</label>
                <textarea required className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb]" rows={3} value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Category Hero Images</label>
                <div {...getCategoryProps()} className={`border-2 border-dashed p-6 text-center cursor-pointer rounded bg-[#fdf5eb] ${isCategoryDrag ? 'border-[#800020] bg-red-50' : 'border-[#d4af37]'}`}>
                  <input {...getCategoryInput()} multiple />
                  <p className="text-[#4a2511]">{isCategoryDrag ? 'Drop images...' : 'Drag & drop images here (you can select multiple)'}</p>
                </div>
                {categoryForm.images && categoryForm.images.length > 0 ? (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {categoryForm.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`Preview ${idx}`} className="h-20 w-20 object-cover border border-[#d4af37] rounded shadow-sm" />
                        <button type="button" onClick={() => handleRemoveCategoryImage(idx)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                      </div>
                    ))}
                  </div>
                ) : categoryForm.image && (
                  <img src={categoryForm.image} alt="Preview" className="h-20 mt-4 mx-auto object-cover border border-[#d4af37] rounded" />
                )}
              </div>
              <button type="submit" className="gold-button w-full mt-6 text-sm py-3 uppercase">
                {isEditingCategory ? 'Save Changes' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Add/Edit Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[1000] p-4">
          <div className="gold-panel p-8 w-full max-w-md relative">
            <button onClick={() => setIsGalleryModalOpen(false)} className="absolute top-4 right-4 text-2xl font-bold text-[#4a2511]">&times;</button>
            <h2 className="text-2xl font-bold text-[#4a2511] mb-6 uppercase text-center border-b border-[#d4af37] pb-2">
              {isEditingGallery ? 'Edit Image' : 'Upload Image'}
            </h2>
            <form onSubmit={handleSaveGallery} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Image Title</label>
                <input required type="text" className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb]" value={galleryForm.title} onChange={e => setGalleryForm({...galleryForm, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Category</label>
                <select className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb]" value={galleryForm.category} onChange={e => setGalleryForm({...galleryForm, category: e.target.value})}>
                  <option value="Bridal">Bridal</option>
                  <option value="Salon">Salon</option>
                  <option value="Makeup">Makeup</option>
                  <option value="Skin Care">Skin Care</option>
                  <option value="Boutique">Boutique</option>
                  <option value="Academy">Academy</option>
                  <option value="Gallery">Gallery</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Upload Image</label>
                <div {...getGalleryProps()} className={`border-2 border-dashed p-6 text-center cursor-pointer rounded bg-[#fdf5eb] ${isGalleryDrag ? 'border-[#800020] bg-red-50' : 'border-[#d4af37]'}`}>
                  <input {...getGalleryInput()} />
                  <p className="text-[#4a2511]">{isGalleryDrag ? 'Drop image...' : 'Drag & drop image'}</p>
                </div>
                {galleryForm.url && <img src={galleryForm.url} alt="Preview" className="h-20 mt-2 mx-auto object-cover border border-[#d4af37] rounded" />}
              </div>
              <button type="submit" className="gold-button w-full mt-6 text-sm py-3 uppercase">
                {isEditingGallery ? 'Save Changes' : 'Upload'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Academy Add/Edit Modal */}
      {isAcademyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[1000] p-4">
          <div className="gold-panel p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsAcademyModalOpen(false)} className="absolute top-4 right-4 text-2xl font-bold text-[#4a2511]">&times;</button>
            <h2 className="text-2xl font-bold text-[#4a2511] mb-6 uppercase text-center border-b border-[#d4af37] pb-2">
              {isEditingAcademy ? 'Edit Course' : 'Add New Course'}
            </h2>
            <form onSubmit={handleSaveAcademy} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Course Title</label>
                <input required type="text" className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb]" value={academyForm.title} onChange={e => setAcademyForm({...academyForm, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Duration</label>
                <input required type="text" className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb]" placeholder="e.g. 3 Months" value={academyForm.duration} onChange={e => setAcademyForm({...academyForm, duration: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Syllabus (One item per line)</label>
                <textarea required className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb]" rows={4} value={academyForm.syllabus} onChange={e => setAcademyForm({...academyForm, syllabus: e.target.value})} placeholder="Color theory&#10;HD Makeup..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Course Images</label>
                <div {...getAcademyProps()} className={`border-2 border-dashed p-6 text-center cursor-pointer rounded bg-[#fdf5eb] ${isAcademyDrag ? 'border-[#800020] bg-red-50' : 'border-[#d4af37]'}`}>
                  <input {...getAcademyInput()} multiple />
                  <p className="text-[#4a2511] text-sm">{isAcademyDrag ? 'Drop images here...' : 'Drag & drop images here (you can select multiple)'}</p>
                  <p className="text-[10px] text-[#4a2511]/50 mt-1">JPG, PNG, WebP supported</p>
                </div>
                {academyForm.images && academyForm.images.length > 0 ? (
                  <div className="flex flex-wrap gap-3 mt-4 justify-center">
                    {academyForm.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`Preview ${idx}`} className="h-20 w-20 object-cover border border-[#d4af37] rounded shadow-sm" />
                        <button
                          type="button"
                          onClick={() => handleRemoveAcademyImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        {idx === 0 && <span className="absolute bottom-0 left-0 right-0 text-center text-[8px] bg-[#d4af37]/80 text-white font-bold py-0.5">COVER</span>}
                      </div>
                    ))}
                  </div>
                ) : academyForm.image && (
                  <img src={academyForm.image} alt="Preview" className="h-20 mt-4 mx-auto object-cover border border-[#d4af37] rounded" />
                )}
              </div>
              <div className="flex gap-3 mt-6">
                {isEditingAcademy && (
                  <button 
                    type="button" 
                    onClick={() => { setIsAcademyModalOpen(false); handleDeleteAcademy(academyForm._id); }}
                    className="w-1/3 bg-red-600 hover:bg-red-700 text-white rounded text-xs py-3 uppercase font-bold transition-colors"
                  >
                    Delete
                  </button>
                )}
                <button type="submit" className={`${isEditingAcademy ? 'w-2/3' : 'w-full'} gold-button text-sm py-3 uppercase tracking-wide font-bold`}>
                  {isEditingAcademy ? 'Save Changes' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff View Modal */}
      {isStaffViewModalOpen && selectedStaff && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={() => setIsStaffViewModalOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl border border-[#d4af37]/40 w-full max-w-md mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#4a2511] to-[#800020] px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-serif font-bold text-lg tracking-wide">👤 Staff Details</h3>
              <button
                onClick={() => setIsStaffViewModalOpen(false)}
                className="text-white/80 hover:text-white text-2xl leading-none transition-colors"
              >
                ×
              </button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col items-center justify-center mb-6">
                <img 
                  src={selectedStaff.photo || '/avatar-placeholder.png'} 
                  alt={selectedStaff.name} 
                  className="w-24 h-24 object-cover rounded-full border-2 border-[#d4af37] shadow-md bg-white mb-3" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(selectedStaff.name);
                  }}
                />
                <h2 className="text-xl font-bold text-[#4a2511]">{selectedStaff.name}</h2>
                <span className="bg-[#d4af37]/10 text-[#3a1f0d] border border-[#d4af37]/35 text-xs font-bold px-3 py-1 mt-1 rounded-full uppercase tracking-wider">
                  {selectedStaff.role || 'Beauty Therapist'}
                </span>
              </div>
              
              <hr className="border-[#d4af37]/20" />
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-lg">📞</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Mobile</p>
                    <p className="text-[#4a2511] font-bold text-sm">{selectedStaff.mobile || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">💬</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">WhatsApp</p>
                    <p className="text-[#075e54] font-bold text-sm">{selectedStaff.whatsapp || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">📍</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Address</p>
                    <p className="text-[#4a2511] font-bold text-sm">{selectedStaff.address || '—'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">🪪</span>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">NIC</p>
                      <p className="text-[#4a2511] font-bold text-sm">{selectedStaff.nic || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-lg">🎂</span>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Date of Birth</p>
                      <p className="text-[#4a2511] font-bold text-sm">
                        {selectedStaff.dob ? new Date(selectedStaff.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-[#fdf5eb] border-t border-[#d4af37]/20 flex justify-end">
              <button
                onClick={() => setIsStaffViewModalOpen(false)}
                className="px-6 py-2 bg-gradient-to-r from-[#4a2511] to-[#800020] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Add/Edit Modal */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[1000] p-4">
          <div className="gold-panel p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsStaffModalOpen(false)} className="absolute top-4 right-4 text-2xl font-bold text-[#4a2511]">&times;</button>
            <h2 className="text-2xl font-bold text-[#4a2511] mb-6 uppercase text-center border-b border-[#d4af37] pb-2 font-serif tracking-wider">
              {isEditingStaff ? 'Edit Staff Member' : 'Add Staff Member'}
            </h2>
            <form onSubmit={handleSaveStaff} className="space-y-4 text-[#3a1f0d]">
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Full Name</label>
                <input required type="text" className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" placeholder="e.g. Priyanthi Silva" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Address</label>
                <input required type="text" className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" placeholder="e.g. 12/A, Galle Road, Colombo" value={staffForm.address} onChange={e => setStaffForm({...staffForm, address: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Mobile Number</label>
                  <input required type="tel" className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" placeholder="e.g. 0771234567" value={staffForm.mobile} onChange={e => setStaffForm({...staffForm, mobile: e.target.value})} />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold mb-1 text-[#4a2511]">WhatsApp Number</label>
                  <input required type="tel" className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" placeholder="e.g. 0771234567" value={staffForm.whatsapp} onChange={e => setStaffForm({...staffForm, whatsapp: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold mb-1 text-[#4a2511]">NIC Number</label>
                  <input required type="text" className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" placeholder="e.g. 199512345V" value={staffForm.nic} onChange={e => setStaffForm({...staffForm, nic: e.target.value})} />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Date of Birth</label>
                  <input required type="date" className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" value={staffForm.dob ? staffForm.dob.split('T')[0] : ''} onChange={e => setStaffForm({...staffForm, dob: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Role</label>
                <select className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value})}>
                  <option value="Beauty Therapist">Beauty Therapist</option>
                  <option value="Hair Stylist">Hair Stylist</option>
                  <option value="Nail Technician">Nail Technician</option>
                  <option value="Makeup Artist">Makeup Artist</option>
                  <option value="Senior Stylist">Senior Stylist</option>
                  <option value="Salon Manager">Salon Manager</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Staff Photo</label>
                <div {...getStaffProps()} className={`border-2 border-dashed p-6 text-center cursor-pointer rounded bg-[#fdf5eb] ${isStaffDrag ? 'border-[#800020] bg-red-50' : 'border-[#d4af37]'}`}>
                  <input {...getStaffInput()} />
                  <p className="text-[#4a2511] text-xs">{isStaffDrag ? 'Drop photo here...' : 'Drag & drop staff photo, or click to browse'}</p>
                </div>
                {staffForm.photo && (
                  <div className="relative group mt-3 w-24 h-24 mx-auto">
                    <img src={staffForm.photo} alt="Preview" className="w-full h-full object-cover border border-[#d4af37] rounded-full shadow-sm bg-white" />
                    <button type="button" onClick={handleRemoveStaffPhoto} className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                  </div>
                )}
              </div>
              <button type="submit" className="gold-button w-full mt-6 text-sm py-3 uppercase tracking-wider font-bold">
                {isEditingStaff ? 'Save Changes' : 'Add Staff Member'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Inquiry Details Modal */}
      {isInquiryModalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={() => setIsInquiryModalOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          {/* Modal */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl border border-[#d4af37]/40 w-full max-w-lg mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#4a2511] to-[#800020] px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-serif font-bold text-lg tracking-wide">🔍 Inquiry Details</h3>
              <button
                onClick={() => setIsInquiryModalOpen(false)}
                className="text-white/80 hover:text-white text-2xl leading-none transition-colors"
              >
                ×
              </button>
            </div>
            {/* Body */}
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Customer Name */}
              <div className="flex items-start gap-3">
                <span className="text-lg">👤</span>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Customer Name</p>
                  <p className="text-[#4a2511] font-bold text-sm">{selectedInquiry.customerName || 'Guest User'}</p>
                </div>
              </div>
              {/* Contact Number */}
              <div className="flex items-start gap-3">
                <span className="text-lg">📞</span>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Contact Number</p>
                  <p className="text-[#4a2511] font-bold text-sm">{selectedInquiry.contactNumber || 'No Contact'}</p>
                </div>
              </div>
              <hr className="border-[#d4af37]/20" />
              {/* Items Inquired */}
              <div className="flex items-start gap-3">
                <span className="text-lg">🛍️</span>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Items Inquired ({selectedInquiry.items?.length || 0})</p>
                  <div className="mt-2 space-y-2">
                    {selectedInquiry.items?.map((item: any, idx: number) => (
                      <div key={item._id || idx} className="flex items-center gap-2 bg-[#fdf5eb] p-2 rounded border border-[#d4af37]/30">
                        {item.image && <img src={item.image} alt="" className="w-10 h-10 object-cover rounded shadow-sm flex-shrink-0" />}
                        <div className="truncate">
                          <p className="font-bold text-[#4a2511] text-xs leading-tight truncate">{item.name || 'Unknown Item'}</p>
                          <p className="text-[10px] text-gray-500 leading-none mt-1">{item.price || 'No Price'}</p>
                        </div>
                      </div>
                    ))}
                    {!selectedInquiry.items?.length && <p className="text-xs text-gray-500">No items specified.</p>}
                  </div>
                </div>
              </div>
              <hr className="border-[#d4af37]/20" />
              {/* Status */}
              <div className="flex items-start gap-3">
                <span className="text-lg">📌</span>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Status</p>
                  <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mt-1 ${
                    selectedInquiry.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                    selectedInquiry.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                    'bg-green-100 text-green-800'
                  }`}>{selectedInquiry.status || 'New'}</span>
                </div>
              </div>
              {/* Date Created */}
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex items-start gap-2">
                  <span className="text-sm">🗓️</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Date Created</p>
                    <p className="text-[#4a2511] text-xs font-medium mt-0.5">
                      {selectedInquiry.createdAt ? new Date(selectedInquiry.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date(selectedInquiry.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm">🔄</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Last Updated</p>
                    <p className="text-[#4a2511] text-xs font-medium mt-0.5">
                      {selectedInquiry.updatedAt ? new Date(selectedInquiry.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date(selectedInquiry.updatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'Not yet updated'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 bg-[#fdf5eb] border-t border-[#d4af37]/20 flex justify-end">
              <button
                onClick={() => setIsInquiryModalOpen(false)}
                className="px-6 py-2 bg-gradient-to-r from-[#4a2511] to-[#800020] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Academy Course Details Modal */}
      {isAcademyViewModalOpen && selectedAcademy && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={() => setIsAcademyViewModalOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-[#d4af37]/40 w-full max-w-xl mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#4a2511] to-[#800020] px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-serif font-bold text-lg tracking-wide">🎓 Course Details</h3>
              <button onClick={() => setIsAcademyViewModalOpen(false)} className="text-white/80 hover:text-white text-2xl transition-colors">×</button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/3">
                  <img src={selectedAcademy.image || '/academy_class1.png'} alt={selectedAcademy.title} className="w-full h-32 object-cover rounded-xl border border-[#d4af37]/30 shadow-sm" />
                </div>
                <div className="w-full sm:w-2/3 space-y-2">
                  <h4 className="text-lg font-bold text-[#4a2511] font-serif">{selectedAcademy.title}</h4>
                  <p className="text-xs text-gray-500 font-semibold">Duration: {selectedAcademy.duration}</p>
                </div>
              </div>
              {selectedAcademy.syllabus && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Syllabus / Modules</p>
                  <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 whitespace-pre-wrap">
                    {Array.isArray(selectedAcademy.syllabus) ? selectedAcademy.syllabus.join('\n') : selectedAcademy.syllabus}
                  </p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-[#fdf5eb] border-t border-[#d4af37]/20 flex justify-end">
              <button onClick={() => setIsAcademyViewModalOpen(false)} className="px-6 py-2 bg-gradient-to-r from-[#4a2511] to-[#800020] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-md">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Salon Service Details Modal */}
      {isServiceViewModalOpen && selectedService && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={() => setIsServiceViewModalOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-[#d4af37]/40 w-full max-w-xl mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#4a2511] to-[#800020] px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-serif font-bold text-lg tracking-wide">✂️ Service Details</h3>
              <button onClick={() => setIsServiceViewModalOpen(false)} className="text-white/80 hover:text-white text-2xl transition-colors">×</button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/3">
                  <img src={selectedService.image || '/salon-service.png'} alt={selectedService.title} className="w-full h-32 object-cover rounded-xl border border-[#d4af37]/30 shadow-sm" />
                </div>
                <div className="w-full sm:w-2/3 space-y-2">
                  <h4 className="text-lg font-bold text-[#4a2511] font-serif">{selectedService.title}</h4>
                  <span className="bg-[#d4af37]/15 text-[#3a1f0d] border border-[#d4af37]/35 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mt-1">{selectedService.category}</span>
                </div>
              </div>
              {selectedService.description && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Description</p>
                  <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 whitespace-pre-wrap">{selectedService.description}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-[#fdf5eb] border-t border-[#d4af37]/20 flex justify-end">
              <button onClick={() => setIsServiceViewModalOpen(false)} className="px-6 py-2 bg-gradient-to-r from-[#4a2511] to-[#800020] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-md">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Salon Category Details Modal */}
      {isCategoryViewModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={() => setIsCategoryViewModalOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-[#d4af37]/40 w-full max-w-xl mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#4a2511] to-[#800020] px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-serif font-bold text-lg tracking-wide">🏷️ Category Details</h3>
              <button onClick={() => setIsCategoryViewModalOpen(false)} className="text-white/80 hover:text-white text-2xl transition-colors">×</button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/3">
                  <img src={selectedCategory.image || '/salon-service.png'} alt={selectedCategory.name} className="w-full h-32 object-cover rounded-xl border border-[#d4af37]/30 shadow-sm" />
                </div>
                <div className="w-full sm:w-2/3 space-y-2">
                  <h4 className="text-lg font-bold text-[#4a2511] font-serif">{selectedCategory.name}</h4>
                </div>
              </div>
              {selectedCategory.description && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Description</p>
                  <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 whitespace-pre-wrap">{selectedCategory.description}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-[#fdf5eb] border-t border-[#d4af37]/20 flex justify-end">
              <button onClick={() => setIsCategoryViewModalOpen(false)} className="px-6 py-2 bg-gradient-to-r from-[#4a2511] to-[#800020] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-md">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Saree Details Modal */}
      {isSareeViewModalOpen && selectedSaree && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={() => setIsSareeViewModalOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          {/* Modal */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl border border-[#d4af37]/40 w-full max-w-xl mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#4a2511] to-[#800020] px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-serif font-bold text-lg tracking-wide">👘 Saree Details</h3>
              <button
                onClick={() => setIsSareeViewModalOpen(false)}
                className="text-white/80 hover:text-white text-2xl leading-none transition-colors"
              >
                ×
              </button>
            </div>
            {/* Body */}
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/3">
                  <img src={selectedSaree.image} alt={selectedSaree.name} className="w-full h-40 object-cover rounded-xl border border-[#d4af37]/30 shadow-sm" />
                </div>
                <div className="w-full sm:w-2/3 space-y-2">
                  <h4 className="text-lg font-bold text-[#4a2511] font-serif">{selectedSaree.name}</h4>
                  <p className="text-sm font-bold text-[#800020]">{selectedSaree.price}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <p><span className="text-gray-500 font-medium">Color:</span> <span className="capitalize font-semibold">{selectedSaree.color || '—'}</span></p>
                    <p><span className="text-gray-500 font-medium">Category:</span> <span className="font-semibold">{selectedSaree.category || '—'}</span></p>
                    <p><span className="text-gray-500 font-medium">Fabric:</span> <span className="font-semibold">{selectedSaree.fabric || '—'}</span></p>
                    <p><span className="text-gray-500 font-medium">Zari:</span> <span className="font-semibold">{selectedSaree.zari || '—'}</span></p>
                  </div>
                </div>
              </div>
              
              {selectedSaree.description && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Description</p>
                  <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 whitespace-pre-wrap">{selectedSaree.description}</p>
                </div>
              )}

              {selectedSaree.images && selectedSaree.images.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">Gallery / Additional Images</p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {selectedSaree.images.map((img: string, idx: number) => (
                      <img key={idx} src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm" />
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Footer */}
            <div className="px-6 py-4 bg-[#fdf5eb] border-t border-[#d4af37]/20 flex justify-end">
              <button
                onClick={() => setIsSareeViewModalOpen(false)}
                className="px-6 py-2 bg-gradient-to-r from-[#4a2511] to-[#800020] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {isDetailsModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={() => setIsDetailsModalOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          {/* Modal */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl border border-[#d4af37]/40 w-full max-w-lg mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#4a2511] to-[#800020] px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-serif font-bold text-lg tracking-wide">📋 Booking Details</h3>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-white/80 hover:text-white text-2xl leading-none transition-colors"
              >
                ×
              </button>
            </div>
            {/* Body */}
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Client Name */}
              <div className="flex items-start gap-3">
                <span className="text-lg">👤</span>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Client Name</p>
                  <p className="text-[#4a2511] font-bold text-sm">{selectedBooking.fullName || '—'}</p>
                </div>
              </div>
              {/* Contact Number */}
              <div className="flex items-start gap-3">
                <span className="text-lg">📞</span>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Contact Number</p>
                  <p className="text-[#4a2511] font-bold text-sm">{selectedBooking.contactNumber || '—'}</p>
                </div>
              </div>
              {/* Email */}
              {selectedBooking.email && (
                <div className="flex items-start gap-3">
                  <span className="text-lg">✉️</span>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Email</p>
                    <p className="text-[#4a2511] font-bold text-sm">{selectedBooking.email}</p>
                  </div>
                </div>
              )}
              <hr className="border-[#d4af37]/20" />
              {/* Service Name */}
              <div className="flex items-start gap-3">
                <span className="text-lg">💇</span>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Service Requested</p>
                  <p className="text-[#800020] font-bold text-sm">{selectedBooking.serviceRequested || '—'}</p>
                </div>
              </div>
              {/* Booking Date */}
              <div className="flex items-start gap-3">
                <span className="text-lg">📅</span>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Booking Date</p>
                  <p className="text-[#4a2511] font-bold text-sm">{selectedBooking.preferredDate || 'No Date'}</p>
                </div>
              </div>
              {/* Time Slot */}
              <div className="flex items-start gap-3">
                <span className="text-lg">🕐</span>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Time Slot</p>
                  <p className="text-[#4a2511] font-bold text-sm">{selectedBooking.timeSlot || 'No Time'}</p>
                </div>
              </div>
              {/* Status */}
              <div className="flex items-start gap-3">
                <span className="text-lg">📌</span>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Status</p>
                  <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                    selectedBooking.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                    selectedBooking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    selectedBooking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>{selectedBooking.status || 'Pending'}</span>
                </div>
              </div>
              <hr className="border-[#d4af37]/20" />
              {/* Notes */}
              <div className="flex items-start gap-3">
                <span className="text-lg">📝</span>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Message / Notes</p>
                  <p className="text-[#4a2511] text-sm whitespace-pre-wrap">{selectedBooking.message || selectedBooking.notes || selectedBooking.additionalNotes || 'No message provided'}</p>
                </div>
              </div>
              <hr className="border-[#d4af37]/20" />
              {/* Date Created */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <span className="text-sm">🗓️</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Date Created</p>
                    <p className="text-[#4a2511] text-xs font-medium">
                      {selectedBooking.createdAt ? new Date(selectedBooking.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date(selectedBooking.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm">🔄</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Last Updated</p>
                    <p className="text-[#4a2511] text-xs font-medium">
                      {selectedBooking.updatedAt ? new Date(selectedBooking.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date(selectedBooking.updatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'Not yet updated'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="px-6 py-4 bg-[#fdf5eb] border-t border-[#d4af37]/20 flex justify-end">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-6 py-2 bg-gradient-to-r from-[#4a2511] to-[#800020] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POS Billing Category Add/Edit Modal */}
      {isBillingCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[1000] p-4">
          <div className="gold-panel p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsBillingCategoryModalOpen(false)} className="absolute top-4 right-4 text-2xl font-bold text-[#4a2511]">&times;</button>
            <h2 className="text-2xl font-bold text-[#4a2511] mb-6 uppercase text-center border-b border-[#d4af37] pb-2 font-serif">
              {isEditingBillingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSaveBillingCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Category Name</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" 
                  value={billingCategoryForm.name} 
                  onChange={e => setBillingCategoryForm({...billingCategoryForm, name: e.target.value})} 
                />
              </div>
              <button type="submit" className="gold-button w-full mt-6 text-sm py-3 uppercase tracking-wide font-bold">
                {isEditingBillingCategory ? 'Save Changes' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POS Billing Service Add/Edit Modal */}
      {isBillingServiceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[1000] p-4">
          <div className="gold-panel p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsBillingServiceModalOpen(false)} className="absolute top-4 right-4 text-2xl font-bold text-[#4a2511]">&times;</button>
            <h2 className="text-2xl font-bold text-[#4a2511] mb-6 uppercase text-center border-b border-[#d4af37] pb-2 font-serif">
              {isEditingBillingService ? 'Edit Service' : 'Add New Service'}
            </h2>
            <form onSubmit={handleSaveBillingService} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Service Name</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" 
                  value={billingServiceForm.name} 
                  onChange={e => setBillingServiceForm({...billingServiceForm, name: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Main Category</label>
                <select 
                  required
                  className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" 
                  value={billingServiceForm.category} 
                  onChange={e => setBillingServiceForm({...billingServiceForm, category: e.target.value})}
                >
                  <option value="" disabled>-- Select Category --</option>
                  {billingCategories.map(cat => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4">
                <div className="w-1/3">
                  <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Price (LKR)</label>
                  <input 
                    required 
                    type="number" 
                    className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" 
                    value={billingServiceForm.price} 
                    onChange={e => setBillingServiceForm({...billingServiceForm, price: e.target.value})} 
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Commission</label>
                  <input 
                    required 
                    type="number" 
                    className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" 
                    value={billingServiceForm.commissionValue} 
                    onChange={e => setBillingServiceForm({...billingServiceForm, commissionValue: e.target.value})} 
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Type</label>
                  <select 
                    required
                    className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" 
                    value={billingServiceForm.commissionType} 
                    onChange={e => setBillingServiceForm({...billingServiceForm, commissionType: e.target.value})}
                  >
                    <option value="percentage">Percent (%)</option>
                    <option value="fixed">Fixed (LKR)</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="gold-button w-full mt-6 text-sm py-3 uppercase tracking-wide font-bold">
                {isEditingBillingService ? 'Save Changes' : 'Add Service'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Customer Form Modal */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[1000] p-4">
          <div className="gold-panel p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsCustomerModalOpen(false)} className="absolute top-4 right-4 text-2xl font-bold text-[#4a2511]">&times;</button>
            <h2 className="text-2xl font-bold text-[#4a2511] mb-6 uppercase text-center border-b border-[#d4af37] pb-2 font-serif">
              {isEditingCustomer ? 'Edit Customer Info' : 'Register New Customer'}
            </h2>
            <form onSubmit={handleSaveCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Customer Name (Required)</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" 
                  value={customerForm.name} 
                  onChange={e => setCustomerForm({...customerForm, name: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">WhatsApp Number (Required - numbers only)</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. 94771234567"
                  className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" 
                  value={customerForm.whatsapp} 
                  onChange={e => setCustomerForm({...customerForm, whatsapp: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Phone Number (Optional)</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" 
                  value={customerForm.phone} 
                  onChange={e => setCustomerForm({...customerForm, phone: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Address (Optional)</label>
                <textarea 
                  rows={3} 
                  className="w-full p-2 border border-[#d4af37] rounded bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-[#cba135]" 
                  value={customerForm.address} 
                  onChange={e => setCustomerForm({...customerForm, address: e.target.value})} 
                />
              </div>
              <button type="submit" className="gold-button w-full mt-6 text-sm py-3 uppercase tracking-wide font-bold">
                💾 Save Customer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Customer View Details Modal */}
      {isCustomerViewModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={() => setIsCustomerViewModalOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-[#d4af37]/40 w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#4a2511] to-[#800020] px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-serif font-bold text-lg tracking-wide">👤 Customer Details</h3>
              <button onClick={() => setIsCustomerViewModalOpen(false)} className="text-white/80 hover:text-white text-2xl transition-colors">×</button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto text-[#4a2511]">
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Name</p>
                  <p className="font-bold text-base">{selectedCustomer.name}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">WhatsApp Number</p>
                  <p className="font-bold text-base text-[#075e54]">💬 {selectedCustomer.whatsapp}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Phone Number</p>
                  <p className="font-bold text-base">{selectedCustomer.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Address</p>
                  <p className="text-sm font-medium">{selectedCustomer.address || '—'}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-[#fdf5eb] border-t border-[#d4af37]/20 flex justify-end">
              <button onClick={() => setIsCustomerViewModalOpen(false)} className="px-6 py-2 bg-gradient-to-r from-[#4a2511] to-[#800020] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-md">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Rental Jewellery Add/Edit Modal */}
      {isJewelleryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[1000] p-4">
          <div className="gold-panel p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsJewelleryModalOpen(false)} className="absolute top-4 right-4 text-2xl font-bold text-[#4a2511] hover:text-[#800020] transition-colors">&times;</button>
            <h2 className="text-2xl font-bold text-[#4a2511] mb-6 uppercase text-center border-b border-[#d4af37] pb-2 font-serif tracking-wider">
              {isEditingJewellery ? 'Edit Jewellery Set' : 'Add New Jewellery Set'}
            </h2>
            <form onSubmit={handleSaveJewellery} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Select Category *</label>
                <select
                  required
                  className="w-full p-2.5 border border-[#d4af37] rounded bg-[#fdf5eb] text-sm focus:outline-none focus:ring-1 focus:ring-[#cba135] text-[#4a2511] font-semibold"
                  value={jewelleryForm.category}
                  onChange={e => setJewelleryForm({...jewelleryForm, category: e.target.value})}
                >
                  <option value="" disabled>-- Select a Category --</option>
                  {rentalCategories.map(cat => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Jewellery Name *</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-2.5 border border-[#d4af37] rounded bg-[#fdf5eb] text-sm focus:outline-none focus:ring-1 focus:ring-[#cba135] text-[#4a2511] font-semibold" 
                  value={jewelleryForm.name} 
                  onChange={e => setJewelleryForm({...jewelleryForm, name: e.target.value})} 
                  placeholder="e.g. Royal Antique Ruby Choker Set"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Jewellery Number (Unique ID) *</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-2.5 border border-[#d4af37] rounded bg-[#fdf5eb] text-sm focus:outline-none focus:ring-1 focus:ring-[#cba135] text-[#4a2511] font-mono font-bold" 
                  value={jewelleryForm.jewelleryNumber} 
                  onChange={e => setJewelleryForm({...jewelleryForm, jewelleryNumber: e.target.value})} 
                  placeholder="e.g. JW-381"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Description</label>
                <textarea 
                  rows={3}
                  className="w-full p-2.5 border border-[#d4af37] rounded bg-[#fdf5eb] text-sm focus:outline-none focus:ring-1 focus:ring-[#cba135] text-[#4a2511] font-medium resize-none" 
                  value={jewelleryForm.description} 
                  onChange={e => setJewelleryForm({...jewelleryForm, description: e.target.value})} 
                  placeholder="Brief description about the gems, style, and set contents..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Jewellery Images *</label>
                <p className="text-[10px] text-gray-400 mb-2">Upload multiple images — first image will be the thumbnail. You can add more anytime.</p>
                <div {...getJewelleryProps()} className={`border-2 border-dashed p-6 text-center cursor-pointer rounded bg-[#fdf5eb] transition ${isJewelleryDrag ? 'border-[#800020] bg-red-50' : 'border-[#d4af37] hover:border-[#800020]'}`}>
                  <input {...getJewelleryInput()} />
                  <p className="text-[#4a2511] text-xs font-semibold">{isJewelleryDrag ? 'Drop files here...' : '📷  Drag & drop images, or click to select'}</p>
                  <p className="text-[10px] text-gray-500 mt-1">Supports JPG, PNG, WEBP · Multiple files allowed</p>
                </div>
                {jewelleryForm.images && jewelleryForm.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">{jewelleryForm.images.length} Image{jewelleryForm.images.length > 1 ? 's' : ''} Added — First is thumbnail</p>
                    <div className="flex flex-wrap gap-2">
                      {jewelleryForm.images.map((img, idx) => (
                        <div key={idx} className="relative border-2 rounded overflow-hidden group" style={{ borderColor: idx === 0 ? '#d4af37' : '#e5e7eb' }}>
                          <img src={img} alt={`img-${idx}`} className="h-20 w-20 object-cover bg-white" />
                          {idx === 0 && (
                            <div className="absolute bottom-0 left-0 right-0 bg-[#d4af37]/90 text-[8px] text-white font-bold text-center py-0.5">MAIN</div>
                          )}
                          <button
                            type="button"
                            onClick={() => setJewelleryForm(p => {
                              const newImgs = p.images.filter((_, i) => i !== idx);
                              return { ...p, images: newImgs, image: newImgs[0] || '' };
                            })}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            &times;
                          </button>
                          {idx > 0 && (
                            <button
                              type="button"
                              title="Set as main thumbnail"
                              onClick={() => setJewelleryForm(p => {
                                const reordered = [p.images[idx], ...p.images.filter((_, i) => i !== idx)];
                                return { ...p, images: reordered, image: reordered[0] };
                              })}
                              className="absolute top-1 left-1 bg-[#4a2511] text-white rounded-full w-5 h-5 flex items-center justify-center text-[8px] shadow opacity-0 group-hover:opacity-100 transition-opacity">
                              ★
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="jewellery_hidden"
                  checked={jewelleryForm.hidden}
                  onChange={e => setJewelleryForm({...jewelleryForm, hidden: e.target.checked})}
                  className="rounded border-[#d4af37] text-[#800020] focus:ring-[#cba135]"
                />
                <label htmlFor="jewellery_hidden" className="text-xs font-bold text-[#4a2511] cursor-pointer selection:bg-transparent">
                  Hide this item from the public website
                </label>
              </div>

              <button type="submit" className="gold-button w-full mt-6 text-sm py-3.5 uppercase tracking-wider font-bold">
                {isEditingJewellery ? 'Save Changes' : 'Publish Jewellery Set'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Jewellery View Details Modal */}
      {isJewelleryViewModalOpen && selectedJewellery && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={() => setIsJewelleryViewModalOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-[#d4af37]/40 w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#4a2511] to-[#800020] px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-serif font-bold text-lg tracking-wide">💎 Jewellery Set Details</h3>
              <button onClick={() => setIsJewelleryViewModalOpen(false)} className="text-white/80 hover:text-white text-2xl transition-colors">×</button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto text-[#4a2511]">
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Category</p>
                  <p className="font-semibold text-sm uppercase text-[#800020]">{selectedJewellery.category || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Jewellery Name</p>
                  <p className="font-bold text-base">{selectedJewellery.name}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Jewellery Number (Unique ID)</p>
                  <p className="font-mono font-bold text-base text-[#800020]">{selectedJewellery.jewelleryNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Status</p>
                  <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border mt-1 ${
                    selectedJewellery.hidden 
                      ? 'bg-gray-100 text-gray-800 border-gray-300' 
                      : 'bg-green-50 text-green-700 border-green-300'
                  }`}>
                    {selectedJewellery.hidden ? 'Hidden' : 'Visible'}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Description</p>
                  <p className="text-sm font-medium whitespace-pre-wrap">{selectedJewellery.description || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">Images ({Array.isArray(selectedJewellery.images) ? selectedJewellery.images.length : (selectedJewellery.image ? 1 : 0)})</p>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selectedJewellery.images) && selectedJewellery.images.length > 0 
                      ? selectedJewellery.images 
                      : (selectedJewellery.image ? [selectedJewellery.image] : ['/hero-saree.png'])
                    ).map((img: string, idx: number) => (
                      <div key={idx} className="relative border border-[#d4af37]/30 rounded overflow-hidden">
                        <img src={img} alt="" className="w-20 h-20 object-cover bg-white" />
                        {idx === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-[#d4af37]/90 text-[8px] text-white font-bold text-center py-0.5">MAIN</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-[#fdf5eb] border-t border-[#d4af37]/20 flex justify-end">
              <button onClick={() => setIsJewelleryViewModalOpen(false)} className="px-6 py-2 bg-gradient-to-r from-[#4a2511] to-[#800020] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-md">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Rental Jewellery Category Add/Edit Modal */}
      {isJewelleryCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[1000] p-4">
          <div className="gold-panel p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsJewelleryCategoryModalOpen(false)} className="absolute top-4 right-4 text-2xl font-bold text-[#4a2511] hover:text-[#800020] transition-colors">&times;</button>
            <h2 className="text-2xl font-bold text-[#4a2511] mb-6 uppercase text-center border-b border-[#d4af37] pb-2 font-serif tracking-wider">
              {isEditingJewelleryCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSaveJewelleryCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Category Name *</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-2.5 border border-[#d4af37] rounded bg-[#fdf5eb] text-sm focus:outline-none focus:ring-1 focus:ring-[#cba135] text-[#4a2511] font-semibold" 
                  value={jewelleryCategoryForm.name} 
                  onChange={e => setJewelleryCategoryForm({...jewelleryCategoryForm, name: e.target.value})} 
                  placeholder="e.g. Necklaces"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1 text-[#4a2511]">Category Image *</label>
                <p className="text-[10px] text-gray-400 mb-2">Upload category banner or representative photo.</p>
                <div {...getJewelleryCategoryProps()} className={`border-2 border-dashed p-6 text-center cursor-pointer rounded bg-[#fdf5eb] transition ${isJewelleryCategoryDrag ? 'border-[#800020] bg-red-50' : 'border-[#d4af37] hover:border-[#800020]'}`}>
                  <input {...getJewelleryCategoryInput()} />
                  <p className="text-[#4a2511] text-xs font-semibold">{isJewelleryCategoryDrag ? 'Drop files here...' : '📷  Drag & drop image, or click to select'}</p>
                  <p className="text-[10px] text-gray-500 mt-1">Supports JPG, PNG, WEBP · Single file only</p>
                </div>
                {jewelleryCategoryForm.image && (
                  <div className="mt-4 flex justify-center">
                    <div className="relative border-2 border-[#d4af37] rounded overflow-hidden">
                      <img src={jewelleryCategoryForm.image} alt="Category preview" className="h-32 w-48 object-cover bg-white" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="category_hidden"
                  checked={jewelleryCategoryForm.hidden}
                  onChange={e => setJewelleryCategoryForm({...jewelleryCategoryForm, hidden: e.target.checked})}
                  className="rounded border-[#d4af37] text-[#800020] focus:ring-[#cba135]"
                />
                <label htmlFor="category_hidden" className="text-xs font-bold text-[#4a2511] cursor-pointer selection:bg-transparent">
                  Hide this category from the public website
                </label>
              </div>

              <button type="submit" className="gold-button w-full mt-6 text-sm py-3.5 uppercase tracking-wider font-bold">
                {isEditingJewelleryCategory ? 'Save Changes' : 'Publish Category'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Jewellery Category View Details Modal */}
      {isJewelleryCategoryViewModalOpen && selectedJewelleryCategory && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={() => setIsJewelleryCategoryViewModalOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-[#d4af37]/40 w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#4a2511] to-[#800020] px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-serif font-bold text-lg tracking-wide">🗂️ Jewellery Category Details</h3>
              <button onClick={() => setIsJewelleryCategoryViewModalOpen(false)} className="text-white/80 hover:text-white text-2xl transition-colors">×</button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto text-[#4a2511]">
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Category Name</p>
                  <p className="font-bold text-base">{selectedJewelleryCategory.name}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Status</p>
                  <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border mt-1 ${
                    selectedJewelleryCategory.hidden 
                      ? 'bg-gray-100 text-gray-800 border-gray-300' 
                      : 'bg-green-50 text-green-700 border-green-300'
                  }`}>
                    {selectedJewelleryCategory.hidden ? 'Hidden' : 'Visible'}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">Category Image</p>
                  <div className="border border-[#d4af37]/35 rounded overflow-hidden flex justify-center max-w-xs mx-auto">
                    <img src={selectedJewelleryCategory.image || '/hero-saree.png'} alt={selectedJewelleryCategory.name} className="w-full h-48 object-cover bg-white" />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-[#fdf5eb] border-t border-[#d4af37]/20 flex justify-end">
              <button onClick={() => setIsJewelleryCategoryViewModalOpen(false)} className="px-6 py-2 bg-gradient-to-r from-[#4a2511] to-[#800020] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-md">Close</button>
            </div>
          </div>
        </div>
      )}

      {ToastElement}
    </div>
  );
}

