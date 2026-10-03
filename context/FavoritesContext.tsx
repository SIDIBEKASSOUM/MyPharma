import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface FavoritesContextType {
  favoriteIds: string[];
  isFavorite: (medicineId: string) => boolean;
  toggleFavorite: (medicineId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_KEY = "mypharma_favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_KEY)
      .then((data) => {
        if (data) setFavoriteIds(JSON.parse(data));
      })
      .catch(() => {});
  }, []);

  const toggleFavorite = useCallback((medicineId: string) => {
    setFavoriteIds((prev) => {
      const updated = prev.includes(medicineId)
        ? prev.filter((id) => id !== medicineId)
        : [medicineId, ...prev];
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = useCallback((medicineId: string) => favoriteIds.includes(medicineId), [favoriteIds]);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
