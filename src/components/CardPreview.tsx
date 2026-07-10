import React, { useState, useEffect, useRef } from "react";
import {
  Phone, Globe, MapPin, MessageSquare, Clock, Moon, Sun,
  Instagram, Send, Play, Youtube, CheckCircle2, AlertCircle,
  Store, Image as ImageIcon
} from "lucide-react";
import { CardData } from "../types";
import { apiFetch } from "../utils/api";
import baladIcon from './img card/logos/images.png';
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
                          <div className={`w-20 h-20 rounded-xl shadow-card flex flex-col items-center justify-center gap-1 transition-colors overflow-hidden ${mode("bg-white hover:bg-gray-50", "bg-gray-700 hover:bg-gray-600")}`}>
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
                            <div className={`w-20 h-20 rounded-xl shadow-card flex flex-col items-center justify-center gap-2 transition-colors ${mode("bg-white hover:bg-gray-50", "bg-gray-700 hover:bg-gray-600")}`}>
                              <MapPin className="w-6 h-6 text-blue-500" />
                              <span className={`text-[10px] font-medium ${mode("text-gray-600", "text-gray-300")}`}>نشان</span>
                            </div>
                          </button>
                        )}
                        {b.googleMaps && (
                          <button onClick={() => handleInteraction("googleMaps", b.googleMaps)} className="flex flex-1 justify-center">
                            <div className={`w-20 h-20 rounded-xl shadow-card flex flex-col items-center justify-center gap-2 transition-colors ${mode("bg-white hover:bg-gray-50", "bg-gray-700 hover:bg-gray-600")}`}>
                              <MapPin className="w-6 h-6 text-red-500" />
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
    const todayPersian = ["یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"][new Date().getDay()];

    return (
      <div className="card-preview-scope">
        {/* تزریق استایل‌های بومی قالب آریانا استایل به صورت ایزوله */}
        <style dangerouslySetInnerHTML={{ __html: `
          .template-classic {
            --purple-900: #3B0764;
            --purple-800: #4C1D95;
            --purple-700: ${themeHex};
            --purple-600: ${themeHex}dd;
            --purple-500: ${themeHex};
            --purple-400: ${themeHex}aa;
            --purple-100: ${themeHex}1a;
            --pink-500: #D946A6;
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
            --header-grad-1: var(--purple-700);
            --header-grad-2: var(--purple-500);
            --header-grad-3: var(--purple-400);
            --accent-text: var(--purple-700);
            --today-bg: var(--purple-100);
            
            direction: rtl;
            font-family: inherit;
          }

          .template-classic.dark-theme {
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
            --header-grad-1: #2B1250;
            --header-grad-2: #4C1D95;
            --header-grad-3: #6D28D9;
            --accent-text: var(--purple-400);
            --today-bg: rgba(147,51,234,0.22);
          }

          .template-classic .app {
            width: 100%;
            max-width: 430px;
            min-height: 100vh;
            background: var(--lavender-bg);
            position: relative;
            padding-bottom: 104px;
            margin: 0 auto;
            transition: background-color .35s ease;
          }

          .template-classic .header-card {
            position: relative;
            background: linear-gradient(160deg, var(--header-grad-1) 0%, var(--header-grad-2) 55%, var(--header-grad-3) 100%);
            transition: background .35s ease;
            padding: 22px 20px 30px;
            border-radius: 0 0 32px 32px;
            box-shadow: var(--shadow-soft);
            overflow: hidden;
          }

          .template-classic .header-card::before {
            content: ""; position: absolute; width: 260px; height: 260px;
            background: radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 70%);
            top: -90px; left: -60px; border-radius: 50%;
          }

          .template-classic .top-row { display: flex; justify-content: space-between; position: relative; z-index: 2; }
          
          .template-classic .theme-toggle {
            width: 38px; height: 38px; border-radius: 12px;
            background: rgba(255,255,255,0.16); border: 1px solid rgba(255,255,255,0.28);
            display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(4px); transition: .2s;
          }
          .template-classic .theme-toggle:hover { background: rgba(255,255,255,0.26); }

          .template-classic .avatar-wrap { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; margin-top: 6px; }
          .template-classic .avatar-ring {
            width: 112px; height: 112px; border-radius: 50%;
            background: linear-gradient(135deg, #FDE68A 0%, #FACC15 100%);
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 8px 20px -6px rgba(0,0,0,0.35), 0 0 0 4px rgba(255,255,255,0.25);
            overflow: hidden;
          }

          .template-classic .store-name { position: relative; z-index: 2; color: #fff; font-size: 22px; font-weight: 800; margin-top: 14px; text-align: center; }
          .template-classic .store-manager { position: relative; z-index: 2; color: rgba(255,255,255,0.85); font-size: 13.5px; font-weight: 500; margin-top: 4px; text-align: center; }

          .template-classic .quote-box {
            position: relative; z-index: 2; margin-top: 18px;
            background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.22);
            border-radius: 16px; padding: 14px 16px; text-align: center; backdrop-filter: blur(6px);
          }
          .template-classic .quote-mark { color: rgba(255,255,255,0.55); font-size: 20px; font-weight: 800; display: block; line-height: 0.4; margin-bottom: 8px; }
          .template-classic .quote-box p { color: #fff; font-size: 14.5px; font-weight: 600; line-height: 1.8; }
          .template-classic .quote-box .desc { margin-top: 8px; color: rgba(255,255,255,0.82); font-size: 12.5px; font-weight: 400; line-height: 1.9; }

          .template-classic .section { background: var(--card-bg); margin: 14px 14px 0; border-radius: var(--card-radius); padding: 18px 16px; box-shadow: var(--shadow-card); transition: background-color .35s ease; }
          .template-classic .section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
          .template-classic .section-title { display: flex; align-items: center; gap: 8px; font-size: 15.5px; font-weight: 700; color: var(--ink); }
          .template-classic .title-bar { width: 4px; height: 16px; border-radius: 4px; background: linear-gradient(180deg, var(--purple-500), var(--pink-500)); order: 2; }
          .template-classic .section-title span.txt { order: 1; }

          .template-classic .contact-group-label { font-size: 12px; color: var(--muted); font-weight: 600; margin: 14px 0 8px; }
          .template-classic .contact-group-label:first-of-type { margin-top: 0; }
          .template-classic .contact-row { display: flex; align-items: center; gap: 10px; padding: 10px 4px; border-bottom: 1px dashed var(--border-dash); }
          .template-classic .contact-row:last-child { border-bottom: none; }
          .template-classic .contact-icon { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
          .template-classic .contact-icon.mobile { background: #DCFCE7; color: var(--green); }
          .template-classic .contact-icon.tel { background: #DBEAFE; color: #2563EB; }
          .template-classic .contact-info { flex: 1; min-width: 0; }
          .template-classic .contact-number { font-size: 14.5px; font-weight: 700; color: var(--ink); direction: ltr; text-align: right; }
          .template-classic .contact-label { font-size: 11.5px; color: var(--muted); margin-top: 2px; }

          .template-classic .call-btn {
            display: flex; align-items: center; gap: 6px; background: linear-gradient(135deg, var(--purple-600), var(--purple-400));
            color: #fff; font-family: inherit; font-weight: 700; font-size: 12.5px; border: none; border-radius: 11px; padding: 9px 14px; cursor: pointer; white-space: nowrap;
            box-shadow: 0 6px 14px -6px rgba(124,58,237,0.55);
          }

          .template-classic .website-link-btn {
            display: flex; align-items: center; justify-content: center; gap: 8px; margin: 14px 14px 0;
            background: linear-gradient(135deg, var(--purple-700), var(--purple-500)); color: #fff; text-decoration: none; font-weight: 700; font-size: 14.5px; padding: 14px; border-radius: 16px; box-shadow: var(--shadow-soft);
          }

          .template-classic .address-row { display: flex; flex-direction: column; gap: 8px; padding: 12px 4px; border-bottom: 1px dashed var(--border-dash); }
          .template-classic .address-row:last-child { border-bottom: none; }
          .template-classic .address-main-info { display: flex; align-items: center; gap: 10px; width: 100%; }
          .template-classic .address-pin { width: 38px; height: 38px; border-radius: 11px; background: #FCE7F3; color: var(--pink-500); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
          .template-classic .address-text-wrap { flex: 1; min-width: 0; }
          .template-classic .address-branch { font-size: 12px; color: var(--muted); font-weight: 600; margin-bottom: 2px; }
          .template-classic .address-text { font-size: 13.5px; color: var(--ink); font-weight: 500; line-height: 1.6; }
          .template-classic .address-nav-buttons { display: flex; gap: 8px; width: 100%; margin-top: 4px; padding-right: 48px; }

          .template-classic .nav-icon-btn {
            display: flex; align-items: center; gap: 4px; background: var(--sheet-option-bg); border: 1px solid var(--sheet-option-border);
            padding: 6px 12px; border-radius: 10px; cursor: pointer; transition: .2s;
          }
          .template-classic .nav-icon-btn span { font-size: 11px; font-weight: bold; color: var(--ink); }

          .template-classic .social-viewport { overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
          .template-classic .social-viewport::-webkit-scrollbar { display: none; }
          .template-classic .social-track { display: flex; gap: 20px; padding: 2px 2px 6px; justify-content: center; }
          .template-classic .social-item { display: flex; flex-direction: column; align-items: center; gap: 6px; text-decoration: none; width: 58px; background: none; border: none; cursor: pointer; }
          .template-classic .social-icon { width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 14px -8px rgba(0,0,0,0.25); overflow: hidden; background: #fff; }
          .template-classic .social-icon img { width: 32px; height: 32px; object-fit: contain; }
          .template-classic .social-label { font-size: 11px; color: var(--ink); font-weight: 600; white-space: nowrap; }

          .template-classic .products-viewport { overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; margin: 0 -16px; padding: 0 16px; }
          .template-classic .products-viewport::-webkit-scrollbar { display: none; }
          .template-classic .products-track { display: flex; gap: 12px; width: max-content; }
          .template-classic .product-card { width: 172px; background: var(--product-bg); border: 1px solid var(--product-border); border-radius: 18px; overflow: hidden; flex-shrink: 0; transition: all .35s ease; text-align: right; }
          .template-classic .product-image-wrap { width: 100%; height: 150px; background: linear-gradient(160deg,#3d2b52,#7a4fa0); overflow: hidden; position: relative; }
          .template-classic .product-image-wrap img { width: 100%; height: 100%; object-cover: cover; }
          .template-classic .product-body { padding: 10px 12px 12px; }
          .template-classic .product-title { font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
          .template-classic .product-desc { font-size: 11px; color: var(--muted); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 8px; min-height: 34px; }
          .template-classic .product-footer { display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }
          .template-classic .product-price { font-size: 11.5px; font-weight: 700; color: var(--purple-600); white-space: nowrap; }
          .template-classic .product-view-btn { width: 100%; text-align: center; background: linear-gradient(135deg, var(--purple-600), var(--purple-400)); color: #fff; font-family: inherit; font-weight: 700; font-size: 11px; border: none; border-radius: 9px; padding: 7px 12px; cursor: pointer; white-space: nowrap; }

          .template-classic .gallery-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .template-classic .gallery-item { position: relative; border-radius: 16px; overflow: hidden; aspect-ratio: 1/1; background: var(--gallery-bg); }
          .template-classic .gallery-item img { width: 100%; height: 100%; object-fit: cover; display: block; }

          .template-classic .status-badge { display: flex; align-items: center; gap: 6px; background: var(--green-bg); color: var(--green); font-size: 11.5px; font-weight: 700; padding: 6px 12px; border-radius: 20px; }
          .template-classic .status-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); animation: pulseDot 1.6s infinite; }
          .template-classic .status-badge.closed { background: var(--red-bg); color: var(--red); }
          .template-classic .status-badge.closed .status-dot { background: var(--red); animation: pulseDotRed 1.6s infinite; }

          @keyframes pulseDot { 0% { box-shadow: 0 0 0 0 rgba(22,163,74,0.45); } 70% { box-shadow: 0 0 0 7px rgba(22,163,74,0); } 100% { box-shadow: 0 0 0 0 rgba(22,163,74,0); } }
          @keyframes pulseDotRed { 0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.45); } 70% { box-shadow: 0 0 0 7px rgba(239,68,68,0); } 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); } }

          .template-classic .hours-row { display: flex; align-items: center; justify-content: space-between; padding: 11px 10px; border-radius: 12px; font-size: 13.5px; }
          .template-classic .hours-row .day { font-weight: 600; color: var(--ink); }
          .template-classic .hours-row .time { font-weight: 600; color: var(--ink); direction: ltr; }
          .template-classic .hours-row.today { background: var(--today-bg); }
          .template-classic .hours-row.today .day { color: var(--accent-text); }
          .template-classic .hours-row.today .time { color: var(--green); }
          .template-classic .hours-row.closed .time { color: var(--red); font-weight: 700; }

          .template-classic .bottom-status-bar {
            margin: 14px 14px 0; background: var(--card-bg); border-radius: 20px; display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; box-shadow: var(--shadow-card);
          }
          .template-classic .bottom-status-text { font-size: 12px; font-weight: bold; color: var(--ink); }
          
          .template-classic .classic-footer { padding: 24px 16px; text-align: center; }
          .template-classic .classic-footer p { font-size: 11px; color: var(--muted); line-height: 1.8; }
        `}} />

        <div className={`template-classic ${localIsDark ? "dark-theme" : ""}`}>
          <div className="app">
            
            {/* ================= HEADER ================= */}
            <header className="header-card">
              <div className="top-row">
                <div style={{ width: '38px' }}></div> {/* تعادل هدر */}
                <button 
                  className="theme-toggle" 
                  onClick={() => setLocalIsDark(!localIsDark)}
                  aria-label="تغییر تم"
                >
                  {localIsDark ? (
                    <Sun className="w-[18px] h-[18px] text-white" />
                  ) : (
                    <Moon className="w-[18px] h-[18px] text-white" />
                  )}
                </button>
              </div>

              <div className="avatar-wrap">
                <div className="avatar-ring">
                  {logoUrl ? (
                    <img src={logoUrl} alt="لوگو" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <svg viewBox="0 0 100 100" fill="none" className="w-[72px] h-[72px]">
                      <circle cx="50" cy="38" r="20" fill="#3B2A20"/>
                      <path d="M28 40 C28 20 72 20 72 40 L70 34 C60 24 40 24 30 34 Z" fill="#5B3A22"/>
                      <circle cx="50" cy="42" r="16" fill="#F3C9A6"/>
                      <rect x="30" y="58" width="40" height="30" rx="10" fill="#2B6CB0"/>
                      <rect x="36" y="58" width="10" height="14" fill="#E2AE8B"/>
                      <circle cx="41" cy="40" r="3" fill="#2B1810"/>
                      <circle cx="59" cy="40" r="3" fill="#2B1810"/>
                      <path d="M43 48 Q50 52 57 48" stroke="#8A4A2E" stroke-width="2" fill="none" stroke-linecap="round"/>
                    </svg>
                  )}
                </div>
              </div>

              <h1 className="store-name">{businessName || "آریانا استایل"}</h1>
              {brandManager && <div className="store-manager">مدیریت: {brandManager}</div>}

              {(slogan || description) && (
                <div className="quote-box">
                  <span className="quote-mark">”</span>
                  {slogan && <p>{slogan}</p>}
                  {description && <div className="desc">{description}</div>}
                </div>
              )}
            </header>

            {/* ================= CONTACT INFO ================= */}
            <main>
              {((phones && phones.filter(Boolean).length > 0) || (landlines && landlines.filter(Boolean).length > 0)) && (
                <section className="section">
                  <div className="section-head">
                    <div className="section-title">
                      <span class="txt">اطلاعات تماس</span>
                      <span className="title-bar"></span>
                    </div>
                  </div>

                  {phones && phones.filter(Boolean).length > 0 && (
                    <>
                      <div className="contact-group-label">شماره همراه</div>
                      {phones.filter(Boolean).map((p, idx) => (
                        <div key={`phone-${idx}`} className="contact-row">
                          <div className="contact-icon mobile"><Phone className="w-[18px] h-[18px]" /></div>
                          <div className="contact-info">
                            <div className="contact-number">{p}</div>
                            <div className="contact-label">موبایل {idx + 1}</div>
                          </div>
                          <button className="call-btn" onClick={() => handleInteraction("phone", `tel:${p}`)}>تماس</button>
                        </div>
                      ))}
                    </>
                  )}

                  {landlines && landlines.filter(Boolean).length > 0 && (
                    <>
                      <div className="contact-group-label">تلفن ثابت</div>
                      {landlines.filter(Boolean).map((l, idx) => (
                        <div key={`landline-${idx}`} className="contact-row">
                          <div className="contact-icon tel"><Phone className="w-[18px] h-[18px]" /></div>
                          <div className="contact-info">
                            <div className="contact-number">{l}</div>
                            <div className="contact-label">خط ثابت {idx + 1}</div>
                          </div>
                          <button className="call-btn" onClick={() => handleInteraction("landline", `tel:${l}`)}>تماس</button>
                        </div>
                      ))}
                    </>
                  )}
                </section>
              )}

              {/* ================= WEBSITE BUTTON ================= */}
              {website && (
                <button className="website-link-btn w-[calc(100%-28px)]" onClick={() => handleInteraction("website", website)}>
                  <Globe className="w-[18px] h-[18px]" />
                  مشاهده وب سایت
                </button>
              )}

              {/* ================= ADDRESSES ================= */}
              {branches && branches.length > 0 && (
                <section className="section">
                  <div className="section-head">
                    <div className="section-title">
                      <span class="txt">آدرس‌ها</span>
                      <span className="title-bar"></span>
                    </div>
                  </div>

                  {branches.map((b, idx) => (
                    <div key={`branch-${idx}`} className="address-row">
                      <div className="address-main-info">
                        <div className="address-pin"><MapPin className="w-[19px] h-[19px]" /></div>
                        <div className="address-text-wrap">
                          <div className="address-branch">{b.title || `شعبه ${idx + 1}`}</div>
                          <div className="address-text">{b.address || "آدرس ثبت نشده است"}</div>
                        </div>
                      </div>
                      
                      <div className="address-nav-buttons">
                        {b.balad && (
                          <button className="nav-icon-btn" onClick={() => handleInteraction("balad", b.balad)}>
                            <img src={baladIcon} alt="بلد" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                            <span>بلد</span>
                          </button>
                        )}
                        {b.neshan && (
                          <button className="nav-icon-btn" onClick={() => handleInteraction("neshan", b.neshan)}>
                            <MapPin className="w-[14px] h-[14px] text-blue-500" />
                            <span>نشان</span>
                          </button>
                        )}
                        {b.googleMaps && (
                          <button className="nav-icon-btn" onClick={() => handleInteraction("googleMaps", b.googleMaps)}>
                            <MapPin className="w-[14px] h-[14px] text-red-500" />
                            <span>گوگل مپ</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {/* ================= SOCIAL NETWORKS ================= */}
              {socials && Object.keys(socials).length > 0 && (
                <section className="section">
                  <div className="section-head">
                    <div className="section-title">
                      <span class="txt">شبکه‌های اجتماعی</span>
                      <span className="title-bar"></span>
                    </div>
                  </div>
                  <div className="social-viewport">
                    <div className="social-track">
                      {Object.entries(socials).map(([key, val]) => {
                        if (!val) return null;
                        let logoSrc = null;
                        let title = key;

                        if (key === "instagram") { logoSrc = instagramLogo; title = "اینستاگرام"; }
                        else if (key === "telegram") { logoSrc = telegramLogo; title = "تلگرام"; }
                        else if (key === "whatsapp") { logoSrc = whatsappLogo; title = "واتساپ"; }
                        else if (key === "rubika") { logoSrc = rubikaLogo; title = "روبیکا"; }
                        else if (key === "soroush") { logoSrc = soroushLogo; title = "سروش"; }
                        else if (key === "bale") { logoSrc = baleLogo; title = "بله"; }
                        else if (key === "youtube") { logoSrc = youtubeLogo; title = "یوتیوب"; }
                        else if (key === "aparat") { logoSrc = aparatLogo; title = "آپارات"; }

                        return (
                          <button key={key} onClick={() => handleInteraction(key, val)} className="social-item">
                            <div className="social-icon">
                              {logoSrc ? <img src={logoSrc} alt={title} /> : <Globe className="w-6 h-6 text-gray-500" />}
                            </div>
                            <span className="social-label">{title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}

              {/* ================= PRODUCTS ================= */}
              {products && products.length > 0 && (
                <section className="section">
                  <div className="section-head">
                    <div className="section-title">
                      <span class="txt">محصولات ما</span>
                      <span className="title-bar"></span>
                    </div>
                  </div>
                  <div className="products-viewport">
                    <div className="products-track">
                      {products.map((p, idx) => (
                        <div key={`prod-classic-${idx}`} className="product-card">
                          <div className="product-image-wrap">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.title} referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-white/50">بدون تصویر</div>
                            )}
                          </div>
                          <div className="product-body">
                            <div className="product-title">{p.title}</div>
                            <div className="product-desc">{p.description}</div>
                            <div className="product-footer">
                              {formatPrice(p.price) && <div className="product-price">{formatPrice(p.price)} تومان</div>}
                              {p.link && (
                                <button className="product-view-btn" onClick={() => handleInteraction("product", p.link)}>مشاهده</button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* ================= GALLERY ================= */}
              {gallery && gallery.length > 0 && (
                <section className="section">
                  <div className="section-head">
                    <div className="section-title">
                      <span class="txt">گالری تصاویر</span>
                      <span className="title-bar"></span>
                    </div>
                  </div>
                  <div className="gallery-grid">
                    {gallery.map((imgUrl, idx) => (
                      <div key={`gallery-classic-${idx}`} className="gallery-item">
                        <img src={imgUrl} alt={`گالری ${idx + 1}`} referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ================= WORKING HOURS ================= */}
              {workingDays && (
                <section className="section">
                  <div className="section-head">
                    <div className="section-title">
                      <span class="txt">ساعات کاری</span>
                      <span className="title-bar"></span>
                    </div>
                    <div className={`status-badge ${dayStatus.text === "تعطیل" ? "closed" : ""}`}>
                      <div className="status-dot"></div>
                      <span>{dayStatus.text}</span>
                    </div>
                  </div>

                  {Object.entries(workingDays).map(([day, val]) => {
                    const isToday = day === todayPersian;
                    const isClosed = !val.isOpen || val.isClosed;
                    return (
                      <div key={day} className={`hours-row ${isToday ? "today" : ""} ${isClosed ? "closed" : ""}`}>
                        <span className="day">{day}</span>
                        <span className="time">{isClosed ? "تعطیل" : `${val.openTime} - ${val.closeTime}`}</span>
                      </div>
                    );
                  })}
                </section>
              )}

              {/* ================= BOTTOM BAR STATUS ================= */}
              <div className="bottom-status-bar">
                <span className="bottom-status-text">
                  {dayStatus.text === "تعطیل" ? "هم‌اکنون فروشگاه تعطیل است" : `فروشگاه باز است (${dayStatus.fullText})`}
                </span>
                <div className={`status-badge ${dayStatus.text === "تعطیل" ? "closed" : ""}`}>
                  <div className="status-dot"></div>
                  <span>{dayStatus.text}</span>
                </div>
              </div>

            </main>

            {/* ================= FOOTER ================= */}
            <footer className="classic-footer">
              <p>تمامی حق انتشار و استفاده از این کارت برای پلتفرم کارتت می‌باشد.</p>
              <p style={{ color: themeHex, fontWeight: 'bold', marginTop: '4px' }}>با کارتت رایگان بسازید</p>
            </footer>

          </div>
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