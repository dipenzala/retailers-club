"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
export default function Carousel({ media }: { media: string[] }) {
  const [idx, setIdx] = useState(0);
  if (!media || media.length === 0) return <div className="aspect-square bg-[#FAFAF9] flex items-center justify-center text-[13px] text-[#9B9B9B]">No media</div>;
  const isVideo = (url: string) => /\.(mp4|webm|mov)$/i.test(url);
  return (
    <div className="relative aspect-square bg-[#FAFAF9] overflow-hidden group">
      {isVideo(media[idx]) ? <video src={media[idx]} className="w-full h-full object-cover" controls playsInline /> : <img src={media[idx]} alt="" className="w-full h-full object-cover" loading="lazy" />}
      {media.length > 1 && (
        <>
          {idx > 0 && <button onClick={(e) => { e.preventDefault(); setIdx(idx - 1); }} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><ChevronLeft size={18} /></button>}
          {idx < media.length - 1 && <button onClick={(e) => { e.preventDefault(); setIdx(idx + 1); }} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><ChevronRight size={18} /></button>}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {media.map((_, i) => <button key={i} onClick={(e) => { e.preventDefault(); setIdx(i); }} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-white" : "w-1.5 bg-white/60"}`} />)}
          </div>
          <div className="absolute top-3 right-3 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-full">{idx + 1}/{media.length}</div>
        </>
      )}
    </div>
  );
}
