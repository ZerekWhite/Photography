import { useEffect, useCallback, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Play } from 'lucide-react';
import gsap from 'gsap';
import { FavoriteButton } from './Favorites';
import ImageFilters, { type FilterType, filters } from './ImageFilters';
import Slideshow from './Slideshow';
import { getImageLoadingProps, getOptimizedImageSources } from '../lib/image';

interface LightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  title?: string;
  description?: string;
  projectTitle?: string;
  category?: string;
}

const Lightbox = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  title,
  description,
  projectTitle = '',
  category = '',
}: LightboxProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('none');
  const [slideshowOpen, setSlideshowOpen] = useState(false);

  const handlePrev = useCallback(() => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onNavigate(newIndex);
    setIsLoading(true);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    onNavigate(newIndex);
    setIsLoading(true);
  }, [currentIndex, images.length, onNavigate]);

  const handleDownload = useCallback(async () => {
    try {
      const response = await fetch(images[currentIndex]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `photo-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }, [images, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'ArrowRight':
          handleNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Prevent body scroll when open
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

  // Animation
  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        '.lightbox-overlay',
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.lightbox-content',
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'expo.out', delay: 0.1 }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentFilterStyle = filters.find((f) => f.id === currentFilter)?.style || {};

  return (
    <>
      <div
        className="lightbox-overlay fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl"
        onClick={onClose}
      >
        {/* Top controls */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/60 to-transparent">
          {/* Counter */}
          <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm font-mono">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Slideshow button */}
            <button
              className="slideshow-btn w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                setSlideshowOpen(true);
              }}
              title="幻灯片模式"
            >
              <Play size={18} />
            </button>

            {/* Filter button */}
            <ImageFilters
              onFilterChange={setCurrentFilter}
              currentFilter={currentFilter}
            />

            {/* Favorite button */}
            {projectTitle && (
              <FavoriteButton
                image={images[currentIndex]}
                projectTitle={projectTitle}
                category={category}
              />
            )}

            {/* Download button */}
            <button
              className="slideshow-btn w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              title="下载"
            >
              <Download size={18} />
            </button>

            {/* Close button */}
            <button
              className="slideshow-btn w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300"
              onClick={onClose}
              title="关闭"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div
          className="lightbox-content relative w-full h-full flex items-center justify-center p-4 sm:p-12"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Previous button */}
          <button
            className="slideshow-btn absolute left-4 sm:left-8 z-10 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Image container */}
          <div className="relative max-w-5xl max-h-[80vh] w-full h-full flex flex-col items-center justify-center">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
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
                    alt={title || `Image ${currentIndex + 1}`}
                    className={`max-w-full max-h-[70vh] object-contain rounded-lg transition-opacity duration-300 ${
                      isLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    style={currentFilterStyle}
                    onLoad={() => setIsLoading(false)}
                    {...loadingProps}
                  />
                </picture>
              );
            })()}

            {/* Image info */}
            {(title || description) && (
              <div className="mt-6 text-center max-w-2xl">
                {title && (
                  <h3 className="text-xl sm:text-2xl font-medium text-white mb-2">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-sm sm:text-base text-white/60">{description}</p>
                )}
              </div>
            )}

            {/* Filter indicator */}
            {currentFilter !== 'none' && (
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs">
                {filters.find((f) => f.id === currentFilter)?.name}
              </div>
            )}
          </div>

          {/* Next button */}
          <button
            className="slideshow-btn absolute right-4 sm:right-8 z-10 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Thumbnail strip */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm overflow-x-auto max-w-[90vw]">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(index);
                setIsLoading(true);
              }}
              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 ${
                index === currentIndex
                  ? 'ring-2 ring-white scale-110'
                  : 'opacity-50 hover:opacity-80'
              }`}
            >
              {(() => {
                const { sources, imgSrc } = getOptimizedImageSources({
                  src: img,
                  sizes: '(max-width: 640px) 48px, 64px',
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
          <span>ESC 关闭</span>
        </div>
      </div>

      {/* Slideshow */}
      <Slideshow
        images={images}
        isOpen={slideshowOpen}
        onClose={() => setSlideshowOpen(false)}
        initialIndex={currentIndex}
      />
    </>
  );
};

export default Lightbox;
