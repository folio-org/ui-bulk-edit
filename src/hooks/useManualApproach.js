import { useCallback, useState } from 'react';

import { useSearchParams } from './useSearchParams';
import { APPROACHES } from '../constants';

export const useManualApproach = () => {
  const { setParam } = useSearchParams();
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);

  const openManualModal = useCallback(() => {
    setParam('approach', APPROACHES.MANUAL);
    setIsBulkEditModalOpen(true);
  }, [setParam]);

  const closeManualModal = useCallback(() => {
    setParam('approach', null);
    setIsBulkEditModalOpen(false);
  }, [setParam]);

  return {
    isBulkEditModalOpen,
    openManualModal,
    closeManualModal,
  };
};
