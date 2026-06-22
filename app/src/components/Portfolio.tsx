import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Carousel from './Carousel';
import Lightbox from './Lightbox';
import {
  getProjectAllImages,
  portfolioProjects,
  type PortfolioProject,
} from '../lib/portfolio';

gsap.registerPlugin(ScrollTrigger);

const PortfolioCard = ({
  project,
  index,
  onViewDetail,
  onOpenLightbox,
}: {
  project: PortfolioProject;
  index: number;
  onViewDetail: (id: number) => void;
  onOpenLightbox: (images: string[], index: number) => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const totalImagesCount = getProjectAllImages(project).length;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Card entrance animation - only animate once
      if (cardRef.current && !hasAnimated.current) {
        const st = ScrollTrigger.create({
          trigger: cardRef.current,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            hasAnimated.current = true;
            gsap.fromTo(
              cardRef.current,
              {
                y: 60,
                opacity: 0,
              },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'expo.out',
                delay: index * 0.15,
              }
            );
          },
        });

        return () => {
          st.kill();
        };
      }
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="group relative"
      style={{ opacity: 1 }}
    >
      <div className="card-3d relative overflow-hidden rounded-xl bg-[#1A1A1A] border border-white/5 hover:border-white/20 transition-colors duration-500">
        {/* Carousel */}
        <div className="relative">
          <Carousel
            images={project.previewImages}
            autoPlay={true}
            interval={3000}
            showIndicators={true}
            showArrows={true}
            className="rounded-t-xl"
            onImageClick={(imgIndex) => onOpenLightbox(project.previewImages, imgIndex)}
          />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="portfolio-card-badge px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-black/70 backdrop-blur-md text-white rounded-full">
              {project.category}
            </span>
          </div>

          {/* View Detail Button */}
          <button
            onClick={() => onViewDetail(project.id)}
            className="portfolio-card-btn absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white/80 hover:bg-white hover:text-black transition-all duration-300 hover:scale-110"
            title="查看全部"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-medium text-white group-hover:translate-x-1 transition-transform duration-300">
              {project.title}
            </h3>
            <span className="text-xs text-white/40 font-mono">
              {totalImagesCount} 张
            </span>
          </div>
          <p className="text-sm text-white/50 leading-relaxed mb-4">
            {project.description}
          </p>
          
          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onViewDetail(project.id)}
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-300 group/btn"
            >
              <span>查看全部</span>
              <ArrowRight
                size={16}
                className="group-hover/btn:translate-x-1 transition-transform duration-300"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        const st = ScrollTrigger.create({
          trigger: titleRef.current,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            const label = titleRef.current?.querySelector('.label');
            if (label) {
              gsap.fromTo(
                label,
                { width: 0, opacity: 0 },
                { width: 'auto', opacity: 1, duration: 0.4, ease: 'none' }
              );
            }

            const words = titleRef.current?.querySelectorAll('.title-word');
            if (words) {
              gsap.fromTo(
                words,
                { y: 40, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.6,
                  stagger: 0.1,
                  ease: 'expo.out',
                  delay: 0.2,
                }
              );
            }
          },
        });

        return () => {
          st.kill();
        };
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleViewDetail = (id: number) => {
    navigate(`/portfolio/${id}`);
  };

  const handleOpenLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative w-full py-24 sm:py-32 lg:py-40 bg-background"
    >
      <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Section Header */}
        <div ref={titleRef} className="mb-16 sm:mb-20 lg:mb-24">
          <span className="label inline-block text-xs font-mono uppercase tracking-widest text-white/50 mb-4 overflow-hidden whitespace-nowrap">
            作品
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-white">
            <span className="title-word inline-block">精选</span>{' '}
            <span className="title-word inline-block">作品</span>
          </h2>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {portfolioProjects.map((project, index) => (
            <PortfolioCard
              key={project.id}
              project={project}
              index={index}
              onViewDetail={handleViewDetail}
              onOpenLightbox={handleOpenLightbox}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </section>
  );
};

export default Portfolio;
