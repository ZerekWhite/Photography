import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { getImageLoadingProps, getOptimizedImageSources } from '../lib/image';

interface CarouselProps {
  images: string[];
  autoPlay?: boolean;
  interval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  className?: string;
  onImageClick?: (index: number) => void;
}

const Carousel = ({
  images,
  autoPlay = true,
  interval = 3000,
  showIndicators = true,
  showArrows = true,
  className = '',
  onImageClick,
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex || !containerRef.current) return;
      setIsTransitioning(true);

      const direction = index > currentIndex ? 1 : -1;
      const currentSlide = slidesRef.current[currentIndex];
      const nextSlide = slidesRef.current[index];

      if (!currentSlide || !nextSlide) {
        setIsTransitioning(false);
        return;
      }

      // Animate out current slide
      gsap.to(currentSlide, {
        x: -100 * direction + '%',
        opacity: 0,
        duration: 0.5,
        ease: 'expo.inOut',
      });

      // Animate in new slide
      gsap.fromTo(
        nextSlide,
        { x: 100 * direction + '%', opacity: 0 },
        {
          x: '0%',
          opacity: 1,
          duration: 0.5,
          ease: 'expo.inOut',
          onComplete: () => {
            setIsTransitioning(false);
          },
        }
      );

      setCurrentIndex(index);
    },
    [currentIndex, isTransitioning]
  );

  const goToPrev = useCallback(() => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, images.length, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, images.length, goToSlide]);

  // Auto-play - using ref to manage timer
  useEffect(() => {
    // Clear existing timer
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }

    if (!autoPlay || isPaused) return;

    autoPlayTimerRef.current = setInterval(() => {
      goToNext();
    }, interval);

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [autoPlay, isPaused, interval, goToNext]);

  // Initialize slides
  useEffect(() => {
    // Reset all slides to initial state
    slidesRef.current.forEach((slide, index) => {
      if (slide) {
        gsap.set(slide, {
          x: index === 0 ? '0%' : '100%',
          opacity: index === 0 ? 1 : 0,
        });
      }
    });
  }, []);


  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides container */}
      <div className="relative aspect-[16/10] w-full">
        {images.map((image, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) slidesRef.current[index] = el;
            }}
            className="absolute inset-0 w-full h-full"
            onClick={() => onImageClick?.(index)}
            style={{ cursor: onImageClick ? 'pointer' : 'default' }}
          >
            {(() => {
              const { sources, imgSrc } = getOptimizedImageSources({
                src: image,
                sizes: '(max-width: 768px) 100vw, 50vw',
                widths: [480, 640, 960, 1280, 1600],
              });
              const loadingProps = getImageLoadingProps({ priority: index === 0 });
              return (
                <picture>
                  {sources.map((s) => (
                    <source key={s.type} type={s.type} srcSet={s.srcSet} sizes={s.sizes} />
                  ))}
                  <img
                    src={imgSrc}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                    {...loadingProps}
                  />
                </picture>
              );
            })()}
            {/* Hover overlay */}
            {onImageClick && (
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 hover:opacity-100 text-white text-sm font-mono uppercase tracking-wider transition-opacity duration-300">
                  点击查看
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {showArrows && (
        <>
          <button
            onClick={goToPrev}
            className="carousel-arrow-btn absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="carousel-arrow-btn absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-black/50 text-white/80 hover:bg-black/70 hover:text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {autoPlay && !isPaused && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-10">
          <div
            className="h-full bg-white/60"
            style={{
              animation: `carousel-progress ${interval}ms linear infinite`,
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes carousel-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Carousel;
