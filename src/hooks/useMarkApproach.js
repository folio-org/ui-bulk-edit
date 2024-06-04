import { useCallback, useState } from 'react';
import uniqueId from 'lodash/uniqueId';
import {
  getDefaultMarkTemplate,
  isMarkFormValid
} from '../components/BulkEditPane/BulkEditListResult/BulkEditMark/helpers';
import { useSearchParams } from './useSearchParams';
import { APPROACHES } from '../constants';

const initialFields = [getDefaultMarkTemplate(uniqueId())];

export const useMarkApproach = () => {
  const { setParam } = useSearchParams();
  const [fields, setFields] = useState(initialFields);
  const [isMarkLayerOpen, setIsMarkLayerOpen] = useState(false);

  const isMarkFieldsValid = isMarkFormValid(fields);

  const closeMarkLayer = useCallback(() => {
    setIsMarkLayerOpen(false);
    setFields(initialFields);
    setParam('approach', null);
  }, [setParam]);

  const openMarkLayer = useCallback(() => {
    setIsMarkLayerOpen(true);
    setParam('approach', APPROACHES.MARK);
  }, [setParam]);

  return {
    fields,
    setFields,
    isMarkLayerOpen,
    setIsMarkLayerOpen,
    closeMarkLayer,
    openMarkLayer,
    isMarkFieldsValid
  };
};
