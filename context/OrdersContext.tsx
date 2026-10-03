import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { CartItem } from "@/context/CartContext";

export interface Order {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  items: CartItem[];
  totalPrice: number;
  status: "pending" | "confirmed" | "ready" | "completed" | "cancelled";
  createdAt: string;
}

interface OrdersContextType {
  orders: Order[];
  placeOrder: (pharmacyId: string, pharmacyName: string, items: CartItem[], total: number) => Order;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const ORDERS_KEY = "mypharma_orders";

const DEMO_ORDERS: Order[] = [
  {
    id: "ord_1",
    pharmacyId: "p1",
    pharmacyName: "Pharmacie du Plateau",
    items: [
      {
        id: "ci1",
        medicineId: "m1",
        medicineName: "Paracétamol 500mg",
        pharmacyId: "p1",
        pharmacyName: "Pharmacie du Plateau",
        price: 500,
        quantity: 2,
        unit: "boîte",
      },
    ],
    totalPrice: 1000,
    status: "completed",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ord_2",
    pharmacyId: "p2",
    pharmacyName: "Pharmacie Cocody Centre",
    items: [
      {
        id: "ci2",
        medicineId: "m3",
        medicineName: "Artémether-Luméfantrine",
        pharmacyId: "p2",
        pharmacyName: "Pharmacie Cocody Centre",
        price: 3800,
        quantity: 1,
        unit: "boîte",
      },
    ],
    totalPrice: 3800,
    status: "confirmed",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(ORDERS_KEY).then((data) => {
      if (data) {
        setOrders(JSON.parse(data));
      } else {
        setOrders(DEMO_ORDERS);
        AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(DEMO_ORDERS));
      }
    });
  }, []);

  const placeOrder = useCallback(
    (pharmacyId: string, pharmacyName: string, items: CartItem[], total: number): Order => {
      const order: Order = {
        id: "ord_" + Date.now().toString(),
        pharmacyId,
        pharmacyName,
        items,
        totalPrice: total,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setOrders((prev) => {
        const updated = [order, ...prev];
        AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
        return updated;
      });
      return order;
    },
    []
  );

  return (
    <OrdersContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
