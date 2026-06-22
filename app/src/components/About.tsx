import { useEffect, useRef, useState } from 'react';
import { Camera, MapPin, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getImageLoadingProps, getOptimizedImageSources } from '../lib/image';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: '风光摄影', level: 95 },
  { name: '建筑摄影', level: 90 },
  { name: '人像摄影', level: 85 },
  { name: '后期处理', level: 88 },
  { name: '网页设计', level: 80 },
];

const milestones = [
  { year: '2016', event: '开始摄影之旅' },
  { year: '2018', event: '首个摄影集《Water Lily》' },
  { year: '2020', event: '获得国家地理摄影奖' },
  { year: '2022', event: '出版摄影集《瞬间》' },
  { year: '2024', event: '创立个人工作室' },
];

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'bio' | 'skills' | 'timeline'>('bio');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTriggers: ScrollTrigger[] = [];

      // Image circle reveal animation
      if (imageRef.current) {
        const st = ScrollTrigger.create({
          trigger: imageRef.current,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.fromTo(
              imageRef.current,
              {
                clipPath: 'circle(0% at 50% 50%)',
                opacity: 0,
              },
              {
                clipPath: 'circle(50% at 50% 50%)',
                opacity: 1,
                duration: 1,
                ease: 'expo.out',
              }
            );
          },
        });
        scrollTriggers.push(st);

        // Image rotation on scroll
        const st2 = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            if (imageRef.current) {
              const rotation = -3 + 6 * self.progress;
              const scale = 0.95 + 0.1 * self.progress;
              gsap.set(imageRef.current, {
                rotate: rotation,
                scale: scale,
              });
            }
          },
        });
        scrollTriggers.push(st2);
      }

      // Content animation
      if (contentRef.current) {
        const st3 = ScrollTrigger.create({
          trigger: contentRef.current,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            const label = contentRef.current?.querySelector('.label');
            if (label) {
              const chars = label.textContent?.split('') || [];
              label.innerHTML = chars
                .map((char) => `<span class="inline-block">${char}</span>`)
                .join('');

              gsap.fromTo(
                label.querySelectorAll('span'),
                { y: 20, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.3,
                  stagger: 0.03,
                  ease: 'expo.out',
                  delay: 0.6,
                }
              );
            }

            const title = contentRef.current?.querySelector('.title');
            if (title) {
              gsap.fromTo(
                title,
                { y: 50, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.6,
                  ease: 'expo.out',
                  delay: 0.8,
                }
              );
            }
          },
        });
        scrollTriggers.push(st3);
      }

      return () => {
        scrollTriggers.forEach((st) => st.kill());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Mouse parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePosition({
        x: (e.clientX - rect.left - rect.width / 2) / 50,
        y: (e.clientY - rect.top - rect.height / 2) / 50,
      });
    }
  };

  const bioText = `我是一名摄影师和AI工程师，热衷于创造视觉上引人入胜的体验。我的作品专注于在数字领域捕捉日常生活的精髓。

我相信每一个瞬间都蕴含着独特的故事，而摄影正是讲述这些故事的最佳媒介。从城市建筑的几何之美到自然风光的宁静壮阔，从光影交错的戏剧性到生活片段的真实情感，我试图通过镜头捕捉那些容易被忽视却值得铭记的画面。

多年来，我游历世界各地，用相机记录下无数动人的瞬间。对我而言，最大的满足来自于能够通过影像与观者产生共鸣，唤起他们对生活的热爱与思考。`;

  const paragraphs = bioText.split('\n\n');

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-24 sm:py-32 lg:py-40 bg-background overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Floating decorative elements */}
      <div
        className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/[0.02] blur-3xl pointer-events-none"
        style={{
          transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />
      <div
        className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-white/[0.02] blur-3xl pointer-events-none"
        style={{
          transform: `translate(${-mousePosition.x * 1.5}px, ${-mousePosition.y * 1.5}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />

      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Image */}
          <div className="relative flex justify-center lg:justify-start lg:sticky lg:top-32">
            <div
              ref={imageRef}
              className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden opacity-0 will-change-transform"
              style={{
                boxShadow: '0 0 60px rgba(255, 255, 255, 0.1)',
              }}
            >
              {(() => {
                const { sources, imgSrc } = getOptimizedImageSources({
                  src: '/images/avatar.jpg',
                  sizes: '(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px',
                  widths: [256, 320, 480, 640],
                });
                const loadingProps = getImageLoadingProps();
                return (
                  <picture>
                    {sources.map((s) => (
                      <source key={s.type} type={s.type} srcSet={s.srcSet} sizes={s.sizes} />
                    ))}
                    <img src={imgSrc} alt="Profile" className="w-full h-full object-cover" {...loadingProps} />
                  </picture>
                );
              })()}
              {/* Border ring */}
              <div className="absolute inset-0 rounded-full border-2 border-white/20" />
              
              {/* Sparkle effect */}
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-6 h-6 text-white/40 animate-pulse" />
              </div>
            </div>
            
            {/* Decorative elements */}
            <div 
              className="absolute -top-4 -right-4 w-24 h-24 border border-white/10 rounded-full animate-pulse" 
              style={{ animationDuration: '4s' }} 
            />
            <div 
              className="absolute -bottom-8 -left-8 w-32 h-32 border border-white/5 rounded-full animate-pulse" 
              style={{ animationDuration: '6s', animationDelay: '1s' }} 
            />

            {/* Floating badges */}
            <div className="absolute bottom-4 -right-4 sm:right-0 lg:-right-8 flex flex-col gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                <Camera size={14} className="text-white/60" />
                <span className="text-xs text-white/80">8年经验</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                <MapPin size={14} className="text-white/60" />
                <span className="text-xs text-white/80">成都</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef}>
            <span className="label inline-block text-xs font-mono uppercase tracking-widest text-white/50 mb-4">
              关于
            </span>
            <h2 className="title text-3xl sm:text-4xl lg:text-5xl font-normal text-white mb-8">
              关于我
            </h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {[
                { id: 'bio', label: '简介', icon: null },
                { id: 'skills', label: '技能', icon: null },
                { id: 'timeline', label: '历程', icon: null },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="min-h-[300px]">
              {activeTab === 'bio' && (
                <div className="space-y-6 animate-fadeIn">
                  {paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-base sm:text-lg text-white/70 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-5 animate-fadeIn">
                  {skills.map((skill, index) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-white/80">{skill.name}</span>
                        <span className="text-sm text-white/40">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden skill-bar-track">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-1000 ease-out skill-bar-fill"
                          style={{
                            width: `${skill.level}%`,
                            transitionDelay: `${index * 100}ms`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="space-y-0 animate-fadeIn">
                  {milestones.map((milestone, index) => (
                    <div
                      key={milestone.year}
                      className="flex gap-6 pb-8 relative"
                    >
                      {/* Timeline line */}
                      {index < milestones.length - 1 && (
                        <div className="absolute left-[3px] top-8 bottom-0 w-px bg-white/10 timeline-line" />
                      )}
                      
                      {/* Dot */}
                      <div className="relative flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-white/60 timeline-dot" />
                      </div>
                      
                      {/* Content */}
                      <div>
                        <span className="text-sm font-mono text-white/40 block mb-1 timeline-year">
                          {milestone.year}
                        </span>
                        <span className="text-white/80 timeline-event">{milestone.event}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
              <div>
                <div className="text-2xl sm:text-3xl font-light text-white mb-1">8+</div>
                <div className="text-xs font-mono uppercase tracking-wider text-white/50">年经验</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-light text-white mb-1">200+</div>
                <div className="text-xs font-mono uppercase tracking-wider text-white/50">项目</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-light text-white mb-1">15</div>
                <div className="text-xs font-mono uppercase tracking-wider text-white/50">展览</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </section>
  );
};

export default About;
