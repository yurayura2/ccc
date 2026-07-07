import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, ChevronLeft, Play, Pause, AlertCircle, Smile, Sparkles, Star } from 'lucide-react';
import { CapturedPhoto } from '../types';
import { playBeep, playShutterSound } from '../utils/audio';

interface CameraScreenProps {
  onComplete: (photos: CapturedPhoto[]) => void;
  onBack: () => void;
  className: string;
}

export default function CameraScreen({ onComplete, onBack, className }: CameraScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [flash, setFlash] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [prepareTimer, setPrepareTimer] = useState<number | null>(null); // countdown to next photo in auto mode

  // Start webcam
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
          audio: false,
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setStream(mediaStream);
        activeStream = mediaStream;
        setHasError(false);
      } catch (err) {
        console.error('Failed to get camera:', err);
        setHasError(true);
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Take current screenshot
  const capturePhoto = () => {
    if (!videoRef.current) return;
    
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Mirror horizontally
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const newPhoto: CapturedPhoto = {
          id: Math.random().toString(36).substr(2, 9),
          url: dataUrl,
          timestamp: Date.now(),
        };

        // Flash screen
        setFlash(true);
        playShutterSound();
        setTimeout(() => setFlash(false), 200);

        setCapturedPhotos((prev) => {
          const updated = [...prev, newPhoto];
          // If we reached 5 photos, proceed to selection screen after a brief delay
          if (updated.length >= 5) {
            setTimeout(() => {
              // Clean up and proceed
              onComplete(updated);
            }, 1000);
          }
          return updated;
        });
      }
    } catch (err) {
      console.error('Error capturing photo:', err);
    }
  };

  // Start capture sequence (triggers countdown)
  const handleStartCapture = () => {
    if (isCapturing || capturedPhotos.length >= 5) return;
    setIsCapturing(true);
    startCountdown(3);
  };

  // Recursive countdown helper
  const startCountdown = (count: number) => {
    setCountdown(count);
    if (count > 0) {
      playBeep(600, 0.1); // normal beep
      setTimeout(() => {
        startCountdown(count - 1);
      }, 1000);
    } else {
      // Countdown finished! Capture!
      setCountdown(null);
      capturePhoto();
      
      // Setup for next photo if we have more to take
      setCapturedPhotos((prev) => {
        const nextIndex = prev.length; // because state updates are batched, this tells us what the index will be AFTER this capture
        if (nextIndex < 5) {
          setCurrentPhotoIndex(nextIndex);
          if (mode === 'auto') {
            // Auto mode: countdown for preparation time
            startPrepareTimer(4);
          } else {
            // Manual mode: stop capturing and wait for next click
            setIsCapturing(false);
          }
        } else {
          setIsCapturing(false);
        }
        return prev;
      });
    }
  };

  // Preparation interval timer helper (for auto mode)
  const startPrepareTimer = (count: number) => {
    setPrepareTimer(count);
    if (count > 0) {
      setTimeout(() => {
        startPrepareTimer(count - 1);
      }, 1000);
    } else {
      setPrepareTimer(null);
      // Prepare timer done, start the photo countdown
      startCountdown(3);
    }
  };

  const handleReset = () => {
    setCapturedPhotos([]);
    setCurrentPhotoIndex(0);
    setIsCapturing(false);
    setCountdown(null);
    setPrepareTimer(null);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[85vh] max-w-5xl mx-auto px-4 py-6">
      {/* Top Bar Navigation */}
      <div className="w-full flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          disabled={isCapturing}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-800 disabled:opacity-50 transition cursor-pointer font-bold text-lg"
        >
          <ChevronLeft size={24} />
          처음으로
        </button>
        <div className="text-center">
          <span className="bg-white text-brand-pink border-2 border-brand-border font-extrabold px-5 py-1.5 rounded-full text-lg shadow-[0_4px_0_rgba(255,209,220,0.4)]">
            🏫 {className} 우정네컷 촬영 중
          </span>
        </div>
        <button
          onClick={handleReset}
          disabled={isCapturing || capturedPhotos.length === 0}
          className="flex items-center gap-1 text-gray-400 hover:text-red-500 disabled:opacity-30 transition cursor-pointer font-bold text-lg"
        >
          <RefreshCw size={18} />
          다시 찍기
        </button>
      </div>

      {/* Main Studio Area */}
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Side: Instructions & Mode Selection */}
        <div className="md:col-span-1 bg-white p-5 rounded-[28px] border-4 border-brand-border shadow-md space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2 border-brand-border/40 flex items-center gap-1.5 font-sans">
            <Smile size={18} className="text-brand-pink" />
            어떻게 찍을까요?
          </h3>
          
          {/* Mode switch styled with Clean Minimalism */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setMode('auto')}
              disabled={isCapturing}
              className={`py-3 px-4 rounded-2xl font-bold text-sm text-left border-2 transition cursor-pointer flex items-center justify-between ${
                mode === 'auto'
                  ? 'bg-brand-pink text-white border-brand-pink-dark shadow-sm'
                  : 'bg-white text-gray-700 border-brand-border/40 hover:bg-brand-bg/40'
              }`}
            >
              <div>
                <p>연속 촬영 (자동) 🌟</p>
                <p className="text-xs opacity-80 font-normal mt-0.5">찰칵 찍은 뒤, 4초 후 알아서 찍혀요</p>
              </div>
              {mode === 'auto' && <Star size={16} className="fill-white" />}
            </button>
            <button
              onClick={() => setMode('manual')}
              disabled={isCapturing}
              className={`py-3 px-4 rounded-2xl font-bold text-sm text-left border-2 transition cursor-pointer flex items-center justify-between ${
                mode === 'manual'
                  ? 'bg-brand-pink text-white border-brand-pink-dark shadow-sm'
                  : 'bg-white text-gray-700 border-brand-border/40 hover:bg-brand-bg/40'
              }`}
            >
              <div>
                <p>한 장씩 촬영 (수동) 📸</p>
                <p className="text-xs opacity-80 font-normal mt-0.5">준비가 되면 찰칵 버튼을 눌러요</p>
              </div>
              {mode === 'manual' && <Star size={16} className="fill-white" />}
            </button>
          </div>

          {/* Status info */}
          <div className="bg-brand-bg/30 p-3 rounded-xl border border-brand-border/50 space-y-2">
            <p className="text-sm font-bold text-gray-700">📸 촬영 안내</p>
            <p className="text-xs text-gray-500 leading-relaxed font-semibold">
              총 <span className="text-brand-pink font-bold">5장</span>의 사진을 찍습니다. 그 중 가장 마음에 드는 <span className="text-brand-pink font-bold">4장</span>을 고를 수 있어요!
            </p>
          </div>

          {/* Captured list status */}
          <div className="space-y-2 pt-2">
            <p className="text-sm font-bold text-gray-700">촬영 진행률 ({capturedPhotos.length}/5)</p>
            <div className="flex gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-3 rounded-full transition-all duration-300 ${
                    i < capturedPhotos.length
                      ? 'bg-brand-pink'
                      : i === capturedPhotos.length && isCapturing
                      ? 'bg-brand-border animate-pulse'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Center: Live Camera Feed */}
        <div className="md:col-span-2 flex flex-col items-center">
          <div className="w-full relative aspect-[4/3] rounded-[36px] overflow-hidden border-[10px] border-white shadow-2xl bg-slate-900 flex items-center justify-center">
            
            {/* Horizontal mirrored video */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />

            {/* Flash screen effect */}
            {flash && (
              <div className="absolute inset-0 bg-white opacity-100 z-50 transition-opacity" />
            )}

            {/* Camera error state */}
            {hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center z-40">
                <AlertCircle size={48} className="text-red-400 mb-3 animate-bounce" />
                <h4 className="text-xl font-bold mb-1">카메라를 켤 수 없어요!</h4>
                <p className="text-sm text-gray-400 max-w-xs">
                  카메라 권한 승인이 필요합니다. 브라우저 주소창 왼쪽의 카메라 차단 설정을 해제해주세요!
                </p>
              </div>
            )}

            {/* Loading state before stream starts */}
            {!stream && !hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white z-30">
                <Smile size={48} className="text-brand-pink animate-spin mb-3" />
                <p className="font-bold text-lg">반가워요! 카메라가 곧 켜집니다...</p>
              </div>
            )}

            {/* Animated Big Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-40 backdrop-blur-xs">
                {countdown > 0 ? (
                  <div className="flex flex-col items-center animate-cute-pulse">
                    <span className="font-dongle text-9xl text-brand-pink font-bold drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)]">
                      {countdown}
                    </span>
                    <span className="text-xl font-bold text-white bg-brand-pink/90 px-5 py-2 rounded-full shadow-md">
                      예쁜 표정 지으세요!
                    </span>
                  </div>
                ) : (
                  <div className="text-4xl font-bold text-white bg-brand-pink px-6 py-3 rounded-2xl animate-ping">
                    찰칵! 📸
                  </div>
                )}
              </div>
            )}

            {/* Auto Mode: Next Photo Prepare Timer Overlay */}
            {prepareTimer !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-30 backdrop-blur-xs">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-1 text-brand-pink font-bold text-xl animate-bounce">
                    <Sparkles size={20} />
                    아주 예뻐요! 다음 사진을 준비하세요
                  </div>
                  <div className="font-dongle text-8xl text-white font-bold tracking-wider leading-none">
                    {prepareTimer}초 후 찰칵!
                  </div>
                  <p className="text-sm text-gray-300 font-medium">재미있는 포즈를 지어보세요!</p>
                </div>
              </div>
            )}
          </div>

          {/* Capture Trigger Buttons with physical shadow */}
          <div className="w-full mt-5">
            {!isCapturing && capturedPhotos.length < 5 ? (
              <button
                onClick={handleStartCapture}
                disabled={!stream || hasError}
                className="w-full py-4 rounded-[28px] bg-brand-pink hover:bg-brand-pink-dark active:scale-95 text-white font-extrabold text-2xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer border-b-6 border-brand-pink-dark disabled:opacity-50"
              >
                <Camera size={26} />
                {capturedPhotos.length === 0
                  ? '촬영 시작하기! 📸'
                  : `${capturedPhotos.length + 1}번째 사진 찍기 📸`}
              </button>
            ) : (
              <div className="w-full py-4 rounded-[28px] bg-white border-4 border-brand-border text-gray-500 font-bold text-xl flex items-center justify-center gap-2 shadow-xs">
                {countdown !== null ? (
                  <span>촬영 중... 멋진 포즈를 하세요!</span>
                ) : prepareTimer !== null ? (
                  <span className="flex items-center gap-1 text-brand-pink">다음 사진 준비 시간 ({prepareTimer}초)...</span>
                ) : (
                  <span>찰칵! 📸</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Captured Filmstrip preview */}
        <div className="md:col-span-1 bg-white p-4 rounded-[28px] border-4 border-brand-border shadow-md">
          <h4 className="text-md font-bold text-gray-700 border-b pb-2 border-brand-border/40 flex items-center justify-between">
            <span>필름 스트립</span>
            <span className="text-xs bg-brand-border/30 text-brand-pink font-bold px-2 py-0.5 rounded-full">
              {capturedPhotos.length}/5장
            </span>
          </h4>
          
          <div className="flex md:flex-col gap-3 mt-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar max-h-[360px]">
            {capturedPhotos.length === 0 ? (
              <div className="w-full py-16 flex flex-col items-center justify-center text-gray-300 text-sm font-bold border-2 border-dashed border-brand-border/50 rounded-xl">
                <Smile size={32} className="stroke-[1.5] mb-1 text-brand-pink/50" />
                <span>아직 찍은 사진이</span>
                <span>없어요</span>
              </div>
            ) : (
              capturedPhotos.map((photo, i) => (
                <div
                  key={photo.id}
                  className="relative group flex-shrink-0 w-24 md:w-full aspect-[4/3] rounded-xl overflow-hidden border-2 border-brand-border shadow-sm"
                >
                  <img
                    src={photo.url}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-brand-pink text-white font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {i + 1}
                  </div>
                </div>
              ))
            )}
            
            {/* Skeletons for remaining slots */}
            {Array.from({ length: Math.max(0, 5 - capturedPhotos.length) }).map((_, i) => {
              const num = capturedPhotos.length + i + 1;
              return (
                <div
                  key={`empty-${num}`}
                  className="hidden md:flex flex-col items-center justify-center w-full aspect-[4/3] rounded-xl border-2 border-dashed border-brand-border/30 bg-brand-bg/20 text-gray-400 font-bold"
                >
                  <span className="text-lg">📸</span>
                  <span className="text-xs mt-0.5">{num}번 사진</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
