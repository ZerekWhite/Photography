export interface FavoriteItem {
  image: string;
  projectTitle: string;
  category: string;
  timestamp: number;
}

const FAVORITES_KEY = 'cacao-favorites';

export const getFavorites = (): FavoriteItem[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addToFavorites = (item: Omit<FavoriteItem, 'timestamp'>) => {
  try {
    const favorites = getFavorites();
    const exists = favorites.some((f) => f.image === item.image);
    if (!exists) {
      favorites.push({ ...item, timestamp: Date.now() });
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
    return !exists;
  } catch {
    return false;
  }
};

export const removeFromFavorites = (image: string) => {
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter((f) => f.image !== image);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
};

export const isFavorited = (image: string): boolean => {
  const favorites = getFavorites();
  return favorites.some((f) => f.image === image);
};

