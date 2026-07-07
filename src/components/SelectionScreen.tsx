import React, { useState } from 'react';
import { Sparkles, Check, ChevronLeft, ArrowRight, Star, Heart, HelpCircle } from 'lucide-react';
import { CapturedPhoto } from '../types';

interface SelectionScreenProps {
  photos: CapturedPhoto[];
  onBack: () => void;
  onComplete: (selectedPhotos: CapturedPhoto[]) => void;
}

export default function SelectionScreen({
  photos,
  onBack,
  onComplete,
}: SelectionScreenProps) {
  // Ordered selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handlePhotoClick = (id: string) => {
    if (selectedIds.includes(id)) {
      // Deselect
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      // Select (max 4)
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      } else {
        // If already 4, replace the first selected, or warn. Let's do a friendly swap or highlight.
        // For children, let's keep it simple: tell them to click one to remove, or let's auto-swap the last one.
        // It's friendliest to tell them to deselect or auto-replace the last one. Let's show a helpful tip!
      }
    }
  };

  const handleNext = () => {
    if (selectedIds.length !== 4) return;
    // Map the selected IDs to actual photos in order of selection
    const chosenPhotos = selectedIds.map((id) => photos.find((p) => p.id === id)!);
    onComplete(chosenPhotos);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[85vh] max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-800 transition cursor-pointer font-bold text-lg"
        >
          <ChevronLeft size={24} />
          다시 찍으러 가기
        </button>
        <div className="text-center">
          <span className="bg-white text-brand-pink border-2 border-brand-border font-extrabold px-5 py-1.5 rounded-full text-lg shadow-[0_4px_0_rgba(255,209,220,0.4)]">
            ✨ 가장 마음에 드는 사진 4장 고르기!
          </span>
        </div>
        <div className="w-24" /> {/* Spacer */}
      </div>

      {/* Guide Banner */}
      <div className="w-full max-w-3xl bg-white border-4 border-brand-border p-5 rounded-[28px] mb-8 text-center relative shadow-md">
        <div className="absolute -top-3 -left-3 text-3xl animate-bounce">💖</div>
        <div className="absolute -bottom-3 -right-3 text-3xl animate-bounce duration-1000">✨</div>
        <p className="text-xl font-bold text-brand-pink flex items-center justify-center gap-1 font-sans">
          다섯 장 중 <span className="underline underline-offset-4 decoration-brand-pink/50">4장</span>을 골라주세요!
        </p>
        <p className="text-sm text-gray-500 mt-1 font-bold">
          선택하는 순서대로 네컷 사진에 예쁘게 놓여요 (1번이 맨 위!)
        </p>
      </div>

      {/* Main Selection Area */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
        {photos.map((photo, index) => {
          const selectionIndex = selectedIds.indexOf(photo.id);
          const isSelected = selectionIndex !== -1;

          return (
            <div
              key={photo.id}
              onClick={() => handlePhotoClick(photo.id)}
              className={`relative cursor-pointer aspect-[3/4] rounded-2xl overflow-hidden shadow-md transition-all duration-300 border-4 hover:scale-102 ${
                isSelected
                  ? 'border-brand-pink ring-4 ring-brand-border/40 scale-102 shadow-lg shadow-brand-border/50'
                  : 'border-white hover:border-brand-border/60'
              }`}
            >
              <img
                src={photo.url}
                alt={`Photo ${index + 1}`}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  isSelected ? 'brightness-105 contrast-102' : 'brightness-90 hover:brightness-100'
                }`}
                referrerPolicy="no-referrer"
              />

              {/* Number/Check badge if selected */}
              {isSelected ? (
                <div className="absolute inset-0 bg-brand-pink/10 flex items-center justify-center">
                  {/* Big Number Circle */}
                  <div className="w-14 h-14 rounded-full bg-brand-pink text-white font-dongle text-5xl font-bold flex items-center justify-center shadow-lg border-3 border-white animate-cute-pulse">
                    {selectionIndex + 1}
                  </div>
                </div>
              ) : (
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 border-2 border-white/60 flex items-center justify-center">
                  <Check size={14} className="text-white/40" />
                </div>
              )}

              {/* Photo order label */}
              <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-[11px] font-bold text-center py-0.5 rounded-md backdrop-blur-xs">
                {index + 1}번째 찍은 사진
              </div>
            </div>
          );
        })}
      </div>

      {/* Warning/Status Info */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((slot) => {
            const hasPhoto = selectedIds[slot - 1];
            return (
              <div
                key={slot}
                className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center shadow-sm transition-all duration-300 ${
                  hasPhoto
                    ? 'border-brand-pink bg-brand-border/20 text-brand-pink font-bold'
                    : 'border-dashed border-gray-300 bg-white text-gray-400'
                }`}
              >
                {hasPhoto ? (
                  <>
                    <span className="font-dongle text-2xl leading-none">{slot}번</span>
                    <Heart size={14} className="fill-brand-pink text-brand-pink -mt-0.5" />
                  </>
                ) : (
                  <>
                    <span className="font-dongle text-2xl leading-none">{slot}번</span>
                    <HelpCircle size={14} className="-mt-0.5" />
                  </>
                )}
              </div>
            );
          })}
        </div>

        {selectedIds.length === 4 ? (
          <button
            onClick={handleNext}
            className="px-8 py-4 bg-brand-pink hover:bg-brand-pink-dark active:scale-95 text-white font-extrabold text-2xl rounded-[24px] flex items-center gap-2 shadow-lg transition-all cursor-pointer border-b-6 border-brand-pink-dark"
          >
            <Sparkles size={24} className="animate-pulse" />
            예쁘게 꾸미러 갈까요? 🎀
            <ArrowRight size={24} />
          </button>
        ) : (
          <div className="px-8 py-4 bg-white border-4 border-brand-border text-gray-500 font-bold text-xl rounded-[24px] shadow-sm">
            {4 - selectedIds.length}장 더 골라주세요!
          </div>
        )}
      </div>
    </div>
  );
}
