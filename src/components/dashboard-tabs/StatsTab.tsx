import React from "react";
import { Copy, ExternalLink } from "lucide-react";
import { CardData, User, AdvertisingBanner } from "../../types";

interface StatsTabProps {
  user: User;
  cardData: CardData;
  banners: AdvertisingBanner[];
  chartData: { label: string; value: number }[];
  maxChartVal: number;
  handleCopyLink: (link: string) => void;
}

export default function StatsTab({
  user,
  cardData,
  banners,
  chartData,
  maxChartVal,
  handleCopyLink,
}: StatsTabProps) {
  return (
        <div className="space-y-8 text-right">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              سلام "{user.fullName}" گرامی
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-1.5">
              به صفحه کنترل پنل و ایجاد کارت ویزیت دیجیتال کارتت خوش آمدید.
            </p>
          </div>

          {/* Quick Online link trigger */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-400 font-bold">
                آدرس آنلاین عمومی کارت ویزیت هوشمند شما :
              </p>
              <span className="text-sm font-semibold text-blue-600 font-mono mt-1 block">
                {`${window.location.origin}/card/${user.username}`}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  handleCopyLink(
                    `${window.location.origin}/card/${user.username}`,
                  )
                }
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" />
                کپی لینک
              </button>
              <a
                href={`/card/${user.username}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/10 text-white text-xs font-bold transition flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                آدرس آنلاین کارت ویزیت
              </a>
            </div>
          </div>

          {/* 4 real statistical tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-bold">
                  کل بازدیدهای کارت :
                </span>
                <span className="text-2xl font-black text-slate-800 font-mono mt-2 block">
                  {cardData.stats?.totalVisits || 15}
                </span>
              </div>
              <div className="mt-3">
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: "80%" }}
                  ></div>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                  روند صعودی بهینه 📈
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-bold">
                  تعداد اسکن بارکد (QR) :
                </span>
                <span className="text-2xl font-black text-slate-850 font-mono mt-2 block">
                  {cardData.stats?.scans || 0}
                </span>
              </div>
              <div className="mt-3">
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: "35%" }}
                  ></div>
                </div>
                <span className="text-[10px] text-blue-600 font-bold mt-1 block">
                  پاسخ کارت فیزیکی NFC
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-bold">
                  تعداد کلیک دکمه ها :
                </span>
                <span className="text-2xl font-black text-slate-800 font-mono mt-2 block">
                  {cardData.stats?.buttonClicks || 0}
                </span>
              </div>
              <div className="mt-3">
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: "60%" }}
                  ></div>
                </div>
                <span className="text-[10px] text-[#5551FF] font-bold mt-1 block">
                  نرخ تبدیل عالی (CTR)
                </span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs text-slate-400 block font-bold">
                  بازدید لینک مستقیم :
                </span>
                <span className="text-2xl font-black text-slate-800 font-mono mt-2 block">
                  {cardData.stats?.linkOpens || 0}
                </span>
              </div>
              <div className="mt-3">
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: "50%" }}
                  ></div>
                </div>
                <span className="text-[10px] text-purple-600 font-bold mt-1 block">
                  ورودی گوگل و پیامک ها
                </span>
              </div>
            </div>
          </div>

          {/* Simulated interactive last 7 days chart - native SVG with CSS transitions */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800">
              نمودار بازدیدهای ۷ روز اخیر کارت شما (تاریخ شمسی)
            </h3>

            <div className="relative w-full h-[220px] flex items-end justify-between pt-6 pr-4">
              {chartData.map((d, idx) => {
                const percent = (d.value / maxChartVal) * 100;
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center group relative z-10"
                  >
                    {/* Bar hover indicator tooltip */}
                    <span className="absolute -top-6 bg-slate-850 text-white font-bold font-mono text-[10px] px-2 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition duration-200">
                      {d.value} بازدید
                    </span>

                    {/* SVG representation or clean bar */}
                    <div
                      className="w-8 bg-gradient-to-t from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 rounded-t-lg transition-all duration-500 relative"
                      style={{ height: `${Math.max(percent, 8)}%` }}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-t-lg transition" />
                    </div>

                    <span className="text-[10px] text-slate-500 font-bold mt-2 truncate w-full text-center">
                      {d.label}
                    </span>
                  </div>
                );
              })}

              {/* Background grid indicators */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                <div className="border-b border-slate-400 w-full h-0" />
                <div className="border-b border-slate-400 w-full h-0" />
                <div className="border-b border-slate-400 w-full h-0" />
                <div className="border-b border-slate-400 w-full h-0" />
              </div>
            </div>
          </div>

          {/* Sub-Banners (Banner 2 & 3) */}
          {banners.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {banners.slice(1, 3).map(
                (b) =>
                  b.imageUrl && (
                    <a
                      href={b.link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={b.id}
                      className="block w-full h-32 md:h-40 bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm relative group cursor-pointer transition hover:opacity-95"
                    >
                      <img
                        src={b.imageUrl}
                        className="w-full h-full object-cover"
                        alt={b.title || "Advertisement"}
                        title={b.title}
                      />
                    </a>
                  ),
              )}
            </div>
          )}
        </div>
  );
}
