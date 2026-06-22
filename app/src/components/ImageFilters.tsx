import { useState } from 'react';
import { Sliders, RotateCcw, Contrast, Sun, Droplets } from 'lucide-react';

export type FilterType = 'none' | 'grayscale' | 'sepia' | 'high-contrast' | 'vintage' | 'cool' | 'warm';

interface FilterOption {
  id: FilterType;
  name: string;
  icon: React.ElementType;
  style: React.CSSProperties;
}

const filters: FilterOption[] = [
  {
    id: 'none',
    name: '原图',
    icon: RotateCcw,
    style: {},
  },
  {
    id: 'grayscale',
    name: '黑白',
    icon: Contrast,
    style: { filter: 'grayscale(100%)' },
  },
  {
    id: 'sepia',
    name: '复古',
    icon: Sun,
    style: { filter: 'sepia(80%) contrast(1.1)' },
  },
  {
    id: 'high-contrast',
    name: '高对比',
    icon: Contrast,
    style: { filter: 'contrast(1.4) brightness(0.9)' },
  },
  {
    id: 'vintage',
    name: '胶片',
    icon: Droplets,
    style: { filter: 'sepia(30%) contrast(1.2) saturate(0.8)' },
  },
  {
    id: 'cool',
    name: '冷调',
    icon: Sun,
    style: { filter: 'saturate(0.9) hue-rotate(180deg) brightness(1.1)' },
  },
  {
    id: 'warm',
    name: '暖调',
    icon: Sun,
    style: { filter: 'saturate(1.1) hue-rotate(-15deg) brightness(1.05)' },
  },
];

interface ImageFiltersProps {
  onFilterChange: (filter: FilterType) => void;
  currentFilter: FilterType;
  className?: string;
}

const ImageFilters = ({ onFilterChange, currentFilter, className = '' }: ImageFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
          isOpen
            ? 'bg-white text-black'
            : 'bg-white/10 text-white/80 hover:bg-white/20'
        }`}
        title="图片滤镜"
      >
        <Sliders size={18} />
      </button>

      {/* Filter panel */}
      {isOpen && (
        <div className="absolute top-12 right-0 z-50 p-3 rounded-xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="flex flex-col gap-2">
            {filters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => {
                    onFilterChange(filter.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                    currentFilter === filter.id
                      ? 'bg-white text-black'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm whitespace-nowrap">{filter.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ImageFilters;
export { filters };
