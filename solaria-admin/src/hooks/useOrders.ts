import { useState, useEffect, useCallback, useRef } from 'react';
import { orderService } from '@/services/orderService';
import { Order } from '@/types/order';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null); // Clear previous error before fetching
      const data = await orderService.getAll();

      // Handle case when data is null, undefined, or not an array
      if (!data || !Array.isArray(data)) {
        setOrders([]);
        return;
      }

      // Backend actually returns [{ order: {...}, order_items: [...] }]
      // Flatten it so components can render `row.order_code`
      const flattenedOrders = data.map((d: any) => {
        if (d && d.order) {
          return { ...d.order, items: d.order_items || [] };
        }
        return d;
      });

      // Only keep paid orders (or as the data returns)
      const paidOrders = flattenedOrders.filter((o: any) => o && o.payment_status === 'paid');
      setOrders(paidOrders);

      // Only set error if there's a genuine error, not for empty results
      // No error for empty orders - that's a valid state
    } catch (err) {
      console.error('Error fetching orders:', err);
      // Only set error for actual failures (network, auth, etc.)
      // Don't set error for empty results
      setError('Failed to fetch orders');
      setOrders([]); // Ensure orders is empty array on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    // Setup WebSocket
    const connectWs = () => {
      // If no valid URL, fallback gracefully
      if (!WS_URL) return;

      let wsUrl = WS_URL;
      if (wsUrl.startsWith("http://")) wsUrl = wsUrl.replace("http://", "ws://");
      else if (wsUrl.startsWith("https://")) wsUrl = wsUrl.replace("https://", "wss://");

      const ws = new WebSocket(`${wsUrl}/admin/1`);

      ws.onopen = () => {
        console.log('Connected to WebSocket');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket received:', data);

          if (data.type === 'new_order') {
            const orderPayload = data.order || data.payload;
            const newOrder = orderPayload?.order ? { ...orderPayload.order, items: orderPayload.order_items || [] } : orderPayload;

            if (newOrder && newOrder.payment_status === 'paid') {
              setOrders((prev) => [newOrder, ...prev]);
            }
          }
          else if (data.type === 'order_status_update') {
            setOrders((prev) => prev.map(o =>
              o.order_code === data.order_code
                ? { ...o, status: data.status }
                : o
            ));
          }
          else if (data.type === 'order_scanned') {
            console.log('Order scanned:', data.order_code);
          }
        } catch (e) {
          console.error("Error parsing WS message", e);
        }
      };

      ws.onclose = () => {
        console.log('Disconnected from WebSocket. Reconnecting in 3s...');
        setTimeout(connectWs, 3000);
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        ws.close();
      };

      wsRef.current = ws;
    };

    connectWs();

    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [fetchOrders]);

  return { orders, isLoading, error, refetch: fetchOrders };
};