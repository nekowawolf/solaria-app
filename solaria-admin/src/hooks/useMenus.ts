import { useState, useEffect, useCallback } from 'react';
import { menuService } from '@/services/menuService';
import { Menu } from '@/types/menu';

export const useMenus = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await menuService.getAll();
      setMenus(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch menus');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  return { menus, isLoading, error, refetch: fetchMenus };
};