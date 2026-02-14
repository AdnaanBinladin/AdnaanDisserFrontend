"use client"

import { useEffect, useState, useRef } from "react"
import { Megaphone } from "lucide-react"

type Ad = {
  id: string
  company_name: string
  image_url: string
  redirect_url: string
}

export function LoginAdsCarousel() {
  const [ads, setAds] = useState<Ad[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("http://localhost:5050/api/ads/active?placement=login_page")
      .then(res => res.json())
      .then(data => {
        setAds(data.ads || [])
      })
      .catch(err => {
        console.error("Ads fetch failed", err)
      })
  }, [])

  if (!ads.length) return null

  // 🔁 Duplicate for seamless infinite scroll
  const scrollAds = [...ads, ...ads]

  return (
    <div className="fixed bottom-0 left-0 z-30 w-full">
      {/* Top fade edge */}
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

      {/* Glass container */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-emerald-900/70 to-emerald-950/80 backdrop-blur-xl">
        {/* Sponsored label */}
        <div className="flex items-center justify-center gap-1.5 pt-2 pb-1">
          <Megaphone className="h-3 w-3 text-emerald-400/60" />
          <span className="text-[10px] font-medium uppercase tracking-widest text-emerald-400/60">
            Our Partners
          </span>
        </div>

        {/* Scrolling track */}
        <div
          ref={scrollRef}
          className="overflow-hidden px-2 pb-3"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={`flex gap-3 w-max ${
              isPaused ? "[animation-play-state:paused]" : ""
            }`}
            style={{
              animation: `scroll ${ads.length * 5}s linear infinite`,
            }}
          >
            {scrollAds.map((ad, index) => (
              <a
                key={`${ad.id}-${index}`}
                href={ad.redirect_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex-shrink-0 overflow-hidden rounded-lg shadow-lg shadow-black/20 transition-transform duration-300 hover:scale-[1.03]"
                style={{ width: 220, height: 80 }}
              >
                {/* Image */}
                <img
                  src={ad.image_url}
                  alt={ad.company_name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Company name */}
                <div className="absolute bottom-0 left-0 right-0 px-3 pb-2">
                  <p className="truncate text-xs font-semibold text-white drop-shadow-md">
                    {ad.company_name}
                  </p>
                </div>

                {/* Hover glow */}
                <div className="pointer-events-none absolute inset-0 rounded-lg border border-emerald-400/0 transition-colors duration-300 group-hover:border-emerald-400/40" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  )
}
