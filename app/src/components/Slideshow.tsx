import { useState, useEffect, useCallback } from 'react';
import { X, Play, Pause, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import gsap from 'gsap';
import { getImageLoadingProps, getOptimizedImageSources } from '../lib/image';

interface SlideshowProps {
  images: string[];
  titles?: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

const Slideshow = ({
  images,
  titles,
  isOpen,
  onClose,
  initialIndex = 0,
}: SlideshowProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [slideInterval, setSlideInterval] = useState(3000);
  const [showSettings, setShowSettings] = useState(false);
  const [transition, setTransition] = useState<'fade' | 'slide' | 'zoom'>('fade');

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-play
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = window.setInterval(goToNext, slideInterval);
    return () => window.clearInterval(timer);
  }, [isOpen, isPlaying, slideInterval, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrev();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToPrev, goToNext]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Animation on slide change
  useEffect(() => {
    const slide = document.querySelector('.slideshow-slide');
    if (!slide) return;

    switch (transition) {
      case 'fade':
        gsap.fromTo(
          slide,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: 'power2.out' }
        );
        break;
      case 'slide':
        gsap.fromTo(
          slide,
          { x: '100%', opacity: 0 },
          { x: '0%', opacity: 1, duration: 0.6, ease: 'expo.out' }
        );
        break;
      case 'zoom':
        gsap.fromTo(
          slide,
          { scale: 1.2, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'expo.out' }
        );
        break;
    }
  }, [currentIndex, transition]);

  // Progress bar animation
  useEffect(() => {
    if (!isPlaying) return;

    const progressBar = document.querySelector('.slideshow-progress');
    if (progressBar) {
      gsap.fromTo(
        progressBar,
        { width: '0%' },
        { width: '100%', duration: slideInterval / 1000, ease: 'linear' }
      );
    }
  }, [currentIndex, isPlaying, slideInterval]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top controls */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6 bg-gradient-to-b from-black/60 to-transparent">
        {/* Counter */}
        <div className="flex items-center gap-4">
          <span className="text-white/80 font-mono text-sm">
            {currentIndex + 1} / {images.length}
          </span>
          {titles && titles[currentIndex] && (
            <span className="text-white/60 text-sm hidden sm:block">
              {titles[currentIndex]}
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="slideshow-btn w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-all duration-300"
            title={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`slideshow-btn w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
              showSettings ? '' : ''
            }`}
            title="设置"
          >
            <Settings size={18} />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="slideshow-btn w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-all duration-300"
            title="关闭"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="absolute top-20 right-6 z-30 p-4 rounded-xl bg-black/90 backdrop-blur-xl border border-white/10">
          <div className="space-y-4">
            {/* Interval */}
            <div>
              <label className="text-xs text-white/50 mb-2 block">切换间隔</label>
              <div className="flex gap-2">
                {[2000, 3000, 5000, 8000].map((ms) => {
                  const isActive = slideInterval === ms;
                  return (
                    <button
                      key={ms}
                      onClick={() => setSlideInterval(ms)}
                      className={`slideshow-setting-btn ${
                        isActive ? 'slideshow-setting-btn--active' : ''
                      } px-3 py-1.5 text-xs rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-white text-black'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      {ms / 1000}s
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Transition */}
            <div>
              <label className="text-xs text-white/50 mb-2 block">过渡效果</label>
              <div className="flex gap-2">
                {(['fade', 'slide', 'zoom'] as const).map((t) => {
                  const isActive = transition === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setTransition(t)}
                      className={`slideshow-setting-btn ${
                        isActive ? 'slideshow-setting-btn--active' : ''
                      } px-3 py-1.5 text-xs rounded-lg transition-all duration-300 capitalize ${
                        isActive
                          ? 'bg-white text-black'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      {t === 'fade' ? '淡入' : t === 'slide' ? '滑动' : '缩放'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main image */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Navigation arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-4 sm:left-8 z-10 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm"
        >
          <ChevronLeft size={28} />
        </button>

        {/* Image */}
        <div className="slideshow-slide relative max-w-[90vw] max-h-[85vh]">
          {(() => {
            const { sources, imgSrc } = getOptimizedImageSources({
              src: images[currentIndex],
              sizes: '100vw',
              widths: [640, 960, 1280, 1600, 1920],
            });
            const loadingProps = getImageLoadingProps({ priority: true });
            return (
              <picture>
                {sources.map((s) => (
                  <source key={s.type} type={s.type} srcSet={s.srcSet} sizes={s.sizes} />
                ))}
                <img
                  src={imgSrc}
                  alt={`Slide ${currentIndex + 1}`}
                  className="max-w-full max-h-[85vh] object-contain"
                  {...loadingProps}
                />
              </picture>
            );
          })()}
        </div>

        <button
          onClick={goToNext}
          className="absolute right-4 sm:right-8 z-10 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Bottom progress */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <div
          className="slideshow-progress h-full bg-white/60"
          style={{ width: isPlaying ? undefined : '0%' }}
        />
      </div>

      {/* Thumbnail strip */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm max-w-[90vw] overflow-x-auto">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 ${
              index === currentIndex
                ? 'ring-2 ring-white scale-110'
                : 'opacity-50 hover:opacity-80'
            }`}
          >
            {(() => {
              const { sources, imgSrc } = getOptimizedImageSources({
                src: img,
                sizes: '(max-width: 640px) 48px, 56px',
                widths: [96, 128, 160],
              });
              const loadingProps = getImageLoadingProps({ priority: index === currentIndex });
              return (
                <picture>
                  {sources.map((s) => (
                    <source key={s.type} type={s.type} srcSet={s.srcSet} sizes={s.sizes} />
                  ))}
                  <img
                    src={imgSrc}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    {...loadingProps}
                  />
                </picture>
              );
            })()}
          </button>
        ))}
      </div>

      {/* Keyboard hints */}
      <div className="absolute bottom-6 right-6 z-10 hidden lg:flex items-center gap-4 text-white/30 text-xs">
        <span>← → 切换</span>
        <span>空格 播放/暂停</span>
        <span>ESC 退出</span>
      </div>
    </div>
  );
};

export default Slideshow;
