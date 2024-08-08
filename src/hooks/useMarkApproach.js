import { useCallback, useState } from 'react';
import uniqueId from 'lodash/uniqueId';
import {
  getDefaultMarkTemplate,
} from '../components/BulkEditPane/BulkEditListResult/BulkEditMark/helpers';
import { getMarkFormErrors } from '../components/BulkEditPane/BulkEditListResult/BulkEditMark/validation';
import { useSearchParams } from './useSearchParams';
import { APPROACHES } from '../constants';

const initialFields = [getDefaultMarkTemplate(uniqueId())];

export const useMarkApproach = () => {
  const { setParam } = useSearchParams();
  const [fields, setFields] = useState(initialFields);
  const [isMarkLayerOpen, setIsMarkLayerOpen] = useState(false);

  const errors = getMarkFormErrors(fields);
  const isMarkFieldsValid = Object.keys(errors).length === 0;

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
    isMarkFieldsValid,
  };
};
