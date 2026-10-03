import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { showAlert } from "@/lib/alert";

export interface CartItem {
  id: string;
  medicineId: string;
  medicineName: string;
  pharmacyId: string;
  pharmacyName: string;
  price: number;
  quantity: number;
  unit: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "mypharma_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(CART_KEY).then((data) => {
      if (data) setItems(JSON.parse(data));
    });
  }, []);

  const persist = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    AsyncStorage.setItem(CART_KEY, JSON.stringify(newItems));
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, "id">) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) =>
            i.medicineId === item.medicineId &&
            i.pharmacyId === item.pharmacyId
        );
        let updated: CartItem[];
        if (existing) {
          updated = prev.map((i) =>
            i.id === existing.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
          updated = [...prev, { ...item, id }];
        }
        AsyncStorage.setItem(CART_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const removeItem = useCallback(
    (id: string) => {
      setItems((prev) => {
        const updated = prev.filter((i) => i.id !== id);
        AsyncStorage.setItem(CART_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) => {
      const updated =
        quantity <= 0
          ? prev.filter((i) => i.id !== id)
          : prev.map((i) => (i.id === id ? { ...i, quantity } : i));
      AsyncStorage.setItem(CART_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

/**
 * Adds an item to the cart, which can only hold one pharmacy's items at a time
 * (checkout creates a single order). If the item comes from another pharmacy,
 * ask before replacing the cart. `onAdded` runs once the item is in the cart.
 */
export function useAddToCart() {
  const { items, addItem, clearCart } = useCart();

  return useCallback(
    (item: Omit<CartItem, "id">, onAdded?: () => void) => {
      const current = items[0];
      if (current && current.pharmacyId !== item.pharmacyId) {
        showAlert(
          "Changer de pharmacie ?",
          `Votre panier contient des articles de ${current.pharmacyName}. Voulez-vous le vider pour commander chez ${item.pharmacyName} ?`,
          [
            { text: "Annuler", style: "cancel" },
            {
              text: "Vider le panier",
              style: "destructive",
              onPress: () => {
                clearCart();
                addItem(item);
                onAdded?.();
              },
            },
          ]
        );
        return;
      }
      addItem(item);
      onAdded?.();
    },
    [items, addItem, clearCart]
  );
}
