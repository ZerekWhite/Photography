import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getImageLoadingProps, getOptimizedImageSources } from '../lib/image';
import { useTheme } from 'next-themes';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Background image animation - ensure it's visible first
        if (imageRef.current) {
          gsap.set(imageRef.current, { opacity: 1, scale: 1 });
          gsap.fromTo(
            imageRef.current,
            { scale: 1.1 },
            {
              scale: 1,
              duration: 1.5,
              ease: 'expo.out',
            }
          );
        }

        // Title animation - character by character
        if (titleRef.current) {
          const chars = titleRef.current.textContent?.split('') || [];
          titleRef.current.innerHTML = chars
            .map((char) => `<span class="inline-block">${char}</span>`)
            .join('');

          gsap.fromTo(
            titleRef.current.querySelectorAll('span'),
            {
              y: 60,
              opacity: 0,
              rotateX: 45,
            },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 0.6,
              stagger: 0.04,
              ease: 'expo.out',
              delay: 0.3,
            }
          );
        }

        // Subtitle animation
        if (subtitleRef.current) {
          gsap.fromTo(
            subtitleRef.current,
            {
              filter: 'blur(10px)',
              opacity: 0,
            },
            {
              filter: 'blur(0px)',
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
              delay: 0.8,
            }
          );
        }

        // Scroll indicator animation
        if (scrollIndicatorRef.current) {
          gsap.fromTo(
            scrollIndicatorRef.current,
            {
              y: 40,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'back.out(1.7)',
              delay: 1.2,
            }
          );
        }

        // Scroll-driven animations
        const scrollTriggers: ScrollTrigger[] = [];

        // Title fade out on scroll
        if (titleRef.current) {
          const st = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: '50% top',
            scrub: true,
            onUpdate: (self) => {
              if (titleRef.current) {
                gsap.set(titleRef.current, {
                  y: -80 * self.progress,
                  opacity: 1 - self.progress,
                });
              }
            },
          });
          scrollTriggers.push(st);
        }

        // Subtitle fade out on scroll
        if (subtitleRef.current) {
          const st = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: '50% top',
            scrub: true,
            onUpdate: (self) => {
              if (subtitleRef.current) {
                gsap.set(subtitleRef.current, {
                  y: -50 * self.progress,
                  opacity: 1 - self.progress,
                });
              }
            },
          });
          scrollTriggers.push(st);
        }

        // Background parallax
        if (imageRef.current) {
          const st = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            onUpdate: (self) => {
              if (imageRef.current) {
                gsap.set(imageRef.current, {
                  y: 150 * self.progress,
                  scale: 1 + 0.15 * self.progress,
                });
              }
            },
          });
          scrollTriggers.push(st);
        }

        // Scroll indicator fade out
        if (scrollIndicatorRef.current) {
          const st = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: '30% top',
            scrub: true,
            onUpdate: (self) => {
              if (scrollIndicatorRef.current) {
                gsap.set(scrollIndicatorRef.current, {
                  opacity: 1 - self.progress,
                });
              }
            },
          });
          scrollTriggers.push(st);
        }

        return () => {
          scrollTriggers.forEach((st) => st.kill());
        };
      }, sectionRef);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(initTimer);
  }, []);

  const scrollToPortfolio = () => {
    const element = document.querySelector('#portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* Background Image - Always visible */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{ opacity: 1 }}
      >
        {(() => {
          const isLight = theme === 'light';
          const { sources, imgSrc } = getOptimizedImageSources({
            src: isLight ? '/images/city/baichuanxiang-12.jpg' : '/images/hero-bg.jpg',
            sizes: '100vw',
            widths: [640, 1280, 1920, 2560],
          });
          const loadingProps = getImageLoadingProps({ priority: true });
          return (
            <picture>
              {sources.map((s) => (
                <source key={s.type} type={s.type} srcSet={s.srcSet} sizes={s.sizes} />
              ))}
              <img
                src={imgSrc}
                alt="Landscape"
                className="w-full h-full object-cover"
                {...loadingProps}
              />
            </picture>
          );
        })()}
        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-b transition-opacity duration-500 ${
            theme === 'light'
              ? 'from-white/20 via-white/10 to-white/40'
              : 'from-black/40 via-black/20 to-black'
          }`}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-white mb-4 perspective-1000"
        >
          cacao
        </h1>
        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl md:text-2xl text-white/80 font-mono tracking-wider"
        >
          摄影师/Agent Coder
        </p>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer"
        onClick={scrollToPortfolio}
      >
        <div className="flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors duration-300">
          <span className="text-xs font-mono uppercase tracking-widest">探索</span>
          <ChevronDown
            size={24}
            className="animate-bounce"
            style={{ animationDuration: '2s' }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
