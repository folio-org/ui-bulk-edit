import { useCallback, useState } from 'react';

import { APPROACHES } from '../constants';
import { useSearchParams } from './useSearchParams';

export const useInAppApproach = () => {
  const { setParam } = useSearchParams();
  const [isInAppLayerOpen, setIsInAppLayerOpen] = useState(false);
  const [isPreviewModalOpened, setIsPreviewModalOpened] = useState(false);

  const openInAppLayer = useCallback(() => {
    setIsInAppLayerOpen(true);
    setParam('approach', APPROACHES.IN_APP);
  }, [setParam]);

  const closeInAppLayer = useCallback(() => {
    setIsInAppLayerOpen(false);
    setParam('approach', null);
  }, [setParam]);

  const openInAppPreviewModal = useCallback(() => {
    setIsPreviewModalOpened(true);
  }, []);

  const closeInAppPreviewModal = useCallback(() => {
    setIsPreviewModalOpened(false);
  }, []);

  return {
    isInAppLayerOpen,
    setIsInAppLayerOpen,
    isPreviewModalOpened,
    setIsPreviewModalOpened,
    closeInAppLayer,
    openInAppLayer,
    openInAppPreviewModal,
    closeInAppPreviewModal,
  };
};
