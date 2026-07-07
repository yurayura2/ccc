import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CapturedPhoto, ScreenType } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import CameraScreen from './components/CameraScreen';
import SelectionScreen from './components/SelectionScreen';
import DecorationScreen from './components/DecorationScreen';
import { Smile, Sparkles } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('WELCOME');
  const [className, setClassName] = useState('햇살반');
  const [memberNames, setMemberNames] = useState('');
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<CapturedPhoto[]>([]);

  // Navigation handlers
  const handleStartBooth = (name: string, members: string) => {
    setClassName(name);
    setMemberNames(members);
    setCapturedPhotos([]);
    setSelectedPhotos([]);
    setCurrentScreen('CAMERA');
  };

  const handleCameraComplete = (photos: CapturedPhoto[]) => {
    setCapturedPhotos(photos);
    setCurrentScreen('SELECTION');
  };

  const handleSelectionComplete = (chosenPhotos: CapturedPhoto[]) => {
    setSelectedPhotos(chosenPhotos);
    setCurrentScreen('DECORATION');
  };

  const handleRestart = () => {
    if (window.confirm('앗! 정말 처음 화면으로 돌아가서 다시 찍을까요?')) {
      setCapturedPhotos([]);
      setSelectedPhotos([]);
      setCurrentScreen('WELCOME');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark font-sans relative overflow-x-hidden border-[12px] border-brand-border flex flex-col">
      
      {/* Playful Floating Background Clouds & Balloons (Pure CSS) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 opacity-20">
        <div className="absolute top-[10%] left-[5%] text-6xl animate-float">☁️</div>
        <div className="absolute top-[40%] right-[8%] text-7xl animate-float" style={{ animationDelay: '1s' }}>☁️</div>
        <div className="absolute top-[75%] left-[12%] text-5xl animate-float" style={{ animationDelay: '2s' }}>☁️</div>
        <div className="absolute bottom-[10%] right-[15%] text-6xl animate-float" style={{ animationDelay: '0.5s' }}>☁️</div>
        <div className="absolute top-[25%] right-[25%] text-4xl animate-bounce" style={{ animationDuration: '6s' }}>🎈</div>
        <div className="absolute bottom-[30%] left-[25%] text-5xl animate-bounce" style={{ animationDuration: '8s' }}>🌈</div>
      </div>

      {/* Main Navigation Header */}
      <header className="bg-white border-b-4 border-brand-border py-4 px-6 sticky top-0 z-30 shadow-[0_4px_0_rgba(255,209,220,0.5)] flex justify-between items-center shrink-0">
        <div 
          onClick={() => {
            if (currentScreen !== 'WELCOME' && window.confirm('처음 화면으로 갈까요? 찍은 사진이 사라져요!')) {
              setCurrentScreen('WELCOME');
            }
          }}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-full bg-brand-border/30 flex items-center justify-center text-brand-pink group-hover:scale-110 transition duration-300">
            <Smile className="stroke-[2.5]" size={22} />
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-bold -mt-1">유치원 우정 사진관</p>
          </div>
        </div>

        {/* Step indicators / badges following Clean Minimalism */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-full border border-gray-100">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              currentScreen === 'WELCOME' ? 'bg-brand-pink text-white scale-110' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              currentScreen === 'CAMERA' ? 'bg-brand-pink text-white scale-110' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              currentScreen === 'SELECTION' ? 'bg-brand-pink text-white scale-110' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              currentScreen === 'DECORATION' ? 'bg-brand-pink text-white scale-110' : 'bg-gray-200 text-gray-500'
            }`}>
              4
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {currentScreen === 'CAMERA' && (
              <span className="text-xs bg-brand-pink text-white font-bold px-3 py-1.5 rounded-full animate-pulse shadow-xs">
                ● 촬영중
              </span>
            )}
            {currentScreen === 'SELECTION' && (
              <span className="text-xs bg-brand-border text-brand-pink font-bold px-3 py-1.5 rounded-full shadow-xs">
                ✨ 고르기
              </span>
            )}
            {currentScreen === 'DECORATION' && (
              <span className="text-xs bg-green-100 text-green-800 font-bold px-3 py-1.5 rounded-full flex items-center gap-0.5 shadow-xs">
                <Sparkles size={10} /> 꾸미기
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Interactive Main Stage */}
      <main className="relative z-10 py-6 px-2 flex-1">
        <AnimatePresence mode="wait">
          {currentScreen === 'WELCOME' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <WelcomeScreen
                onStart={handleStartBooth}
                initialClassName={className}
                initialMemberNames={memberNames}
              />
            </motion.div>
          )}

          {currentScreen === 'CAMERA' && (
            <motion.div
              key="camera"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <CameraScreen
                className={className}
                onBack={() => setCurrentScreen('WELCOME')}
                onComplete={handleCameraComplete}
              />
            </motion.div>
          )}

          {currentScreen === 'SELECTION' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <SelectionScreen
                photos={capturedPhotos}
                onBack={() => setCurrentScreen('CAMERA')}
                onComplete={handleSelectionComplete}
              />
            </motion.div>
          )}

          {currentScreen === 'DECORATION' && (
            <motion.div
              key="decoration"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <DecorationScreen
                selectedPhotos={selectedPhotos}
                className={className}
                memberNames={memberNames}
                onBack={() => setCurrentScreen('SELECTION')}
                onRestart={handleRestart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Gentle overlay/footer element */}
      <footer className="relative z-10 pb-8 pt-4 text-center text-xs text-gray-400 font-bold select-none">
        <p>우리반 네컷 © 2026 🧸 🏫</p>
        <p className="mt-1 text-[10px] text-gray-300">친구들의 예쁜 미소를 응원합니다</p>
      </footer>
    </div>
  );
}
