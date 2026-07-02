import { useCallback, useState } from 'react';

import { useSearchParams } from './useSearchParams';
import { APPROACHES } from '../constants';

export const useDeleteApproach = () => {
  const { setParam } = useSearchParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openDeleteModal = useCallback(() => {
    setParam('approach', APPROACHES.DELETE);
    setIsDeleteModalOpen(true);
  }, [setParam]);

  const closeDeleteModal = useCallback(() => {
    setParam('approach', null);
    setIsDeleteModalOpen(false);
  }, [setParam]);

  return {
    isDeleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
  };
};

