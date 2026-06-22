import { useState, useEffect } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import gsap from 'gsap';
import Lightbox from './Lightbox';
import { getImageLoadingProps, getOptimizedImageSources } from '../lib/image';
import {
  addToFavorites,
  getFavorites,
  isFavorited,
  removeFromFavorites,
  type FavoriteItem,
} from '../lib/favorites';

interface FavoriteButtonProps {
  image: string;
  projectTitle: string;
  category: string;
  className?: string;
  onToggle?: (isFav: boolean) => void;
}

export const FavoriteButton = ({
  image,
  projectTitle,
  category,
  className = '',
  onToggle,
}: FavoriteButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const isFav = isFavorited(image);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);

    if (isFav) {
      removeFromFavorites(image);
      onToggle?.(false);
    } else {
      addToFavorites({ image, projectTitle, category });
      onToggle?.(true);

      // Heart animation
      gsap.fromTo(
        '.favorite-heart',
        { scale: 1 },
        {
          scale: 1.4,
          duration: 0.15,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out',
        }
      );
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`favorite-heart w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 slideshow-btn ${
        isFav
          ? 'bg-red-500/20 text-red-500'
          : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
      } ${className}`}
      title={isFav ? '取消收藏' : '添加收藏'}
    >
      <Heart
        size={18}
        fill={isFav ? 'currentColor' : 'none'}
        className={isAnimating ? 'animate-pulse' : ''}
      />
    </button>
  );
};

// Favorites gallery component
interface FavoritesGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

const FavoritesGallery = ({ isOpen, onClose }: FavoritesGalleryProps) => {
  const [, setRefreshKey] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleRemove = (image: string) => {
    removeFromFavorites(image);
    setRefreshKey((v) => v + 1);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !lightboxOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, lightboxOpen]);

  if (!isOpen) return null;

  const favorites: FavoriteItem[] = getFavorites();
  const images = favorites.map((f) => f.image);

  return (
    <div className="favorites-overlay fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl overflow-auto">
      {/* Header */}
      <div className="favorites-header sticky top-0 z-10 flex items-center justify-between p-6 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <Heart className="text-red-500" fill="currentColor" size={24} />
          <h2 className="text-xl font-medium text-white">我的收藏</h2>
          <span className="favorites-badge px-2 py-0.5 text-xs bg-white/10 rounded-full text-white/60">
            {favorites.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors duration-300"
        >
          关闭
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/40">
            <Heart size={48} className="mb-4 opacity-30" />
            <p className="text-lg mb-2">还没有收藏任何图片</p>
            <p className="text-sm">点击作品中的爱心图标来收藏喜欢的照片</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((favorite, index) => (
              <div
                key={favorite.image}
                className="favorites-card group relative aspect-square overflow-hidden rounded-lg bg-white/5"
              >
                {(() => {
                  const { sources, imgSrc } = getOptimizedImageSources({
                    src: favorite.image,
                    sizes: '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw',
                    widths: [160, 256, 320, 480, 640],
                  });
                  const loadingProps = getImageLoadingProps();
                  return (
                    <picture>
                      {sources.map((s) => (
                        <source key={s.type} type={s.type} srcSet={s.srcSet} sizes={s.sizes} />
                      ))}
                      <img
                        src={imgSrc}
                        alt={favorite.projectTitle}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                        onClick={() => openLightbox(index)}
                        {...loadingProps}
                      />
                    </picture>
                  );
                })()}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(favorite.image);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/80 text-white hover:bg-red-500 transition-colors duration-300"
                      title="删除"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm text-white font-medium truncate">
                      {favorite.projectTitle}
                    </p>
                    <p className="text-xs text-white/60">{favorite.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        images={images}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
};

export default FavoritesGallery;
