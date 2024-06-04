import { useCallback, useState } from 'react';

import {
  isContentUpdatesFormValid
} from '../components/BulkEditPane/BulkEditListResult/BulkEditInApp/ContentUpdatesForm/helpers';
import { APPROACHES } from '../constants';
import { useSearchParams } from './useSearchParams';

export const useInAppApproach = () => {
  const { setParam } = useSearchParams();
  const [contentUpdates, setContentUpdates] = useState(null);
  const [isInAppLayerOpen, setIsInAppLayerOpen] = useState(false);
  const [isPreviewModalOpened, setIsPreviewModalOpened] = useState(false);

  const isInAppFormValid = isContentUpdatesFormValid(contentUpdates);

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

  const closePreviewAndLayer = useCallback(() => {
    closeInAppPreviewModal();
    setIsInAppLayerOpen(false);
  }, [closeInAppPreviewModal]);

  return {
    contentUpdates,
    setContentUpdates,
    isInAppLayerOpen,
    setIsInAppLayerOpen,
    isPreviewModalOpened,
    setIsPreviewModalOpened,
    closeInAppLayer,
    openInAppLayer,
    openInAppPreviewModal,
    closeInAppPreviewModal,
    closePreviewAndLayer,
    isInAppFormValid
  };
};
