import React, { useRef, useState, useEffect } from 'react';
import { Download, Sparkles, Heart, Smile, RotateCcw, Trash2, Plus, Minus, Type, Calendar, ChevronLeft, Star } from 'lucide-react';
import { CapturedPhoto, FRAME_THEMES, FILTERS, FilterType, FrameTheme, Sticker } from '../types';

interface DecorationScreenProps {
  selectedPhotos: CapturedPhoto[];
  className: string;
  memberNames: string;
  onBack: () => void;
  onRestart: () => void;
}

const STICKER_TEMPLATES = [
  // Animals
  '🧸', '🐰', '🦁', '🐱', '🐼', '🦊', '🦖', '🐳', '🐣', '🐵',
  // Decors & Sweets
  '🎈', '🌈', '🍭', '🍰', '🍦', '🌸', '🍀', '🌟', '✨', '💖',
  // Props
  '👑', '🎀', '🕶️', '🎓', '🎉', '🍎', '🍕', '🍟', '🍩', '💬'
];

export default function DecorationScreen({
  selectedPhotos,
  className: initialClassName,
  memberNames: initialMemberNames,
  onBack,
  onRestart,
}: DecorationScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom states
  const [className, setClassName] = useState(initialClassName);
  const [memberNames, setMemberNames] = useState(initialMemberNames);
  const [selectedTheme, setSelectedTheme] = useState<FrameTheme>(FRAME_THEMES[0]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('normal');
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [activeStickerId, setActiveStickerId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Dragging states
  const dragInfo = useRef<{
    stickerId: string;
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
  } | null>(null);

  // Get filter style from ID
  const activeFilterStyle = FILTERS.find((f) => f.id === selectedFilter)?.style || 'none';

  // Format date nicely
  const todayStr = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '.').replace(/\.$/, '');

  // Add a new sticker at the center of the strip
  const handleAddSticker = (emoji: string) => {
    const newSticker: Sticker = {
      id: Math.random().toString(36).substr(2, 9),
      emoji,
      x: 50, // Center X (percentage)
      y: 40 + Math.random() * 20, // Distributed near center Y (percentage)
      size: 40, // Default font size (px)
      rotation: 0,
    };
    setStickers([...stickers, newSticker]);
    setActiveStickerId(newSticker.id);
  };

  // Sticker controls
  const handleScaleSticker = (amount: number) => {
    if (!activeStickerId) return;
    setStickers(
      stickers.map((s) => {
        if (s.id === activeStickerId) {
          const newSize = Math.max(20, Math.min(120, s.size + amount));
          return { ...s, size: newSize };
        }
        return s;
      })
    );
  };

  const handleRotateSticker = (deg: number) => {
    if (!activeStickerId) return;
    setStickers(
      stickers.map((s) => {
        if (s.id === activeStickerId) {
          return { ...s, rotation: (s.rotation + deg) % 360 };
        }
        return s;
      })
    );
  };

  const handleDeleteSticker = () => {
    if (!activeStickerId) return;
    setStickers(stickers.filter((s) => s.id !== activeStickerId));
    setActiveStickerId(null);
  };

  // Handle click on outer area to deselect sticker
  const handleOuterClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setActiveStickerId(null);
    }
  };

  // Drag handlers
  const handleStickerTouchStart = (stickerId: string, e: React.TouchEvent) => {
    e.stopPropagation();
    setActiveStickerId(stickerId);
    const touch = e.touches[0];
    const sticker = stickers.find((s) => s.id === stickerId);
    if (!sticker) return;

    dragInfo.current = {
      stickerId,
      startX: touch.clientX,
      startY: touch.clientY,
      startLeft: sticker.x,
      startTop: sticker.y,
    };
  };

  const handleStickerMouseDown = (stickerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveStickerId(stickerId);
    const sticker = stickers.find((s) => s.id === stickerId);
    if (!sticker) return;

    dragInfo.current = {
      stickerId,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: sticker.x,
      startTop: sticker.y,
    };

    // Attach event listeners for mouse move and up to window
    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
  };

  const handleWindowMouseMove = (e: MouseEvent) => {
    if (!dragInfo.current || !containerRef.current) return;

    const { stickerId, startX, startY, startLeft, startTop } = dragInfo.current;
    const rect = containerRef.current.getBoundingClientRect();

    // Calculate mouse delta
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    // Convert pixels to percentage of the container size
    const deltaXPercent = (deltaX / rect.width) * 100;
    const deltaYPercent = (deltaY / rect.height) * 100;

    // Update sticker position
    setStickers((prev) =>
      prev.map((s) => {
        if (s.id === stickerId) {
          const newX = Math.max(0, Math.min(100, startLeft + deltaXPercent));
          const newY = Math.max(0, Math.min(100, startTop + deltaYPercent));
          return { ...s, x: newX, y: newY };
        }
        return s;
      })
    );
  };

  const handleWindowMouseUp = () => {
    dragInfo.current = null;
    window.removeEventListener('mousemove', handleWindowMouseMove);
    window.removeEventListener('mouseup', handleWindowMouseUp);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragInfo.current || !containerRef.current) return;
    const touch = e.touches[0];
    const { stickerId, startX, startY, startLeft, startTop } = dragInfo.current;
    const rect = containerRef.current.getBoundingClientRect();

    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    const deltaXPercent = (deltaX / rect.width) * 100;
    const deltaYPercent = (deltaY / rect.height) * 100;

    setStickers((prev) =>
      prev.map((s) => {
        if (s.id === stickerId) {
          const newX = Math.max(0, Math.min(100, startLeft + deltaXPercent));
          const newY = Math.max(0, Math.min(100, startTop + deltaYPercent));
          return { ...s, x: newX, y: newY };
        }
        return s;
      })
    );
  };

  const handleTouchEnd = () => {
    dragInfo.current = null;
  };

  // Export full Canvas to Download Image
  const handleDownload = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      // 1. Wait for google fonts to load completely
      await document.fonts.ready;

      // 2. Setup resolution scale (3x high resolution)
      const scale = 3;
      const stripWidth = 400 * scale;
      const stripHeight = 1400 * scale;

      const canvas = document.createElement('canvas');
      canvas.width = stripWidth;
      canvas.height = stripHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not create canvas context');

      // Enable text smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 3. Draw background
      ctx.fillStyle = selectedTheme.bgColor;
      ctx.fillRect(0, 0, stripWidth, stripHeight);

      // Draw subtle stripes or background decorations if applicable
      if (selectedTheme.id === 'purple-space') {
        // Draw tiny random stars on purple background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        for (let i = 0; i < 50; i++) {
          const sx = Math.random() * stripWidth;
          const sy = Math.random() * stripHeight;
          const size = (1 + Math.random() * 3) * scale;
          ctx.beginPath();
          ctx.arc(sx, sy, size, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (selectedTheme.id === 'pink-heart') {
        // Draw small hearts
        ctx.fillStyle = 'rgba(249, 168, 212, 0.1)';
        ctx.font = `${32 * scale}px sans-serif`;
        for (let i = 0; i < 8; i++) {
          const sx = Math.random() * stripWidth;
          const sy = Math.random() * stripHeight;
          ctx.fillText('🌸', sx, sy);
        }
      }

      // 4. Draw Theme Default Emojis at Corners
      ctx.font = `${28 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Top left & right
      ctx.fillText(selectedTheme.emojiDecoration[0], 40 * scale, 35 * scale);
      ctx.fillText(selectedTheme.emojiDecoration[1], stripWidth - 40 * scale, 35 * scale);
      // Bottom left & right
      ctx.fillText(selectedTheme.emojiDecoration[2], 40 * scale, stripHeight - 45 * scale);
      ctx.fillText(selectedTheme.emojiDecoration[3], stripWidth - 40 * scale, stripHeight - 45 * scale);

      // 5. Draw 4 photos
      const canvasSideMargin = 30 * scale;
      const canvasPhotoWidth = 340 * scale;
      const canvasPhotoHeight = 255 * scale;
      const canvasTopMargin = 70 * scale;
      const canvasPhotoGap = 20 * scale;

      // Load all images as HTMLImageElements
      const imagePromises = selectedPhotos.map((photo) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = photo.url;
        });
      });

      const loadedImages = await Promise.all(imagePromises);

      // Draw each photo inside bounding box with filters
      loadedImages.forEach((img, i) => {
        const yPos = canvasTopMargin + i * (canvasPhotoHeight + canvasPhotoGap);

        // Apply visual filter
        ctx.save();
        ctx.filter = activeFilterStyle;

        // Draw image
        ctx.drawImage(img, canvasSideMargin, yPos, canvasPhotoWidth, canvasPhotoHeight);
        ctx.restore();

        // Draw photo frame inner border (subtle)
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.lineWidth = 1 * scale;
        ctx.strokeRect(canvasSideMargin, yPos, canvasPhotoWidth, canvasPhotoHeight);
      });

      // 6. Draw stickers
      for (const sticker of stickers) {
        ctx.save();
        
        // Map percentage to pixels
        const stickerX = (sticker.x / 100) * stripWidth;
        const stickerY = (sticker.y / 100) * stripHeight;

        ctx.translate(stickerX, stickerY);
        ctx.rotate((sticker.rotation * Math.PI) / 180);

        // Draw emoji text
        ctx.font = `${sticker.size * scale}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sticker.emoji, 0, 0);

        ctx.restore();
      }

      // 7. Write bottom text labels
      const bottomAreaStart = canvasTopMargin + 4 * canvasPhotoHeight + 3 * canvasPhotoGap;
      const bottomAreaHeight = stripHeight - bottomAreaStart;
      const bottomCenterY = bottomAreaStart + bottomAreaHeight / 2;

      // Primary class text ("우리반 이름")
      ctx.fillStyle = selectedTheme.textColor;
      // Use Gaegu custom font, fallback to standard serif
      ctx.font = `bold ${52 * scale}px "Gaegu", "Inter", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const mainText = className.trim() || '우리반 네컷';
      ctx.fillText(mainText, stripWidth / 2, bottomAreaStart + 230);

      // Members subtitle text
      if (memberNames.trim()) {
        ctx.font = `${26 * scale}px "Gaegu", "Inter", sans-serif`;
        ctx.fillStyle = `${selectedTheme.textColor}dd`; // slightly lighter
        const names = memberNames.trim().replace(/, /g, ' • ').replace(/,/g, ' • ');
        ctx.fillText(names, stripWidth / 2, bottomAreaStart + 430);
      }

      // Date stamp
      ctx.font = `${20 * scale}px "JetBrains Mono", sans-serif`;
      ctx.fillStyle = `${selectedTheme.textColor}88`; // translucent
      ctx.fillText(todayStr, stripWidth / 2, bottomAreaStart + 580);

      // 8. Output as file download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${className.replace(/\s+/g, '_')}_우정네컷_${todayStr}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error('Failed to export image:', err);
      alert('사진 저장에 실패했어요. 다시 시도해 주세요!');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch justify-center min-h-[85vh] max-w-6xl mx-auto px-4 py-6 gap-8">
      
      {/* LEFT COLUMN: INTERACTIVE PREVIEW PANEL */}
      <div 
        className="flex-1 flex flex-col items-center justify-start py-4 select-none"
        onClick={handleOuterClick}
      >
        <div className="text-center mb-4">
          <p className="text-xs bg-brand-border/40 text-brand-pink font-bold px-4 py-1.5 rounded-full inline-flex items-center gap-1">
            <Sparkles size={12} className="animate-spin duration-3000" />
            스티커를 직접 밀어서 예쁘게 배치하세요!
          </p>
        </div>

        {/* Dynamic Vertical Four-Cut Strip Strip */}
        <div
          ref={containerRef}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-64 sm:w-80 shadow-2xl rounded-2xl border-4 transition-all duration-300 overflow-hidden cursor-crosshair shrink-0 border-white"
          style={{
            backgroundColor: selectedTheme.bgColor,
            borderColor: selectedTheme.borderColor,
            aspectRatio: '4 / 14', // Exact proportion matching the canvas math
          }}
        >
          {/* Default theme background patterns or style touchups */}
          {selectedTheme.id === 'purple-space' && (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent pointer-events-none" />
          )}

          {/* Corner emojis rendering */}
          <div className="absolute top-2 left-2 text-xl font-bold">{selectedTheme.emojiDecoration[0]}</div>
          <div className="absolute top-2 right-2 text-xl font-bold">{selectedTheme.emojiDecoration[1]}</div>
          <div className="absolute bottom-3 left-2 text-xl font-bold">{selectedTheme.emojiDecoration[2]}</div>
          <div className="absolute bottom-3 right-2 text-xl font-bold">{selectedTheme.emojiDecoration[3]}</div>

          {/* Stacking 4 photos vertically */}
          <div className="absolute inset-x-0 top-0 bottom-[18%] flex flex-col justify-start items-center pt-6 gap-3.5 px-6 pointer-events-none">
            {selectedPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className="w-full aspect-[4/3] bg-slate-100 border border-black/5 overflow-hidden shadow-xs shrink-0"
              >
                <img
                  src={photo.url}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover select-none"
                  style={{ filter: activeFilterStyle }}
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>

          {/* Stickers overlay */}
          {stickers.map((sticker) => {
            const isActive = sticker.id === activeStickerId;
            return (
              <div
                key={sticker.id}
                onTouchStart={(e) => handleStickerTouchStart(sticker.id, e)}
                onMouseDown={(e) => handleStickerMouseDown(sticker.id, e)}
                className={`absolute cursor-grab active:cursor-grabbing select-none transition-shadow ${
                  isActive ? 'ring-3 ring-brand-pink ring-offset-2 rounded-lg bg-brand-pink/10' : ''
                }`}
                style={{
                  left: `${sticker.x}%`,
                  top: `${sticker.y}%`,
                  transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
                  fontSize: `${sticker.size}px`,
                  lineHeight: 1,
                  zIndex: isActive ? 40 : 20,
                }}
              >
                {sticker.emoji}
              </div>
            );
          })}

          {/* Bottom Branding Area */}
          <div className="absolute inset-x-0 bottom-0 h-[18%] flex flex-col items-center justify-center pointer-events-none px-4">
            <h3
              className="font-bold tracking-wide text-center leading-tight truncate w-full"
              style={{
                color: selectedTheme.textColor,
                fontSize: 'calc(1.5rem + 0.5vw)',
                fontFamily: '"Gaegu", sans-serif',
              }}
            >
              {className.trim() || '우리반 네컷'}
            </h3>
            
            {memberNames.trim() && (
              <p
                className="text-xs text-center mt-1 truncate w-full"
                style={{
                  color: `${selectedTheme.textColor}cc`,
                  fontFamily: '"Gaegu", sans-serif',
                }}
              >
                {memberNames.trim().replace(/, /g, ' • ').replace(/,/g, ' • ')}
              </p>
            )}

            <p
              className="text-[9px] font-mono tracking-wider text-center mt-1.5 opacity-60 font-bold"
              style={{ color: selectedTheme.textColor }}
            >
              {todayStr}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: CONTROLS & DECORATING TOOLBAR */}
      <div className="w-full lg:w-[420px] bg-white p-6 rounded-[32px] border-4 border-brand-border shadow-lg flex flex-col justify-between gap-6 overflow-y-auto">
        <div className="space-y-6">
          
          {/* SECTION 1: FRAME COLORS */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-2.5 flex items-center gap-1.5">
              <span className="text-brand-pink">🎨</span> 프레임 고르기
            </h4>
            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {FRAME_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`py-2.5 px-3 rounded-xl font-bold text-sm border-2 flex items-center gap-2 transition cursor-pointer text-left ${
                    selectedTheme.id === theme.id
                      ? 'border-brand-pink bg-brand-bg/30 text-gray-900 shadow-xs ring-2 ring-brand-border'
                      : 'border-gray-100 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-black/10 shrink-0 shadow-inner"
                    style={{ backgroundColor: theme.bgColor }}
                  />
                  <span className="truncate font-semibold">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 2: PHOTO FILTERS */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-2.5 flex items-center gap-1.5">
              <span className="text-brand-pink">✨</span> 사진 필터
            </h4>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar">
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`py-2 px-4 rounded-xl font-bold text-xs shrink-0 border-2 transition cursor-pointer ${
                    selectedFilter === filter.id
                      ? 'bg-brand-pink text-white border-brand-pink-dark shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 3: ADD CUTE STICKERS */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-brand-pink">🧸</span> 귀여운 스티커 붙이기
              </div>
              <span className="text-xs text-gray-400 font-bold">스티커 탭하기!</span>
            </h4>
            <div className="flex flex-wrap gap-2.5 p-3 bg-brand-bg/20 border border-brand-border rounded-2xl max-h-[140px] overflow-y-auto">
              {STICKER_TEMPLATES.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleAddSticker(emoji)}
                  className="text-2xl hover:scale-120 active:scale-95 transition cursor-pointer w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg shadow-xs hover:shadow-brand-border"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 4: STICKER CONTROLS (Only visible when a sticker is active) */}
          {activeStickerId && (
            <div className="p-3.5 bg-brand-bg/40 border-2 border-brand-border rounded-2xl animate-fade-in space-y-2.5">
              <p className="text-xs font-bold text-brand-pink flex items-center gap-1">
                <Smile size={14} /> 선택한 스티커 꾸미기: {stickers.find((s) => s.id === activeStickerId)?.emoji}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleScaleSticker(6)}
                  className="flex-1 py-1.5 bg-white border border-brand-border hover:bg-brand-bg/40 text-gray-800 rounded-xl font-bold text-xs flex items-center justify-center gap-0.5 cursor-pointer"
                >
                  <Plus size={14} /> 더 크게
                </button>
                <button
                  onClick={() => handleScaleSticker(-6)}
                  className="flex-1 py-1.5 bg-white border border-brand-border hover:bg-brand-bg/40 text-gray-800 rounded-xl font-bold text-xs flex items-center justify-center gap-0.5 cursor-pointer"
                >
                  <Minus size={14} /> 더 작게
                </button>
                <button
                  onClick={() => handleRotateSticker(30)}
                  className="flex-1 py-1.5 bg-white border border-brand-border hover:bg-brand-bg/40 text-gray-800 rounded-xl font-bold text-xs flex items-center justify-center gap-0.5 cursor-pointer"
                >
                  <RotateCcw size={14} /> 돌리기
                </button>
                <button
                  onClick={handleDeleteSticker}
                  className="py-1.5 px-3 bg-red-100 border border-red-200 hover:bg-red-200 text-red-700 rounded-xl font-bold text-xs flex items-center justify-center gap-0.5 cursor-pointer"
                >
                  <Trash2 size={14} /> 삭제
                </button>
              </div>
            </div>
          )}

          {/* SECTION 5: CUSTOM LABELS */}
          <div className="border-t pt-4 border-dashed border-brand-border space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <Type size={12} /> 우리반 이름 바꾸기
              </label>
              <input
                type="text"
                maxLength={15}
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border-2 border-brand-border/60 focus:outline-none focus:border-brand-pink text-sm font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <Heart size={12} /> 찍은 친구들 이름 바꾸기
              </label>
              <input
                type="text"
                maxLength={20}
                value={memberNames}
                onChange={(e) => setMemberNames(e.target.value)}
                placeholder="예: 예서, 민수, 준우"
                className="w-full px-3 py-1.5 rounded-xl border-2 border-brand-border/60 focus:outline-none focus:border-brand-pink text-sm font-semibold"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="space-y-3 pt-4 border-t border-brand-border/60">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full py-4 bg-brand-pink hover:bg-brand-pink-dark active:scale-95 text-white font-extrabold text-xl rounded-[24px] flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer border-b-6 border-brand-pink-dark disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                <span>예쁘게 그리는 중... 🎨</span>
              </>
            ) : (
              <>
                <Download size={22} />
                <span>우리반 네컷 사진 저장하기! 💾</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onBack}
              disabled={isExporting}
              className="py-3 bg-white hover:bg-brand-bg/30 active:scale-95 text-gray-600 font-bold text-sm rounded-xl border-2 border-brand-border transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <ChevronLeft size={16} />
              선택 화면으로
            </button>
            <button
              onClick={onRestart}
              disabled={isExporting}
              className="py-3 bg-red-50 hover:bg-red-100 active:scale-95 text-red-600 font-bold text-sm rounded-xl border border-red-200 transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <RotateCcw size={16} />
              다시 새로 찍기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
