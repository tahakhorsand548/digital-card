import React, { useState, useEffect, useRef } from "react";
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

  // Dark mode state - Initialized from data, but toggleable by user
  const [isDarkMode, setIsDarkMode] = useState(design?.isDark ?? false);

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
      return { text: "تعطیل", color: "text-red-500 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40", status: false };
    }
    return { text: "باز", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/40", status: true };
  };

  const dayStatus = getDayStatus();

  // Intersection Observer for Carousel Snap Effect
  const carouselRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          entry.target.classList.remove('opacity-50', 'scale-90');
          entry.target.classList.add('opacity-100', 'scale-100');
        } else {
          entry.target.classList.add('opacity-50', 'scale-90');
          entry.target.classList.remove('opacity-100', 'scale-100');
        }
      });
    }, { threshold: 0.5 });

    const elements = document.querySelectorAll('.carousel-item');
    elements.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, [gallery, products, branches]);

  return (
    <div className={`${isDarkMode ? 'dark' : ''} font-sans`}>
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .glass-icon {
          background: linear-gradient(135deg, rgba(167, 139, 250, 0.8) 0%, rgba(124, 58, 237, 0.9) 100%);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 4px 15px rgba(124, 58, 237, 0.2);
        }
        .insta-gradient { background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); }
        .carousel-item { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
      `}} />

      {/* Mobile Container */}
      <div className="max-w-md mx-auto bg-[#fafaff] dark:bg-[#0f172a] min-h-screen relative overflow-hidden shadow-2xl transition-colors duration-300 text-gray-800 dark:text-gray-200 antialiased" style={{ direction: "rtl" }}>
        
        {/* Header Section */}
        <header className="relative pt-4 pb-6 px-4 shadow-sm min-h-[350px] overflow-hidden">
          <img 
            src={bgImageUrl || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80"} 
            alt="پس‌زمینه"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-50 dark:opacity-30 transition-opacity z-0"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-white/30 dark:bg-black/40 transition-colors z-0"></div>
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fafaff] dark:from-[#0f172a] to-transparent z-0 transition-colors duration-300"></div>
          
          <div className="flex justify-end items-center relative z-10">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-9 h-9 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm text-gray-700 dark:text-gray-300 hover:scale-105 transition-transform"
            >
              <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-sm`}></i>
            </button>
          </div>
          
          <div className="flex flex-col items-center mt-2 relative z-10">
            <div className="w-24 h-24 mt-4 mb-1 flex items-center justify-center overflow-hidden bg-white/10 backdrop-blur-sm rounded-full shadow-lg border-2 border-white/20">
              {logoUrl ? (
                <img src={logoUrl} alt="لوگو" className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-4xl font-bold text-gray-800 dark:text-white">
                  {businessName ? businessName.charAt(0) : "B"}
                </span>
              )}
            </div>

            <h1 className="text-3xl text-center font-extrabold text-gray-900 dark:text-white mb-1 drop-shadow-md">
              {businessName || "نام کسب و کار"}
            </h1>

            {brandManager && (
              <p className="text-xs text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-1 font-bold bg-white/60 dark:bg-gray-800/60 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm transition-colors">
                مدیریت: <span className="text-violet-700 dark:text-violet-400">{brandManager}</span>
              </p>
            )}

            <div className="text-center px-3 space-y-2 mt-2 drop-shadow-md">
              {slogan && (
                <p className="text-violet-800 dark:text-violet-300 font-extrabold text-[13px]">{slogan}</p>
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
          {(phones?.length || landlines?.length || website) ? (
            <section className="bg-white dark:bg-[#1e293b] rounded-[28px] p-5 shadow-[0_4px_20px_-2px_rgba(124,58,237,0.08)] border border-violet-50/50 dark:border-gray-700/50 transition-colors">
              <div className="flex flex-col space-y-2.5">
                
                {landlines && landlines.length > 0 && (
                  <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-2.5 rounded-2xl transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl glass-icon flex items-center justify-center text-white shadow-sm">
                        <i className="fa-solid fa-phone-flip text-[10px]"></i>
                      </div>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">تلفن ثابت</span>
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      {landlines.map((l, idx) => l && (
                        <button key={idx} onClick={() => handleInteraction("landline", `tel:${l}`)} className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wider hover:text-blue-600 dark:hover:text-blue-400 transition-colors" dir="ltr">
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {phones && phones.length > 0 && (
                  <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-2.5 rounded-2xl transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl glass-icon flex items-center justify-center text-white shadow-sm">
                        <i className="fa-solid fa-mobile-screen-button text-[11px]"></i>
                      </div>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">شماره تلفن</span>
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      {phones.map((p, idx) => p && (
                        <button key={idx} onClick={() => handleInteraction("phone", `tel:${p}`)} className="text-xs font-bold text-gray-800 dark:text-gray-200 tracking-wider hover:text-blue-600 dark:hover:text-blue-400 transition-colors" dir="ltr">
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {website && (
                <>
                  <hr className="border-gray-100 dark:border-gray-700 opacity-60 mt-4 mb-3 transition-colors" />
                  <button onClick={() => handleInteraction("website", website)} className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-2xl py-3 flex justify-center items-center gap-2 text-[13px] font-bold transition-colors shadow-md">
                    <i className="fa-solid fa-globe"></i> بازدید از سایت
                  </button>
                </>
              )}
            </section>
          ) : null}

          {/* Branches Section */}
          {branches && branches.length > 0 && (
            <section className="bg-white dark:bg-[#1e293b] rounded-[28px] p-5 shadow-[0_4px_20px_-2px_rgba(124,58,237,0.08)] border border-violet-50/50 dark:border-gray-700/50 flex flex-col items-center transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-solid fa-location-dot text-sm text-violet-500 dark:text-violet-400"></i>
                <h2 className="font-bold text-gray-800 dark:text-white text-sm">آدرس شعب ما</h2>
              </div>
              
              <div className="flex gap-4 overflow-x-auto hide-scrollbar w-full snap-x pb-2">
                {branches.map((b, idx) => (
                  <div key={idx} className="carousel-item opacity-50 scale-90 snap-center shrink-0 w-[85%] bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 flex flex-col items-center transition-colors">
                    <h3 className="font-bold text-violet-700 dark:text-violet-400 text-sm mb-2">{b.title || "شعبه"}</h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-5 text-center leading-relaxed">{b.address}</p>
                    
                    <div className="flex justify-center gap-3 w-full">
                      {b.balad && (
                        <button onClick={() => handleInteraction("balad", b.balad)} className="flex flex-1 justify-center">
                          <div className="w-16 h-16 rounded-xl bg-white dark:bg-gray-700 shadow-[0_8px_30px_-5px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center gap-1 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600">
                            <span className="text-xl">🗺️</span>
                            <span className="text-[9px] font-medium text-gray-600 dark:text-gray-300">بلد</span>
                          </div>
                        </button>
                      )}
                      {b.neshan && (
                        <button onClick={() => handleInteraction("neshan", b.neshan)} className="flex flex-1 justify-center">
                          <div className="w-16 h-16 rounded-xl bg-white dark:bg-gray-700 shadow-[0_8px_30px_-5px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center gap-1 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600">
                            <span className="text-xl">📍</span>
                            <span className="text-[9px] font-medium text-gray-600 dark:text-gray-300">نشان</span>
                          </div>
                        </button>
                      )}
                      {b.googleMaps && (
                        <button onClick={() => handleInteraction("googleMaps", b.googleMaps)} className="flex flex-1 justify-center">
                          <div className="w-16 h-16 rounded-xl bg-white dark:bg-gray-700 shadow-[0_8px_30px_-5px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center gap-1 transition-colors hover:bg-gray-50 dark:hover:bg-gray-600">
                            <span className="text-xl">G</span>
                            <span className="text-[9px] font-medium text-gray-600 dark:text-gray-300">مپس</span>
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
            <section className="bg-white dark:bg-[#1e293b] rounded-[28px] p-5 shadow-[0_4px_20px_-2px_rgba(124,58,237,0.08)] border border-violet-50/50 dark:border-gray-700/50 flex flex-col items-center transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-violet-500 dark:bg-violet-400"></div>
                <h2 className="font-bold text-gray-800 dark:text-white text-sm">ما را در شبکه‌های اجتماعی دنبال کنید</h2>
              </div>

              <div className="flex gap-4 overflow-x-auto hide-scrollbar w-full px-2 snap-x py-2">
                {Object.entries(socials).map(([key, val]) => {
                  if (!val) return null;
                  
                  let iconClass = "fa-solid fa-globe";
                  let bgClass = "bg-gray-800 text-white";
                  let title = key;

                  if (key === "instagram") { iconClass = "fa-brands fa-instagram"; title = "اینستاگرام"; bgClass = "insta-gradient text-white"; }
                  else if (key === "telegram") { iconClass = "fa-brands fa-telegram"; title = "تلگرام"; bgClass = "bg-[#0088cc] text-white"; }
                  else if (key === "whatsapp") { iconClass = "fa-brands fa-whatsapp"; title = "واتساپ"; bgClass = "bg-[#25D366] text-white"; }
                  else if (key === "youtube") { iconClass = "fa-brands fa-youtube"; title = "یوتیوب"; bgClass = "bg-red-600 text-white"; }

                  return (
                    <button key={key} onClick={() => handleInteraction(key, val)} className="flex flex-col items-center gap-2 snap-center shrink-0">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform ${bgClass}`}>
                        <i className={`${iconClass} text-xl`}></i>
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
            <section className="bg-white dark:bg-[#1e293b] rounded-[28px] p-5 shadow-[0_4px_20px_-2px_rgba(124,58,237,0.08)] border border-violet-50/50 dark:border-gray-700/50 flex flex-col items-center transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <i className="fa-solid fa-store text-violet-500 dark:text-violet-400 text-sm"></i>
                <h2 className="font-bold text-gray-800 dark:text-white text-sm">خدمات و محصولات ما</h2>
              </div>
              
              <div className="flex gap-4 overflow-x-auto hide-scrollbar w-full snap-x pb-4 pt-2">
                {products.map((prod, idx) => (
                  <button key={idx} onClick={() => handleInteraction("product", prod.link)} className="carousel-item opacity-50 scale-90 bg-white dark:bg-gray-800 rounded-2xl shadow-[0_8px_30px_-5px_rgba(0,0,0,0.05)] p-2 flex flex-col items-center snap-center shrink-0 w-44 border border-gray-100 dark:border-gray-700 transition-colors hover:opacity-100 hover:scale-95 duration-300">
                    <div className="w-full h-32 rounded-xl overflow-hidden mb-3 bg-gray-50 dark:bg-gray-900 relative">
                      {prod.imageUrl ? (
                        <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">بدون تصویر</div>
                      )}
                    </div>
                    <h3 className="text-[11px] font-bold text-gray-800 dark:text-gray-100 mb-1">{prod.title}</h3>
                    <p className="text-[9px] text-gray-400 dark:text-gray-500 text-center mb-2 line-clamp-2 px-1">{prod.description}</p>
                    <p className="text-violet-600 dark:text-violet-400 font-bold text-[13px] mt-auto" dir="ltr">
                      {prod.price || "توافقی"}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Image Gallery Section */}
          {gallery && gallery.length > 0 && (
            <section className="bg-white dark:bg-[#1e293b] rounded-[28px] p-5 shadow-[0_4px_20px_-2px_rgba(124,58,237,0.08)] border border-violet-50/50 dark:border-gray-700/50 flex flex-col items-center transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <i className="fa-regular fa-images text-violet-500 dark:text-violet-400 text-sm"></i>
                <h2 className="font-bold text-gray-800 dark:text-white text-sm">گالری تصاویر</h2>
              </div>
              
              <div className="flex gap-3 overflow-x-auto hide-scrollbar w-full snap-x pb-2 pt-2">
                {gallery.map((imgUrl, idx) => (
                  <div key={idx} className="carousel-item opacity-50 scale-90 shrink-0 w-[75%] h-40 rounded-2xl overflow-hidden snap-center shadow-md relative">
                    <img src={imgUrl} className="w-full h-full object-cover" alt={`تصویر ${idx + 1}`} referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Working Hours Section */}
          {workingDays && (
            <section className="flex flex-col items-center pt-2">
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-regular fa-clock text-violet-500 dark:text-violet-400 text-sm"></i>
                <h2 className="font-bold text-gray-800 dark:text-white text-sm">ساعات کاری</h2>
              </div>

              <div className="w-full bg-white dark:bg-[#1e293b] rounded-[28px] p-5 shadow-[0_4px_20px_-2px_rgba(124,58,237,0.08)] border border-violet-50/50 dark:border-gray-700/50 transition-colors">
                <div className="flex flex-col space-y-3 text-[13px] font-medium text-gray-600 dark:text-gray-300">
                  {Object.entries(workingDays).map(([day, val]) => (
                    <div key={day} className="flex justify-between items-center border-b border-gray-50 dark:border-gray-800 pb-2 transition-colors last:border-0">
                      <span className="w-16">{day}</span>
                      {val.isOpen && !val.isClosed ? (
                        <>
                          <span dir="ltr" className="text-gray-500 dark:text-gray-400">{val.openTime} - {val.closeTime}</span>
                          <span className="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 px-3 py-0.5 rounded-full text-[10px]">باز</span>
                        </>
                      ) : (
                        <>
                          <span className="text-gray-500 dark:text-gray-400">تعطیل</span>
                          <span className="bg-red-100 dark:bg-red-900/40 text-red-500 dark:text-red-400 px-2.5 py-0.5 rounded-full text-[10px]">تعطیل</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Bottom Status */}
          <div className="w-full bg-[#5b21b6] dark:bg-[#3b0764] rounded-full p-1.5 flex justify-between items-center shadow-md mb-8 mt-4 transition-colors">
            <div className={`${dayStatus.bg} ${dayStatus.color} px-4 py-2 rounded-full text-[11px] font-bold flex items-center gap-2 shadow-sm`}>
              {dayStatus.status && <div className="w-2 h-2 bg-green-700 dark:bg-green-400 rounded-full animate-pulse"></div>}
              وضعیت: {dayStatus.text}
            </div>
            <span className="text-white dark:text-gray-200 text-xs font-bold pl-4">
              {dayStatus.status ? "هم‌اکنون فروشگاه باز است" : "در حال حاضر تعطیل است"}
            </span>
          </div>
        </main>
        
        <footer className="mt-4 w-full text-center px-4 pb-8 space-y-2 select-none">
          <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 leading-relaxed font-medium">
            تمامی حق انتشار و استفاده از این کارت برای پلتفرم <span className="font-bold text-gray-500 dark:text-gray-400">کارتت</span> می‌باشد.
          </p>
          <p className="text-[11px] font-bold text-violet-600 dark:text-violet-400">
            با کارتت رایگان بسازید
          </p>
        </footer>
      </div>
    </div>
  );
}