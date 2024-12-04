import { useCallback, useState } from 'react';

import { useSearchParams } from './useSearchParams';
import { APPROACHES } from '../constants';


export const useMarcApproach = () => {
  const { setParam } = useSearchParams();

  const [isMarcLayerOpen, setIsMarcLayerOpen] = useState(false);

  const closeMarcLayer = useCallback(() => {
    setIsMarcLayerOpen(false);
    // setMarcFields(initialFields);
    setParam('approach', null);
  }, [setParam]);

  const openMarcLayer = useCallback(() => {
    setIsMarcLayerOpen(true);
    setParam('approach', APPROACHES.MARC);
  }, [setParam]);

  return {
    isMarcLayerOpen,
    setIsMarcLayerOpen,
    closeMarcLayer,
    openMarcLayer,
  };
};
