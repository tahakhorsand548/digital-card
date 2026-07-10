import React, { useState, useEffect, useRef } from "react";
import {
  Phone, Globe, MapPin, MessageSquare, Clock, Moon, Sun,
  Instagram, Send, Play, Youtube, CheckCircle2, AlertCircle,
  Store, Image as ImageIcon
} from "lucide-react";
import { CardData } from "../types";
import { apiFetch } from "../utils/api";
import baladIcon from './img card/logos/images.png';
import nashanIcon from './img card/logos/images (1).png';
import googlemapIcon from './img card/logos/google map.png';
import instagramLogo from "./img card/logos/instagram.png";
import telegramLogo from "./img card/logos/Telegram.webp";
import whatsappLogo from "./img card/logos/whatsapp.webp";
import rubikaLogo from "./img card/logos/rubika.png";
import soroushLogo from "./img card/logos/Soroush.png";
import baleLogo from "./img card/logos/bale.png";
import youtubeLogo from "./img card/logos/Youtube.png";
import aparatLogo from "./img card/logos/aparat.jpg";
interface CardPreviewProps {
  data: CardData;
  username: string;
  isPreview?: boolean;
}

export default function CardPreview({ data, username, isPreview = false }: CardPreviewProps) {
  const {
    businessName,
    brandManager,
    slogan,
    description,
    logoUrl,
    bgImageUrl,
    phones,
    landlines,
    branches,
    website,
    socials,
    gallery,
    products,
    workingDays,
    design
  } = data;

  const themeHex = design?.colorTheme || "#3B82F6";
  const template = design?.template || "modern";
  
  // State for Dark Mode
  const [localIsDark, setLocalIsDark] = useState(design?.isDark ?? false);

  // Sync with panel if changed from admin
  useEffect(() => {
    setLocalIsDark(design?.isDark ?? false);
  }, [design?.isDark]);

  // A completely isolated mode function that bypasses Tailwind's global "dark:" variants
  // This guarantees the toggle works perfectly even if the parent app has <body class="dark">
  const mode = (lightClass: string, darkClass: string) => {
    return localIsDark ? darkClass : lightClass;
  };

  const galleryRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  // Infinite Scroll Arrays (Duplicated 50 times to create a real infinite feel without jumping)
  const infiniteGallery = gallery && gallery.length > 0 ? Array(50).fill(gallery).flat() : [];
  const infiniteProducts = products && products.length > 0 ? Array(50).fill(products).flat() : [];

  // Smooth Auto-scroll for Gallery
  useEffect(() => {
    let scrollInterval: NodeJS.Timeout;
    if (infiniteGallery.length > 1) {
      scrollInterval = setInterval(() => {
        if (galleryRef.current) {
          galleryRef.current.scrollBy({ left: -250, behavior: 'smooth' });
        }
      }, 3500);
    }
    return () => clearInterval(scrollInterval);
  }, [infiniteGallery.length]);

  // Smooth Auto-scroll for Products
  useEffect(() => {
    let scrollInterval: NodeJS.Timeout;
    if (infiniteProducts.length > 1) {
      scrollInterval = setInterval(() => {
        if (productsRef.current) {
          productsRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
      }, 3000);
    }
    return () => clearInterval(scrollInterval);
  }, [infiniteProducts.length]);

  // Click Tracker for Live Cards
  const handleInteraction = async (type: string, url?: string) => {
    if (isPreview) return;
    try {
      await apiFetch(`/api/card/${username}/click`, { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    if (url) {
      window.open(url, "_blank");
    }
  };

    const formatPrice = (price?: string | number | null) => {
    if (price === undefined || price === null || price === "") return null;
    const digits = String(price).replace(/[^\d]/g, "");
    if (!digits) return null;
    return Number(digits).toLocaleString("en-US");
  };

  const getDayStatus = () => {
    const daysWeek = ["جمعه", "شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه"];
    const todayStr = daysWeek[new Date().getDay()];
    const todaySchedule = workingDays?.[todayStr];

    if (!todaySchedule || !todaySchedule.isOpen || todaySchedule.isClosed) {
      return { 
        text: "تعطیل", 
        fullText: "امروز تعطیل است", 
        bg: mode("bg-red-100 text-red-900", "bg-red-900/40 text-red-100"), 
        dot: "bg-red-500" 
      };
    }
    return { 
      text: "باز", 
      fullText: `باز است (ساعت کاری: ${todaySchedule.openTime} الی ${todaySchedule.closeTime})`, 
      bg: mode("bg-[#86efac] text-green-900", "bg-green-900/40 text-green-100"), 
      dot: mode("bg-green-700", "bg-green-400")
    };
  };

  const dayStatus = getDayStatus();

  // ==========================================
  // ONLY render this advanced UI for "modern" template
  // ==========================================
  if (template === "modern") {
    return (
      <div className="card-preview-scope">
        <div
          className={`max-w-md mx-auto min-h-screen relative overflow-hidden shadow-2xl transition-colors duration-300 font-sans template-modern ${mode("bg-[#fafaff] text-gray-800", "bg-[#0f172a] text-gray-200")}`}
          style={{ direction: "rtl" }}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            .glass-icon { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.4); box-shadow: 0 4px 15px rgba(124, 58, 237, 0.2); }
            .insta-gradient { background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); }
            .carousel-item { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
            .shadow-soft { box-shadow: 0 4px 20px -2px rgba(124, 58, 237, 0.08); }
            .shadow-card { box-shadow: 0 8px 30px -5px rgba(0, 0, 0, 0.05); }
          `}} />

          {/* Header Section */}
          <header className="relative pt-4 pb-6 px-4 shadow-sm min-h-[350px] overflow-hidden">
            {bgImageUrl ? (
              <img src={bgImageUrl} alt="پس‌زمینه" className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity z-0 ${mode("opacity-50", "opacity-30")}`} referrerPolicy="no-referrer" />
            ) : (
              <div className={`absolute inset-0 w-full h-full transition-opacity z-0 ${mode("bg-gray-200 opacity-50", "bg-gray-800 opacity-30")}`}></div>
            )}
            <div className={`absolute inset-0 transition-colors z-0 ${mode("bg-white/30", "bg-black/40")}`}></div>
            <div className={`absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t to-transparent z-0 transition-colors duration-300 ${mode("from-[#fafaff]", "from-[#0f172a]")}`}></div>

            {/* Dark Mode Toggle */}
            <div className="flex justify-end items-center relative z-10">
              <button 
                onClick={() => setLocalIsDark(!localIsDark)}
                className={`w-9 h-9 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:scale-105 transition-transform ${mode("bg-white/70 text-gray-700", "bg-gray-800/70 text-gray-300")}`}
              >
                {localIsDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex flex-col items-center mt-2 relative z-10">
              {/* Logo - Removed Background and Border entirely */}
            <div className="w-24 h-24 mt-4 mb-1 flex items-center justify-center overflow-hidden">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="لوگو"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

              <h1 className={`text-3xl text-center font-extrabold mb-1 drop-shadow-md ${mode("text-gray-900", "text-white")}`}>
                {businessName || "نام کسب و کار شما"}
              </h1>

              {brandManager && (
                <p className={`text-xs mb-4 flex items-center gap-1 font-bold px-3 py-1 rounded-full backdrop-blur-sm shadow-sm transition-colors ${mode("text-gray-700 bg-white/60", "text-gray-200 bg-gray-800/60")}`}>
                  مدیریت: <span style={{ color: themeHex }}>{brandManager}</span>
                </p>
              )}

              <div className="text-center px-3 space-y-2 mt-2 drop-shadow-md">
                {slogan && (
                  <p className="font-extrabold text-[13px]" style={{ color: themeHex }}>"{slogan}"</p>
                )}
                {description && (
                  <p className={`text-xs leading-relaxed font-bold ${mode("text-gray-800", "text-gray-300")}`}>
                    {description}
                  </p>
                )}
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="px-4 py-4 space-y-6 relative z-10">
            
            {/* Contact Info Card */}
            <section className={`rounded-[28px] p-5 shadow-soft border transition-colors ${mode("bg-white border-purple-50/50", "bg-[#1e293b] border-gray-700/50")}`}>
              <div className="flex flex-col space-y-2.5">
                
                {/* Landlines Grouped in ONE box */}
                {landlines && landlines.filter(Boolean).length > 0 && (
                  <div className={`flex justify-between items-center p-2.5 rounded-2xl transition-colors ${mode("bg-gray-50", "bg-gray-800")}`}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl glass-icon flex items-center justify-center text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${themeHex}cc 0%, ${themeHex}e6 100%)` }}>
                        <Phone className="w-[11px]" />
                      </div>
                      <span className={`text-xs font-bold ${mode("text-gray-700", "text-gray-300")}`}>تلفن ثابت</span>
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      {landlines.filter(Boolean).map((l, idx) => (
                        <button
                          key={`landline-${idx}`}
                          onClick={() => handleInteraction("landline", `tel:${l}`)}
                          className={`text-xs font-bold tracking-wider hover:text-blue-600 transition-colors text-right ${mode("text-gray-800", "text-gray-200")}`}
                          dir="ltr"
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Phones Grouped in ONE box */}
                {phones && phones.filter(Boolean).length > 0 && (
                  <div className={`flex justify-between items-center p-2.5 rounded-2xl transition-colors ${mode("bg-gray-50", "bg-gray-800")}`}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl glass-icon flex items-center justify-center text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${themeHex}cc 0%, ${themeHex}e6 100%)` }}>
                        <Phone className="w-[11px]" />
                      </div>
                      <span className={`text-xs font-bold ${mode("text-gray-700", "text-gray-300")}`}>شماره موبایل</span>
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      {phones.filter(Boolean).map((p, idx) => (
                        <button
                          key={`phone-${idx}`}
                          onClick={() => handleInteraction("phone", `tel:${p}`)}
                          className={`text-xs font-bold tracking-wider hover:text-blue-600 transition-colors text-right ${mode("text-gray-800", "text-gray-200")}`}
                          dir="ltr"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {website && (
                <>
                  <hr className={`opacity-60 mt-4 mb-3 transition-colors ${mode("border-gray-100", "border-gray-700")}`} />
                  <button
                    onClick={() => handleInteraction("website", website)}
                    className="w-full text-white rounded-2xl py-3 flex justify-center items-center gap-2 text-[13px] font-bold transition-colors shadow-md hover:brightness-110"
                    style={{ backgroundColor: themeHex }}
                  >
                    <Globe className="w-4 h-4" />
                    بازدید از سایت
                  </button>
                </>
              )}
            </section>

            {/* Branch Section */}
            {branches && branches.length > 0 && (
              <section className={`rounded-[28px] p-5 shadow-soft border flex flex-col items-center transition-colors ${mode("bg-white border-purple-50/50", "bg-[#1e293b] border-gray-700/50")}`}>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4" style={{ color: themeHex }} />
                  <h2 className={`font-bold text-sm ${mode("text-gray-800", "text-white")}`}>آدرس شعب ما</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto hide-scrollbar w-full snap-x pb-2">
                  {branches.map((b, idx) => (
                    <div key={`branch-${idx}`} className={`carousel-item opacity-100 scale-100 snap-center shrink-0 w-[85%] rounded-2xl p-4 border flex flex-col items-center transition-colors ${mode("bg-gray-50 border-gray-100", "bg-gray-800 border-gray-700")}`}>
                      <h3 className="font-bold text-sm mb-2" style={{ color: themeHex }}>{b.title || "شعبه اصلی"}</h3>
                      <p className={`text-[11px] mb-5 text-center leading-relaxed ${mode("text-gray-500", "text-gray-400")}`}>
                        {b.address || "آدرس ثبت نشده است"}
                      </p>
                      <div className="flex justify-center gap-3 w-full">
                        {b.balad && (
                      <button onClick={() => handleInteraction("balad", b.balad)} className="flex flex-1 justify-center">
                          <div className={`w-17 h-17 rounded-xl shadow-card flex flex-col items-center justify-center gap-1 transition-colors overflow-hidden ${mode("bg-white hover:bg-gray-50", "bg-gray-700 hover:bg-gray-600")}`}>
                            <img 
                              src={baladIcon} 
                              alt="بلد" 
                              className="w-10 h-10 object-contain p-1" // سایز رو به 40px محدود کردیم و با p-1 فاصله دادیم
                            />
                            <span className={`text-[10px] font-medium ${mode("text-gray-600", "text-gray-300")}`}>بلد</span>
                          </div>
                      </button>
                        )}
                        {b.neshan && (
                          <button onClick={() => handleInteraction("neshan", b.neshan)} className="flex flex-1 justify-center">
                            <div className={`w-17 h-17 rounded-xl shadow-card flex flex-col items-center justify-center gap-2 transition-colors ${mode("bg-white hover:bg-gray-50", "bg-gray-700 hover:bg-gray-600")}`}>
                            <img 
                              src={nashanIcon} 
                              alt="نشان" 
                              className="w-10 h-10 object-contain p-1" // سایز رو به 40px محدود کردیم و با p-1 فاصله دادیم
                            />
                              <span className={`text-[10px] font-medium ${mode("text-gray-600", "text-gray-300")}`}>نشان</span>
                            </div>
                          </button>
                        )}
                        {b.googleMaps && (
                          <button onClick={() => handleInteraction("googleMaps", b.googleMaps)} className="flex flex-1 justify-center">
                            <div className={`w-17 h-17 rounded-xl shadow-card flex flex-col items-center justify-center gap-2 transition-colors ${mode("bg-white hover:bg-gray-50", "bg-gray-700 hover:bg-gray-600")}`}>
                            <img 
                              src={googlemapIcon} 
                              alt="گوگل مپ" 
                              className="w-10 h-10 object-contain p-1" // سایز رو به 40px محدود کردیم و با p-1 فاصله دادیم
                            />
                              <span className={`text-[10px] font-medium ${mode("text-gray-600", "text-gray-300")}`}>گوگل مپ</span>
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Social Media Section */}
            {socials && Object.keys(socials).length > 0 && (
              <section className={`rounded-[28px] p-5 shadow-soft border flex flex-col items-center transition-colors ${mode("bg-white border-purple-50/50", "bg-[#1e293b] border-gray-700/50")}`}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeHex }}></div>
                  <h2 className={`font-bold text-sm ${mode("text-gray-800", "text-white")}`}>ما را در شبکه‌های اجتماعی دنبال کنید</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto hide-scrollbar w-full px-2 snap-x py-2 justify-center">
                  {Object.entries(socials).map(([key, val]) => {
                    if (!val) return null;
                    let iconComp = <Globe className="w-5 h-5 text-white" />;
                    let title = key;
                    let btnClass = "bg-gray-800 text-white";

                    if (key === "instagram") {
                      iconComp = <img src={instagramLogo} alt="Instagram" className="w-6 h-6 object-contain" />;
                      title = "اینستاگرام";
                      btnClass = "bg-white";
                    }
                    else if (key === "telegram") {
                      iconComp = <img src={telegramLogo} alt="Telegram" className="w-6 h-6 object-contain" />;
                      title = "تلگرام";
                      btnClass = "bg-white";
                    }
                    else if (key === "whatsapp") {
                      iconComp = <img src={whatsappLogo} alt="WhatsApp" className="w-6 h-6 object-contain" />;
                      title = "واتساپ";
                      btnClass = "bg-white";
                    }
                    else if (key === "rubika") {
                      iconComp = <img src={rubikaLogo} alt="Rubika" className="w-6 h-6 object-contain" />;
                      title = "روبیکا";
                      btnClass = "bg-white";
                    }
                    else if (key === "soroush") {
                      iconComp = <img src={soroushLogo} alt="Soroush" className="w-6 h-6 object-contain" />;
                      title = "سروش";
                      btnClass = "bg-white";
                    }
                    else if (key === "bale") {
                      iconComp = <img src={baleLogo} alt="Bale" className="w-6 h-6 object-contain" />;
                      title = "بله";
                      btnClass = "bg-white";
                    }
                    else if (key === "youtube") {
                      iconComp = <img src={youtubeLogo} alt="YouTube" className="w-6 h-6 object-contain" />;
                      title = "یوتیوب";
                      btnClass = "bg-white";
                    }
                    else if (key === "aparat") {
                      iconComp = <img src={aparatLogo} alt="Aparat" className="w-6 h-6 object-contain" />;
                      title = "آپارات";
                      btnClass = "bg-white";
                    }

                    return (
                      <button
                        key={key}
                        onClick={() => handleInteraction(key, val)}
                        className="flex flex-col items-center gap-2 snap-center shrink-0 group"
                      >
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform ${btnClass}`}>
                          {iconComp}
                        </div>
                        <span className={`text-[9px] font-medium ${mode("text-gray-600", "text-gray-300")}`}>{title}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}


            {/* Products Section - Infinite loop */}
              {infiniteProducts.length > 0 && (
                <section className={`rounded-[28px] p-5 shadow-soft border flex flex-col items-center transition-colors ${mode("bg-white border-purple-50/50", "bg-[#1e293b] border-gray-700/50")}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Store className="w-4 h-4" style={{ color: themeHex }} />
                    <h2 className={`font-bold text-sm ${mode("text-gray-800", "text-white")}`}>خدمات و محصولات ما</h2>
                  </div>
                  <p className={`text-[11px] mb-5 ${mode("text-gray-500", "text-gray-400")}`}>جدیدترین و بهترین خدمات منتخب ما</p>

                  <div ref={productsRef} className="flex gap-4 overflow-x-auto hide-scrollbar w-full snap-x pb-4">
                    {infiniteProducts.map((p, idx) => (
                      <button
                        key={`prod-${idx}`}
                        onClick={() => p.link && handleInteraction("product", p.link)}
                        className={`carousel-item opacity-100 scale-100 rounded-2xl shadow-card p-2 flex flex-col items-center snap-center shrink-0 w-44 border transition-colors hover:scale-95 duration-300 text-right ${mode("bg-white border-gray-100", "bg-gray-800 border-gray-700")}`}
                      >
                        <div className={`w-full h-32 rounded-xl overflow-hidden mb-3 relative ${mode("bg-gray-50", "bg-gray-900")}`}>
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">بدون تصویر</div>
                          )}
                        </div>
                        <h3 className={`text-[11px] font-bold mb-1 w-full truncate text-center ${mode("text-gray-800", "text-gray-100")}`}>{p.title}</h3>
                        <p className={`text-[9px] text-center mb-2 line-clamp-2 px-1 w-full ${mode("text-gray-400", "text-gray-500")}`}>{p.description}</p>

                        {/* Price Logic: if empty show nothing, if number show formatted number + تومان */}
                        {formatPrice(p.price) && (
                          <p className="font-bold text-[13px] mt-auto" style={{ color: themeHex }} dir="ltr">
                            {formatPrice(p.price)} تومان
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </section>
              )}

            {/* Image Gallery Section - Infinite loop */}
            {infiniteGallery.length > 0 && (
              <section className={`rounded-[28px] p-5 shadow-soft border flex flex-col items-center transition-colors ${mode("bg-white border-purple-50/50", "bg-[#1e293b] border-gray-700/50")}`}>
                <div className="flex items-center gap-2 mb-1">
                  <ImageIcon className="w-4 h-4" style={{ color: themeHex }} />
                  <h2 className={`font-bold text-sm ${mode("text-gray-800", "text-white")}`}>گالری تصاویر</h2>
                </div>
                <p className={`text-[11px] mb-5 ${mode("text-gray-500", "text-gray-400")}`}>لحظاتی از استایل، کیفیت و رضایت مشتریان ما</p>

                <div ref={galleryRef} className="flex gap-3 overflow-x-auto hide-scrollbar w-full snap-x pb-2">
                  {infiniteGallery.map((imgUrl, idx) => (
                    <div key={`gallery-${idx}`} className="carousel-item opacity-100 scale-100 shrink-0 w-[75%] h-40 rounded-2xl overflow-hidden snap-center shadow-md relative">
                      <img src={imgUrl} className="w-full h-full object-cover" alt={`گالری ${idx + 1}`} referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Working Hours Section */}
            {workingDays && (
              <section className="flex flex-col items-center pt-2">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4" style={{ color: themeHex }} />
                  <h2 className={`font-bold text-sm ${mode("text-gray-800", "text-white")}`}>ساعات کاری</h2>
                </div>

                <div className={`w-full rounded-[28px] p-5 shadow-soft border transition-colors ${mode("bg-white border-purple-50/50", "bg-[#1e293b] border-gray-700/50")}`}>
                  <div className={`flex flex-col space-y-3 text-[13px] font-medium ${mode("text-gray-600", "text-gray-300")}`}>
                    {Object.entries(workingDays).map(([day, val]) => (
                      <div key={day} className={`flex justify-between items-center border-b pb-2 transition-colors last:border-0 last:pb-0 ${mode("border-gray-50", "border-gray-800")}`}>
                        <span className="w-16">{day}</span>
                        <span dir="ltr" className={mode("text-gray-500", "text-gray-400")}>
                          {val.isOpen && !val.isClosed ? `${val.openTime} - ${val.closeTime}` : "تعطیل"}
                        </span>
                        {val.isOpen && !val.isClosed ? (
                          <span className={`px-3 py-0.5 rounded-full text-[10px] ${mode("bg-green-100 text-green-600", "bg-green-900/40 text-green-400")}`}>باز</span>
                        ) : (
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] ${mode("bg-red-100 text-red-500", "bg-red-900/40 text-red-400")}`}>تعطیل</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Bottom Status */}
            <div
              className="w-full rounded-full p-1.5 flex justify-between items-center shadow-md mb-8 mt-4 transition-colors"
              style={{ backgroundColor: themeHex }}
            >
              <div className={`px-4 py-2 rounded-full text-[11px] font-bold flex items-center gap-2 shadow-sm ${dayStatus.bg}`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${dayStatus.dot}`}></div>
                وضعیت: {dayStatus.text}
              </div>
              <span className={`text-xs font-bold pl-4 ${mode("text-white", "text-gray-200")}`}>
                {dayStatus.text === "تعطیل" ? "هم‌اکنون فروشگاه تعطیل است" : "هم‌اکنون فروشگاه باز است"}
              </span>
            </div>

          </main>

          <footer className="mt-12 w-full text-center px-4 pb-4 space-y-2 select-none relative z-10">
            <p className={`text-[10px] md:text-xs leading-relaxed font-medium ${mode("text-gray-400", "text-gray-500")}`}>
              تمامی حق انتشار و استفاده از این کارت برای پلتفرم <span className={`font-bold ${mode("text-gray-500", "text-gray-400")}`}>کارتت</span> می‌باشد.
              هر گونه کپی‌برداری و یا استفاده غیر قانونی پیگرد قانونی دارد.
            </p>
            <p className="text-[11px] font-bold" style={{ color: themeHex }}>
              با کارتت رایگان بسازید
            </p>
          </footer>
        </div>
      </div>
    );
  }
      if (template === "classic") {
    // State for Sheets and Lightbox in Classic Theme
    const [activeSheet, setActiveSheet] = useState<"call" | "map" | null>(null);
    const [selectedBranch, setSelectedBranch] = useState<any>(null);
    const [lightboxContent, setLightboxContent] = useState<string | null>(null);
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    const classicProductsRef = useRef<HTMLDivElement>(null);
    const classicGalleryRef = useRef<HTMLDivElement>(null);
    const classicSocialRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic for Classic
    useEffect(() => {
      let socialInterval = setInterval(() => {
        if (classicSocialRef.current) {
          classicSocialRef.current.scrollBy({ left: -78, behavior: "smooth" });
        }
      }, 5000);
      return () => clearInterval(socialInterval);
    }, []);

    const showToast = (msg: string) => {
      setToastMsg(msg);
      setTimeout(() => setToastMsg(null), 2200);
    };

    const handleShare = async () => {
      const shareData = { title: businessName, text: slogan || '', url: window.location.href };
      if (navigator.share) {
        try { await navigator.share(shareData); } catch (e) {}
      } else {
        try {
          await navigator.clipboard.writeText(shareData.url);
          showToast('لینک صفحه کپی شد');
        } catch (e) {
          showToast('امکان اشتراک‌گذاری وجود ندارد');
        }
      }
    };

    return (
      <div className={`classic-scope app-wrapper ${localIsDark ? "dark-theme" : ""}`}>
        <style dangerouslySetInnerHTML={{
          __html: `
          .classic-scope {
            --theme-main: ${themeHex};
            --theme-light: color-mix(in srgb, var(--theme-main) 70%, white);
            
            --lavender-bg: #F6F3FB;
            --ink: #241C3A;
            --muted: #8B87A0;
            --muted-2: #B3AFC4;
            --green: #16A34A;
            --green-bg: #DCFCE7;
            --red: #EF4444;
            --red-bg: #FEF2F2;
            --card-radius: 22px;
            --shadow-soft: 0 10px 28px -14px rgba(76,29,149,0.28);
            --shadow-card: 0 6px 20px -10px rgba(76,29,149,0.18);
        
            --card-bg: #ffffff;
            --border-dash: #EEE7FA;
            --product-bg: #FBF8FF;
            --product-border: #F0E7FC;
            --gallery-bg: #EFEAF7;
            --gallery-placeholder-bg: #F1EEF6;
            --btn-site-bg: #F3F1F8;
            --bottom-bar-bg: #ffffff;
            --sheet-bg: #ffffff;
            --sheet-option-bg: #FAF8FD;
            --sheet-option-border: #F0E9FA;
            --sheet-handle-bg: #E5E0EF;
            --toast-bg: #241C3A;
            --toast-text: #ffffff;
            --today-bg: color-mix(in srgb, var(--theme-main) 15%, transparent);
          }
        
          .classic-scope.dark-theme {
            --lavender-bg: #120B1E;
            --ink: #F1EDFB;
            --muted: #A79CC4;
            --muted-2: #877AA6;
            --green-bg: #123322;
            --red-bg: #3A1A1E;
            --shadow-soft: 0 10px 28px -14px rgba(0,0,0,0.65);
            --shadow-card: 0 6px 20px -10px rgba(0,0,0,0.55);
        
            --card-bg: #1D1430;
            --border-dash: #2C2144;
            --product-bg: #231a38;
            --product-border: #342753;
            --gallery-bg: #231a38;
            --gallery-placeholder-bg: #241a38;
            --btn-site-bg: #241a38;
            --bottom-bar-bg: #1D1430;
            --sheet-bg: #1D1430;
            --sheet-option-bg: #241a38;
            --sheet-option-border: #342753;
            --sheet-handle-bg: #3a2d57;
            --toast-bg: #F1EDFB;
            --toast-text: #241C3A;
            --today-bg: color-mix(in srgb, var(--theme-main) 22%, transparent);
          }
        
          .classic-scope {
            width: 100%;
            max-width: 430px;
            margin: 0 auto;
            min-height: 100vh;
            background: var(--lavender-bg);
            color: var(--ink);
            position: relative;
            padding-bottom: 104px;
            overflow-x: hidden;
            font-family: 'Vazirmatn', sans-serif;
            direction: rtl;
            transition: background-color .35s ease, color .35s ease;
          }
          .classic-scope * { box-sizing: border-box; }
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `
        }} />

        {/* HEADER */}
        <div className="relative overflow-hidden px-5 pt-5 pb-8 rounded-b-[32px] shadow-[var(--shadow-soft)] transition-colors"
             style={{ background: `linear-gradient(160deg, var(--theme-main) 0%, var(--theme-light) 100%)` }}>
          
          {/* Header Background Image with Opacity overlay */}
          {bgImageUrl && (
            <img src={bgImageUrl} alt="پس‌زمینه" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay pointer-events-none" />
          )}

          <div className="absolute w-[260px] h-[260px] bg-white/10 rounded-full -top-[90px] -left-[60px] pointer-events-none"></div>
          <div className="absolute w-[180px] h-[180px] bg-white/10 rounded-full -bottom-[70px] -right-[40px] pointer-events-none"></div>

          <div className="relative z-10 flex justify-between">
            <button onClick={handleShare} className="w-[38px] h-[38px] rounded-xl bg-white/15 border border-white/30 flex items-center justify-center backdrop-blur-sm hover:bg-white/25 transition">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"></line><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"></line></svg>
            </button>
            <button onClick={() => setLocalIsDark(!localIsDark)} className="w-[38px] h-[38px] rounded-xl bg-white/15 border border-white/30 flex items-center justify-center backdrop-blur-sm hover:bg-white/25 transition">
              {localIsDark ? (
                <Sun className="w-[18px] h-[18px] text-white" />
              ) : (
                <Moon className="w-[18px] h-[18px] text-white" />
              )}
            </button>
          </div>

          <div className="relative z-10 flex flex-col items-center mt-1.5">
            <div className="w-[112px] h-[112px] rounded-full bg-gradient-to-br from-amber-200 to-yellow-400 flex items-center justify-center shadow-[0_8px_20px_-6px_rgba(0,0,0,0.35)] ring-4 ring-white/25 overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="لوگو" className="w-full h-full object-cover" />
              ) : (
                <Store className="w-10 h-10 text-amber-900" />
              )}
            </div>
            
            <div className="text-white text-[22px] font-extrabold mt-3.5 text-center">{businessName || "نام کسب و کار شما"}</div>
            {brandManager && <div className="text-white/85 text-[13.5px] font-medium mt-1 text-center">مدیریت: {brandManager}</div>}

            {(slogan || description) && (
              <div className="mt-4.5 bg-white/15 border border-white/25 rounded-2xl py-3.5 px-4 text-center backdrop-blur-md">
                <span className="text-white/55 text-[20px] font-extrabold block leading-[0.4] mb-2">”</span>
                {slogan && <p className="text-white text-[14.5px] font-semibold leading-[1.8]">{slogan}</p>}
                {description && <div className="mt-2 text-white/80 text-[12.5px] font-normal leading-[1.9]">{description}</div>}
              </div>
            )}
          </div>
        </div>

        {/* CONTACT INFO */}
        <div className="bg-[var(--card-bg)] mx-3.5 mt-3.5 rounded-[var(--card-radius)] p-4 shadow-[var(--shadow-card)] transition-colors">
          <div className="flex items-center gap-2 mb-3.5">
            <div className="w-1 h-4 rounded bg-gradient-to-b from-[var(--theme-main)] to-pink-500"></div>
            <span className="text-[15.5px] font-bold">اطلاعات تماس</span>
          </div>

          {phones && phones.filter(Boolean).length > 0 && (
            <>
              <div className="text-[12px] text-[var(--muted)] font-semibold mb-2">شماره موبایل</div>
              {phones.filter(Boolean).map((p, i) => (
                <div key={i} className="flex items-center gap-2.5 py-2.5 border-b border-dashed border-[var(--border-dash)] last:border-0">
                  <div className="w-[38px] h-[38px] rounded-[11px] bg-[var(--green-bg)] text-[var(--green)] flex items-center justify-center shrink-0">
                    <Phone className="w-[18px] h-[18px]" />
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <div className="text-[14.5px] font-bold" dir="ltr">{p}</div>
                  </div>
                  <button onClick={() => handleInteraction("phone", `tel:${p}`)} className="flex items-center gap-1.5 bg-gradient-to-br from-[var(--theme-main)] to-[var(--theme-light)] text-white font-bold text-[12.5px] border-none rounded-[11px] py-[9px] px-3.5 shadow-md">
                    <Phone className="w-[13px] h-[13px] scale-x-[-1]" /> تماس
                  </button>
                </div>
              ))}
            </>
          )}

          {landlines && landlines.filter(Boolean).length > 0 && (
            <>
              <div className="text-[12px] text-[var(--muted)] font-semibold mt-3.5 mb-2">تلفن ثابت</div>
              {landlines.filter(Boolean).map((l, i) => (
                <div key={i} className="flex items-center gap-2.5 py-2.5 border-b border-dashed border-[var(--border-dash)] last:border-0">
                  <div className="w-[38px] h-[38px] rounded-[11px] bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Phone className="w-[18px] h-[18px]" />
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <div className="text-[14.5px] font-bold" dir="ltr">{l}</div>
                  </div>
                  <button onClick={() => handleInteraction("landline", `tel:${l}`)} className="flex items-center gap-1.5 bg-gradient-to-br from-[var(--theme-main)] to-[var(--theme-light)] text-white font-bold text-[12.5px] border-none rounded-[11px] py-[9px] px-3.5 shadow-md">
                    <Phone className="w-[13px] h-[13px] scale-x-[-1]" /> تماس
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* WEBSITE */}
        {website && (
          <button onClick={() => handleInteraction("website", website)} className="flex w-[calc(100%-28px)] mx-auto mt-3.5 items-center justify-center gap-2 bg-gradient-to-br from-[var(--theme-main)] to-[var(--theme-light)] text-white font-bold text-[14.5px] p-3.5 rounded-2xl shadow-[var(--shadow-soft)]">
            <Globe className="w-[18px] h-[18px]" /> مشاهده وب سایت
          </button>
        )}

        {/* ADDRESSES */}
        {branches && branches.length > 0 && (
          <div className="bg-[var(--card-bg)] mx-3.5 mt-3.5 rounded-[var(--card-radius)] p-4 shadow-[var(--shadow-card)] transition-colors">
            <div className="flex items-center gap-2 mb-3.5">
              <div className="w-1 h-4 rounded bg-gradient-to-b from-[var(--theme-main)] to-pink-500"></div>
              <span className="text-[15.5px] font-bold">آدرس‌ها</span>
            </div>
            {branches.map((b, idx) => (
              <div key={idx} className="flex items-center gap-2.5 py-3 border-b border-dashed border-[var(--border-dash)] last:border-0">
                <div className="w-[38px] h-[38px] rounded-[11px] bg-pink-100 text-pink-500 flex items-center justify-center shrink-0">
                  <MapPin className="w-[19px] h-[19px]" />
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <div className="text-[12px] text-[var(--muted)] font-semibold mb-0.5">{b.title || `شعبه ${idx + 1}`}</div>
                  <div className="text-[13.5px] font-medium leading-[1.6]">{b.address || "ثبت نشده"}</div>
                </div>
                {(b.balad || b.neshan || b.googleMaps) && (
                  <button onClick={() => { setSelectedBranch(b); setActiveSheet('map'); }} className="flex items-center gap-1.5 shrink-0 bg-pink-100 text-pink-500 font-bold text-[12px] rounded-[11px] py-[9px] px-3">
                    <MapPin className="w-[13px] h-[13px]" /> نقشه
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* SOCIAL NETWORKS */}
        {socials && Object.keys(socials).length > 0 && (
          <div className="bg-[var(--card-bg)] mx-3.5 mt-3.5 rounded-[var(--card-radius)] p-4 shadow-[var(--shadow-card)] transition-colors overflow-hidden">
            <div className="flex items-center gap-2 mb-3.5">
              <div className="w-1 h-4 rounded bg-gradient-to-b from-[var(--theme-main)] to-pink-500"></div>
              <span className="text-[15.5px] font-bold">شبکه‌های اجتماعی</span>
            </div>
            <div ref={classicSocialRef} className="overflow-x-auto hide-scrollbar w-full">
              <div className="flex gap-5 w-max pb-1.5 px-1">
                {[...Object.entries(socials), ...Object.entries(socials)].map(([key, val], idx) => {
                  if (!val) return null;
                  let iconComp = <Globe className="w-6 h-6 text-[var(--ink)]" />;
                  let title = key;
                  
                  if (key === "instagram") { iconComp = <img src={instagramLogo} alt="Instagram" className="w-6 h-6 object-contain" />; title = "اینستاگرام"; }
                  else if (key === "telegram") { iconComp = <img src={telegramLogo} alt="Telegram" className="w-6 h-6 object-contain" />; title = "تلگرام"; }
                  else if (key === "whatsapp") { iconComp = <img src={whatsappLogo} alt="WhatsApp" className="w-6 h-6 object-contain" />; title = "واتساپ"; }
                  else if (key === "rubika") { iconComp = <img src={rubikaLogo} alt="Rubika" className="w-6 h-6 object-contain" />; title = "روبیکا"; }
                  else if (key === "soroush") { iconComp = <img src={soroushLogo} alt="Soroush" className="w-6 h-6 object-contain" />; title = "سروش"; }
                  else if (key === "bale") { iconComp = <img src={baleLogo} alt="Bale" className="w-6 h-6 object-contain" />; title = "بله"; }
                  else if (key === "youtube") { iconComp = <img src={youtubeLogo} alt="YouTube" className="w-6 h-6 object-contain" />; title = "یوتیوب"; }
                  else if (key === "aparat") { iconComp = <img src={aparatLogo} alt="Aparat" className="w-6 h-6 object-contain" />; title = "آپارات"; }

                  return (
                    <button key={`${key}-${idx}`} onClick={() => handleInteraction(key, val)} className="flex flex-col items-center gap-1.5 w-[58px]">
                      <div className="w-[52px] h-[52px] rounded-2xl bg-[var(--sheet-option-bg)] border border-[var(--sheet-option-border)] flex items-center justify-center shadow-sm">
                        {iconComp}
                      </div>
                      <span className="text-[11px] font-semibold">{title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {infiniteProducts.length > 0 && (
          <div className="bg-[var(--card-bg)] mx-3.5 mt-3.5 rounded-[var(--card-radius)] p-4 shadow-[var(--shadow-card)] transition-colors">
            <div className="flex items-center gap-2 mb-3.5">
              <div className="w-1 h-4 rounded bg-gradient-to-b from-[var(--theme-main)] to-pink-500"></div>
              <span className="text-[15.5px] font-bold flex-1 text-right">محصولات ما</span>
            </div>
            <div ref={classicProductsRef} className="overflow-x-auto hide-scrollbar -mx-4 px-4 snap-x snap-proximity">
              <div className="flex gap-3 w-max">
                {infiniteProducts.map((p, idx) => (
                  <div key={idx} className="w-[172px] bg-[var(--product-bg)] border border-[var(--product-border)] rounded-[18px] overflow-hidden snap-start shrink-0">
                    <div className="w-full h-[150px] bg-[var(--gallery-placeholder-bg)]">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-xs">بدون تصویر</div>
                      )}
                    </div>
                    <div className="p-2.5 pb-3">
                      <div className="text-[13px] font-bold text-[var(--ink)] mb-1 truncate">{p.title}</div>
                      <div className="text-[11px] text-[var(--muted)] leading-[1.6] line-clamp-2 h-[34px] mb-2">{p.description}</div>
                      <div className="flex items-center justify-between gap-1.5">
                        <button onClick={() => p.link && handleInteraction("product", p.link)} className="bg-gradient-to-br from-[var(--theme-main)] to-[var(--theme-light)] text-white font-bold text-[11px] rounded-[9px] py-[7px] px-3 whitespace-nowrap">
                          مشاهده
                        </button>
                        {formatPrice(p.price) && (
                          <div className="text-[11.5px] font-bold text-[var(--theme-main)] whitespace-nowrap">{formatPrice(p.price)} تومان</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GALLERY */}
        {infiniteGallery.length > 0 && (
          <div className="bg-[var(--card-bg)] mx-3.5 mt-3.5 rounded-[var(--card-radius)] p-4 shadow-[var(--shadow-card)] transition-colors">
            <div className="flex items-center gap-2 mb-3.5">
              <div className="w-1 h-4 rounded bg-gradient-to-b from-[var(--theme-main)] to-pink-500"></div>
              <span className="text-[15.5px] font-bold">گالری تصاویر</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {infiniteGallery.slice(0, 4).map((imgUrl, idx) => (
                <div key={idx} onClick={() => setLightboxContent(imgUrl)} className="relative rounded-2xl overflow-hidden aspect-square cursor-pointer bg-[var(--gallery-bg)]">
                  <img src={imgUrl} className="w-full h-full object-cover" alt="گالری" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WORKING HOURS */}
        {workingDays && (
          <div className="bg-[var(--card-bg)] mx-3.5 mt-3.5 mb-[120px] rounded-[var(--card-radius)] p-4 shadow-[var(--shadow-card)] transition-colors">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded bg-gradient-to-b from-[var(--theme-main)] to-pink-500"></div>
                <span className="text-[15.5px] font-bold">ساعات کاری</span>
              </div>
              <div className={`flex items-center gap-1.5 text-[11.5px] font-bold py-1.5 px-3 rounded-full ${dayStatus.bg}`}>
                <span className={`w-[7px] h-[7px] rounded-full animate-pulse ${dayStatus.dot}`}></span>
                {dayStatus.text === "باز" ? "اکنون باز است" : "اکنون بسته است"}
              </div>
            </div>
            <div className="flex flex-col gap-1 text-[13.5px]">
              {Object.entries(workingDays).map(([day, val]) => {
                const isToday = ["جمعه", "شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه"][new Date().getDay()] === day;
                return (
                  <div key={day} className={`flex justify-between items-center py-2.5 px-2.5 rounded-xl ${isToday ? "bg-[var(--today-bg)] text-[var(--theme-main)]" : ""} ${val.isClosed ? "text-[var(--red)]" : ""}`}>
                    <span className="font-semibold">{day}</span>
                    <span className="font-semibold" dir="ltr">
                      {val.isOpen && !val.isClosed ? `${val.openTime} تا ${val.closeTime}` : "تعطیل"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BOTTOM BAR */}
        <div className="fixed bottom-3.5 left-1/2 -translate-x-1/2 w-[calc(100%-28px)] max-w-[402px] bg-[var(--bottom-bar-bg)] rounded-[20px] p-2 flex gap-2 z-50 shadow-[0_12px_34px_-10px_rgba(76,29,149,0.35)] transition-colors">
          <button onClick={() => setActiveSheet('call')} className="flex-1 flex items-center justify-center gap-[7px] bg-gradient-to-br from-[var(--theme-main)] to-[var(--theme-light)] text-white font-bold text-[14px] py-[13px] rounded-[14px] shadow-md">
            <Phone className="w-[15px] h-[15px] scale-x-[-1]" /> تماس با فروشگاه
          </button>
          {website && (
            <button onClick={() => handleInteraction("website", website)} className="flex-[0.85] flex items-center justify-center gap-[7px] bg-[var(--btn-site-bg)] text-[var(--theme-main)] font-bold text-[14px] py-[13px] rounded-[14px]">
              <Globe className="w-[15px] h-[15px]" /> وب سایت
            </button>
          )}
        </div>

        {/* OVERLAYS (Bottom Sheets) */}
        <div className={`fixed inset-0 bg-[var(--ink)]/50 flex items-end justify-center z-[100] transition-opacity ${activeSheet ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={(e) => { if (e.target === e.currentTarget) setActiveSheet(null); }}>
          <div className={`w-full max-w-[430px] bg-[var(--sheet-bg)] rounded-t-[24px] p-4 pt-2.5 pb-6 transition-transform duration-300 ease-[cubic-bezier(.22,.9,.35,1)] ${activeSheet ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="w10 h-1 rounded-full bg-[var(--sheet-handle-bg)] mx-auto mb-4 w-[40px]"></div>
            
            {activeSheet === 'call' && (
              <>
                <div className="text-[15.5px] font-extrabold text-center mb-4">با کدام شماره تماس بگیرم؟</div>
                {[...(phones || []), ...(landlines || [])].filter(Boolean).map((num, i) => (
                  <a key={i} href={`tel:${num}`} className="flex items-center gap-3 w-full bg-[var(--sheet-option-bg)] border border-[var(--sheet-option-border)] rounded-[14px] p-3.5 mb-2.5 no-underline">
                    <div className="w-[38px] h-[38px] rounded-[11px] bg-[var(--green-bg)] text-[var(--green)] flex items-center justify-center shrink-0">
                      <Phone className="w-[19px] h-[19px]" />
                    </div>
                    <div className="flex-1 text-right">
                      <div className="text-[13.5px] font-bold text-[var(--ink)]">تماس تلفنی</div>
                      <div className="text-[11.5px] text-[var(--muted)] mt-0.5" dir="ltr">{num}</div>
                    </div>
                  </a>
                ))}
              </>
            )}

            {activeSheet === 'map' && selectedBranch && (
              <>
                <div className="text-[15.5px] font-extrabold text-center mb-4">نمایش مسیر با کدام برنامه؟</div>
                {selectedBranch.balad && (
                  <button onClick={() => handleInteraction("balad", selectedBranch.balad)} className="flex items-center gap-3 w-full bg-[var(--sheet-option-bg)] border border-[var(--sheet-option-border)] rounded-[14px] p-3.5 mb-2.5">
                    <div className="w-[38px] h-[38px] rounded-[11px] bg-blue-50 text-blue-500 flex items-center justify-center shrink-0"><img src={baladIcon} alt="بلد" className="w-[20px] h-[20px] object-contain" /></div>
                    <div className="flex-1 text-right"><div className="text-[13.5px] font-bold text-[var(--ink)]">بلد (Balad)</div><div className="text-[11.5px] text-[var(--muted)] mt-0.5 truncate">{selectedBranch.address}</div></div>
                  </button>
                )}
                {selectedBranch.neshan && (
                  <button onClick={() => handleInteraction("neshan", selectedBranch.neshan)} className="flex items-center gap-3 w-full bg-[var(--sheet-option-bg)] border border-[var(--sheet-option-border)] rounded-[14px] p-3.5 mb-2.5">
                    <div className="w-[38px] h-[38px] rounded-[11px] bg-pink-50 text-pink-500 flex items-center justify-center shrink-0"><MapPin className="w-[19px] h-[19px]" /></div>
                    <div className="flex-1 text-right"><div className="text-[13.5px] font-bold text-[var(--ink)]">نشان (Neshan)</div><div className="text-[11.5px] text-[var(--muted)] mt-0.5 truncate">{selectedBranch.address}</div></div>
                  </button>
                )}
                {selectedBranch.googleMaps && (
                  <button onClick={() => handleInteraction("googleMaps", selectedBranch.googleMaps)} className="flex items-center gap-3 w-full bg-[var(--sheet-option-bg)] border border-[var(--sheet-option-border)] rounded-[14px] p-3.5 mb-2.5">
                    <div className="w-[38px] h-[38px] rounded-[11px] bg-green-50 text-green-600 flex items-center justify-center shrink-0"><MapPin className="w-[19px] h-[19px]" /></div>
                    <div className="flex-1 text-right"><div className="text-[13.5px] font-bold text-[var(--ink)]">گوگل مپ (Google Maps)</div><div className="text-[11.5px] text-[var(--muted)] mt-0.5 truncate">{selectedBranch.address}</div></div>
                  </button>
                )}
              </>
            )}
            
            <button onClick={() => setActiveSheet(null)} className="w-full mt-2 py-3 text-center text-[13.5px] font-bold text-[var(--muted)] bg-transparent border-none">انصراف</button>
          </div>
        </div>

        {/* LIGHTBOX */}
        <div className={`fixed inset-0 bg-[#140e20]/90 z-[150] flex items-center justify-center p-5 transition-opacity ${lightboxContent ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={(e) => { if (e.target === e.currentTarget) setLightboxContent(null); }}>
          <button onClick={() => setLightboxContent(null)} className="absolute top-6 left-6 w-[38px] h-[38px] rounded-full bg-white/10 flex items-center justify-center border-none cursor-pointer">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" stroke="#fff" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          {lightboxContent && <img src={lightboxContent} alt="بزرگنمایی" className="max-w-full max-h-[80vh] rounded-2xl object-contain" />}
        </div>

        {/* TOAST */}
        <div className={`fixed bottom-[130px] left-1/2 -translate-x-1/2 bg-[var(--toast-bg)] text-[var(--toast-text)] text-[12.5px] font-semibold py-2.5 px-4 rounded-xl z-[200] whitespace-nowrap transition-all duration-250 ${toastMsg ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2.5'}`}>
          {toastMsg}
        </div>
      </div>
    );
  }
  // ==========================================
  // FALLBACK for classic / minimalist templates
  // ==========================================
  return (
    <div className={`w-full min-h-screen p-8 text-center font-sans ${design?.isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-800"}`} dir="rtl">
      <h2 className="text-xl font-bold mb-4">{businessName}</h2>
      <p className="opacity-70 text-sm mb-4">این نما برای قالب {template} است. لطفاً برای دیدن تغییرات کامل، از پنل کاربری قالب "Modern" را انتخاب کنید.</p>
    </div>
  );
}