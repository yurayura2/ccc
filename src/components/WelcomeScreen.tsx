import React, { useState } from 'react';
import { Camera, Sparkles, Smile, Star, Heart } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: (className: string, memberNames: string) => void;
  initialClassName: string;
  initialMemberNames: string;
}

export default function WelcomeScreen({
  onStart,
  initialClassName,
  initialMemberNames,
}: WelcomeScreenProps) {
  const [className, setClassName] = useState(initialClassName || '햇살반');
  const [memberNames, setMemberNames] = useState(initialMemberNames || '');

  const suggestions = [
    { name: '새싹반 🌱', color: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' },
    { name: '햇살반 ☀️', color: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200' },
    { name: '우주반 🚀', color: 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200' },
    { name: '바다반 🐳', color: 'bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-200' },
    { name: '딸기반 🍓', color: 'bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(className.trim() || '우리반', memberNames.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 text-4xl animate-bounce duration-1000 select-none">🎈</div>
      <div className="absolute top-20 right-12 text-4xl animate-bounce duration-700 select-none">☁️</div>
      <div className="absolute bottom-20 left-16 text-5xl animate-bounce duration-500 select-none">🌈</div>
      <div className="absolute bottom-16 right-16 text-4xl animate-float select-none">🌸</div>

      <div className="w-full max-w-lg bg-white p-8 rounded-[36px] border-[10px] border-brand-border shadow-xl relative z-10">
        {/* Adorable Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3.5 bg-brand-border/30 rounded-full text-brand-pink mb-3 animate-cute-pulse">
            <Camera size={36} className="stroke-[2.5]" />
          </div>
          <h1 className="text-4.5xl font-extrabold tracking-tight flex items-center justify-center gap-2">
            <span className="text-brand-pink">우리반</span>
            <span className="text-brand-dark">네컷</span>
            <span className="text-brand-pink">📸</span>
          </h1>
          <p className="text-lg text-gray-500 mt-2 font-bold">
            친구들과 함께 즐거운 추억을 남겨볼까요?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Class Name Selection */}
          <div className="space-y-2">
            <label className="block text-xl font-bold text-gray-700 flex items-center gap-1.5">
              <Smile size={20} className="text-brand-pink" />
              우리 반 이름을 골라요!
            </label>
            <input
              type="text"
              maxLength={15}
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="예: 햇살반, 기린반"
              className="w-full px-4 py-3 rounded-2xl border-3 border-brand-border/60 focus:border-brand-pink focus:outline-none text-xl font-semibold text-gray-800 transition shadow-inner bg-brand-bg/20"
              required
            />
            
            {/* Quick Suggestions with Clean Minimalism Colors */}
            <div className="flex flex-wrap gap-2 pt-1">
              {suggestions.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setClassName(s.name)}
                  className="px-3.5 py-1.5 rounded-full text-sm font-bold border-2 border-brand-border/60 bg-white text-gray-700 hover:border-brand-pink hover:bg-brand-border/10 transition duration-200 cursor-pointer"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Member Names */}
          <div className="space-y-2">
            <label className="block text-xl font-bold text-gray-700 flex items-center gap-1.5">
              <Heart size={20} className="text-brand-pink" />
              함께 찍는 친구들 이름 (선택)
            </label>
            <input
              type="text"
              maxLength={20}
              value={memberNames}
              onChange={(e) => setMemberNames(e.target.value)}
              placeholder="예: 민수, 예서, 준우"
              className="w-full px-4 py-3 rounded-2xl border-3 border-brand-border/40 focus:border-brand-pink focus:outline-none text-lg font-semibold text-gray-700 transition shadow-inner bg-white"
            />
            <p className="text-xs text-gray-400 pl-1 font-bold">
              이름을 적어주면 사진 아래 예쁘게 나와요!
            </p>
          </div>

          {/* Go Button matching Clean Minimalism physical shadow */}
          <button
            type="submit"
            className="w-full mt-4 py-4 rounded-[28px] bg-brand-pink hover:bg-brand-pink-dark active:scale-95 text-white font-extrabold text-2xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer border-b-6 border-brand-pink-dark"
          >
            <Sparkles className="animate-spin duration-3000" size={24} />
            사진 찍으러 출발! 🚀
          </button>
        </form>

        {/* Footer info decoration */}
        <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-dashed border-brand-border text-xs text-gray-400 font-bold">
          <span className="flex items-center gap-0.5 text-gray-500"><Star size={12} className="text-brand-pink fill-brand-pink" /> 3,2,1 찰칵!</span>
          <span className="flex items-center gap-0.5 text-gray-500"><Star size={12} className="text-brand-pink fill-brand-pink" /> 총 5장 촬영</span>
          <span className="flex items-center gap-0.5 text-gray-500"><Star size={12} className="text-brand-pink fill-brand-pink" /> 4장 선택</span>
        </div>
      </div>
    </div>
  );
}
