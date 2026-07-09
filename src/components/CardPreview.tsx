import React, { useState, useEffect, useRef } from "react";
import {
  Phone, Globe, MapPin, MessageSquare, Clock, ArrowLeft, ArrowRight,
  Instagram, Send, CreditCard, Play, Youtube, CheckCircle2, AlertCircle,
  Store, Image as ImageIcon
} from "lucide-react";
import { CardData } from "../types";
import { apiFetch } from "../utils/api";

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
  const isDark = design?.isDark ?? false;

  // Gallery Sliders State
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [activeProductIdx, setActiveProductIdx] = useState(0);

  const galleryRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  // Auto Scroll Gallery every 3 seconds
  useEffect(() => {
    if (gallery && gallery.length > 1) {
      const interval = setInterval(() => {
        setActiveGalleryIdx((prev) => (prev + 1) % gallery.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [gallery]);

  // Auto Scroll Products every 3 seconds
  useEffect(() => {
    if (products && products.length > 1) {
      const interval = setInterval(() => {
        setActiveProductIdx((prev) => (prev + 1) % products.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [products]);

  // Sync scroll positions with interval state
  useEffect(() => {
    if (galleryRef.current && gallery && gallery.length > 1) {
      const children = galleryRef.current.children;
      if (children[activeGalleryIdx]) {
        children[activeGalleryIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeGalleryIdx, gallery]);

  useEffect(() => {
    if (productsRef.current && products && products.length > 1) {
      const children = productsRef.current.children;
      if (children[activeProductIdx]) {
        children[activeProductIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeProductIdx, products]);

  // Click Tracker for Live Cards
  const handleInteraction = async (type: string, url?: string) => {
    if (isPreview) return; // ignore in edit view
    try {
      await apiFetch(`/api/card/${username}/click`, { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    if (url) {
      window.open(url, "_blank");
    }
  };

  const getDayStatus = () => {
    const daysWeek = ["جمعه", "شنبه", "یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنجشنبه"];
    const todayStr = daysWeek[new Date().getDay()];
    const todaySchedule = workingDays?.[todayStr];

    if (!todaySchedule || !todaySchedule.isOpen || todaySchedule.isClosed) {
      return { text: "امروز تعطیل است", color: "text-red-500" };
    }
    return { text: `باز است (ساعت کاری: ${todaySchedule.openTime} الی ${todaySchedule.closeTime})`, color: "text-emerald-500" };
  };

  const dayStatus = getDayStatus();

  return (
    <div className={isDark ? "dark" : ""}>
      <div
        className={`max-w-md mx-auto min-h-screen relative overflow-hidden shadow-2xl transition-colors duration-300 bg-[#fafaff] dark:bg-[#0f172a] text-gray-800 dark:text-gray-200 font-sans card-preview-scope template-${design?.template || "modern"}`}
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
            <img src={bgImageUrl} alt="پس‌زمینه" className="absolute inset-0 w-full h-full object-cover object-center opacity-50 dark:opacity-30 transition-opacity z-0" referrerPolicy="no-referrer" />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gray-200 dark:bg-gray-800 opacity-50 dark:opacity-30 transition-opacity z-0"></div>
          )}
          <div className="absolute inset-0 bg-white/30 dark:bg-black/40 transition-colors z-0"></div>
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fafaff] dark:from-[#0f172a] to-transparent z-0 transition-colors duration-300"></div>

          <div className="flex flex-col items-center mt-8 relative z-10">
            <div className="w-24 h-24 mt-4 mb-1 flex items-center justify-center overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-md">
              {logoUrl ? (
                <img src={logoUrl} alt="لوگو" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-3xl font-bold text-gray-400">{businessName ? businessName.charAt(0) : "B"}</span>
              )}
            </div>

            <h1 className="text-3xl text-center font-extrabold text-gray-900 dark:text-white mb-1 drop-shadow-md">
              {businessName || "نام کسب و کار شما"}
            </h1>

            {brandManager && (
              <p className="text-xs text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-1 font-bold bg-white/60 dark:bg-gray-800/60 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm transition-colors">
                مدیریت: <span style={{ color: themeHex }}>{brandManager}</span>
              </p>
            )}

            <div className="text-center px-3 space-y-2 mt-2 drop-shadow-md">
              {slogan && (
                <p className="font-extrabold text-[13px]" style={{ color: themeHex }}>"{slogan}"</p>
              )}
              {description && (
                <p className="text-xs text-gray-800 dark:text-gray-300 leading-relaxed font-bold">
                  {description}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="px-4 py-4 space-y-6 relative z-10">
          
          {/* Contact Info Card */}
          <section className="bg-white dark:bg-[#1e293b] rounded-[28px] p-5 shadow-soft border border-purple-50/50 dark:border-gray-700/50 transition-colors">
            <div className="flex flex-col space-y-2.5">
              {landlines?.map((l, idx) => l && (
                <button
                  key={`landline-${idx}`}
                  onClick={() => handleInteraction("landline", `tel:${l}`)}
                  className="flex justify-between items-center w-full bg-gray-50 dark:bg-gray-800 p-2.5 rounded-2xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl glass-icon flex items-center justify-center text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${themeHex}cc 0%, ${themeHex}e6 100%)` }}>
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">تلفن ثابت</span>
                  </div>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wider" dir="ltr">{l}</span>
                </button>
              ))}

              {phones?.map((p, idx) => p && (
                <button
                  key={`phone-${idx}`}
                  onClick={() => handleInteraction("phone", `tel:${p}`)}
                  className="flex justify-between items-center w-full bg-gray-50 dark:bg-gray-800 p-2.5 rounded-2xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl glass-icon flex items-center justify-center text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${themeHex}cc 0%, ${themeHex}e6 100%)` }}>
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">شماره موبایل</span>
                  </div>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wider" dir="ltr">{p}</span>
                </button>
              ))}
            </div>

            {website && (
              <>
                <hr className="border-gray-100 dark:border-gray-700 opacity-60 mt-4 mb-3 transition-colors" />
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
            <section className="bg-white dark:bg-[#1e293b] rounded-[28px] p-5 shadow-soft border border-purple-50/50 dark:border-gray-700/50 flex flex-col items-center transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4" style={{ color: themeHex }} />
                <h2 className="font-bold text-gray-800 dark:text-white text-sm">آدرس شعب ما</h2>
              </div>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar w-full snap-x pb-2">
                {branches.map((b, idx) => (
                  <div key={`branch-${idx}`} className="carousel-item opacity-100 scale-100 snap-center shrink-0 w-[85%] bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 flex flex-col items-center transition-colors">
                    <h3 className="font-bold text-sm mb-2" style={{ color: themeHex }}>{b.title || "شعبه اصلی"}</h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-5 text-center leading-relaxed">
                      {b.address || "آدرس ثبت نشده است"}
                    </p>
                    <div className="flex justify-center gap-3 w-full">
                      {b.balad && (
                        <button onClick={() => handleInteraction("balad", b.balad)} className="flex flex-1 justify-center">
                          <div className="w-20 h-20 rounded-xl bg-white dark:bg-gray-700 shadow-card flex flex-col items-center justify-center gap-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600">
                            <MapPin className="w-6 h-6 text-green-500" />
                            <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">بلد</span>
                          </div>
                        </button>
                      )}
                      {b.neshan && (
                        <button onClick={() => handleInteraction("neshan", b.neshan)} className="flex flex-1 justify-center">
                          <div className="w-20 h-20 rounded-xl bg-white dark:bg-gray-700 shadow-card flex flex-col items-center justify-center gap-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600">
                            <MapPin className="w-6 h-6 text-blue-500" />
                            <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">نشان</span>
                          </div>
                        </button>
                      )}
                      {b.googleMaps && (
                        <button onClick={() => handleInteraction("googleMaps", b.googleMaps)} className="flex flex-1 justify-center">
                          <div className="w-20 h-20 rounded-xl bg-white dark:bg-gray-700 shadow-card flex flex-col items-center justify-center gap-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600">
                            <MapPin className="w-6 h-6 text-red-500" />
                            <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">گوگل مپ</span>
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
            <section className="bg-white dark:bg-[#1e293b] rounded-[28px] p-5 shadow-soft border border-purple-50/50 dark:border-gray-700/50 flex flex-col items-center transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeHex }}></div>
                <h2 className="font-bold text-gray-800 dark:text-white text-sm">ما را در شبکه‌های اجتماعی دنبال کنید</h2>
              </div>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar w-full px-2 snap-x py-2 justify-center">
                {Object.entries(socials).map(([key, val]) => {
                  if (!val) return null;
                  let iconComp = <Globe className="w-5 h-5 text-white" />;
                  let title = key;
                  let btnClass = "bg-gray-800 text-white";

                  if (key === "instagram") { iconComp = <Instagram className="w-5 h-5 text-white" />; title = "اینستاگرام"; btnClass = "insta-gradient"; }
                  else if (key === "telegram") { iconComp = <Send className="w-5 h-5 text-white -rotate-45" />; title = "تلگرام"; btnClass = "bg-[#0088cc]"; }
                  else if (key === "whatsapp") { iconComp = <Phone className="w-5 h-5 text-white" />; title = "واتساپ"; btnClass = "bg-[#25D366]"; }
                  else if (key === "rubika") { iconComp = <CheckCircle2 className="w-5 h-5 text-gray-500 dark:text-gray-300" />; title = "روبیکا"; btnClass = "bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600"; }
                  else if (key === "soroush") { iconComp = <AlertCircle className="w-5 h-5 text-white" />; title = "سروش"; btnClass = "bg-[#03A9F4]"; }
                  else if (key === "bale") { iconComp = <MessageSquare className="w-5 h-5 text-white" />; title = "بله"; btnClass = "bg-[#2E86DE]"; }
                  else if (key === "youtube") { iconComp = <Youtube className="w-5 h-5 text-white" />; title = "یوتیوب"; btnClass = "bg-[#FF0000]"; }
                  else if (key === "aparat") { iconComp = <Play className="w-5 h-5 text-white" />; title = "آپارات"; btnClass = "bg-[#df0f50]"; }

                  return (
                    <button
                      key={key}
                      onClick={() => handleInteraction(key, val)}
                      className="flex flex-col items-center gap-2 snap-center shrink-0 group"
                    >
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform ${btnClass}`}>
                        {iconComp}
                      </div>
                      <span className="text-[9px] font-medium text-gray-600 dark:text-gray-300">{title}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Products Section */}
          {products && products.length > 0 && (
            <section className="bg-white dark:bg-[#1e293b] rounded-[28px] p-5 shadow-soft border border-purple-50/50 dark:border-gray-700/50 flex flex-col items-center transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <Store className="w-4 h-4" style={{ color: themeHex }} />
                <h2 className="font-bold text-gray-800 dark:text-white text-sm">خدمات و محصولات ما</h2>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-5">جدیدترین و بهترین خدمات منتخب ما</p>

              <div ref={productsRef} className="flex gap-4 overflow-x-auto hide-scrollbar w-full snap-x pb-4">
                {products.map((p, idx) => (
                  <button
                    key={`prod-${idx}`}
                    onClick={() => p.link && handleInteraction("product", p.link)}
                    className="carousel-item opacity-100 scale-100 bg-white dark:bg-gray-800 rounded-2xl shadow-card p-2 flex flex-col items-center snap-center shrink-0 w-44 border border-gray-100 dark:border-gray-700 transition-colors hover:scale-95 duration-300 text-right"
                  >
                    <div className="w-full h-32 rounded-xl overflow-hidden mb-3 bg-gray-50 dark:bg-gray-900 relative">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">بدون تصویر</div>
                      )}
                    </div>
                    <h3 className="text-[11px] font-bold text-gray-800 dark:text-gray-100 mb-1 w-full truncate text-center">{p.title}</h3>
                    <p className="text-[9px] text-gray-400 dark:text-gray-500 text-center mb-2 line-clamp-2 px-1 w-full">{p.description}</p>
                    <p className="font-bold text-[13px] mt-auto" style={{ color: themeHex }} dir="ltr">{p.price || "توافقی"}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Image Gallery Section */}
          {gallery && gallery.length > 0 && (
            <section className="bg-white dark:bg-[#1e293b] rounded-[28px] p-5 shadow-soft border border-purple-50/50 dark:border-gray-700/50 flex flex-col items-center transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <ImageIcon className="w-4 h-4" style={{ color: themeHex }} />
                <h2 className="font-bold text-gray-800 dark:text-white text-sm">گالری تصاویر</h2>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-5">لحظاتی از استایل، کیفیت و رضایت مشتریان ما</p>

              <div ref={galleryRef} className="flex gap-3 overflow-x-auto hide-scrollbar w-full snap-x pb-2">
                {gallery.map((imgUrl, idx) => (
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
                <h2 className="font-bold text-gray-800 dark:text-white text-sm">ساعات کاری</h2>
              </div>

              <div className="w-full bg-white dark:bg-[#1e293b] rounded-[28px] p-5 shadow-soft border border-purple-50/50 dark:border-gray-700/50 transition-colors">
                <div className="flex flex-col space-y-3 text-[13px] font-medium text-gray-600 dark:text-gray-300">
                  {Object.entries(workingDays).map(([day, val]) => (
                    <div key={day} className="flex justify-between items-center border-b border-gray-50 dark:border-gray-800 pb-2 transition-colors last:border-0 last:pb-0">
                      <span className="w-16">{day}</span>
                      <span dir="ltr" className="text-gray-500 dark:text-gray-400">
                        {val.isOpen && !val.isClosed ? `${val.openTime} - ${val.closeTime}` : "تعطیل"}
                      </span>
                      {val.isOpen && !val.isClosed ? (
                        <span className="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 px-3 py-0.5 rounded-full text-[10px]">باز</span>
                      ) : (
                        <span className="bg-red-100 dark:bg-red-900/40 text-red-500 dark:text-red-400 px-2.5 py-0.5 rounded-full text-[10px]">تعطیل</span>
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
            <div className={`px-4 py-2 rounded-full text-[11px] font-bold flex items-center gap-2 shadow-sm ${dayStatus.text.includes("تعطیل") ? "bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-100" : "bg-[#86efac] dark:bg-green-900 text-green-900 dark:text-green-100"}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${dayStatus.text.includes("تعطیل") ? "bg-red-500" : "bg-green-700 dark:bg-green-400"}`}></div>
              وضعیت: {dayStatus.text.includes("تعطیل") ? "تعطیل" : "باز"}
            </div>
            <span className="text-white dark:text-gray-200 text-xs font-bold pl-4">
              {dayStatus.text.includes("تعطیل") ? "هم‌اکنون فروشگاه تعطیل است" : "هم‌اکنون فروشگاه باز است"}
            </span>
          </div>

        </main>

        <footer className="mt-12 w-full text-center px-4 pb-4 space-y-2 select-none relative z-10">
          <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 leading-relaxed font-medium">
            تمامی حق انتشار و استفاده از این کارت برای پلتفرم <span className="font-bold text-gray-500 dark:text-gray-400">کارتت</span> می‌باشد.
            هر گونه کپی‌برداری و یا استفاده غیر قانونی پیگرد قانونی دارد.
          </p>
          <p className="text-[11px] font-bold" style={{ color: themeHex }}>
            با کارتت رایگان بسازید
          </p>
        </footer>

        {/* Template-specific Aesthetic Adjustments */}
        {design?.template === "classic" && (
          <style dangerouslySetInnerHTML={{ __html: `
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Playfair+Display:ital,wght@0,600;1,400&display=swap');
            .template-classic {
              font-family: 'Playfair Display', 'Georgia', serif !important;
              background-color: ${isDark ? "#0f111a" : "#faf6f0"} !important;
              color: ${isDark ? "#eae0cc" : "#2d2012"} !important;
            }
            .template-classic h1, .template-classic h2, .template-classic h3, .template-classic h4 {
              font-family: 'Cinzel', 'Playfair Display', serif !important;
              color: ${isDark ? "#dfb841" : "#997316"} !important;
              letter-spacing: 0.04em !important;
              text-transform: uppercase !important;
              font-weight: 850 !important;
            }
          `}} />
        )}
        {design?.template === "minimalist" && (
          <style dangerouslySetInnerHTML={{ __html: `
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap');
            .template-minimalist {
              font-family: 'Space Grotesk', 'Inter', sans-serif !important;
              background-color: ${isDark ? "#080808" : "#fafafa"} !important;
              color: ${isDark ? "#eeeeee" : "#111111"} !important;
              font-weight: 300 !important;
            }
            .template-minimalist h1, .template-minimalist h2, .template-minimalist h3, .template-minimalist h4 {
              font-weight: 600 !important;
              letter-spacing: -0.04em !important;
              color: ${isDark ? "#ffffff" : "#000000"} !important;
              font-family: 'Space Grotesk', sans-serif !important;
            }
          `}} />
        )}
      </div>
    </div>
  );
}