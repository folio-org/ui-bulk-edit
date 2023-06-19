import { useEffect } from 'react';
import { ACTIONS } from '../constants';
import {
  WITH_ITEMS_VALUE_KEY,
} from '../components/BulkEditList/BulkEditListResult/BulkEditInApp/ContentUpdatesForm/helpers';

export const useDerivativeModification = ({ onChange, action, actionIndex, deps }) => {
  useEffect(() => {
    if (action === ACTIONS.SET_TO_TRUE) {
      onChange({ actionIndex, value: true, fieldName: WITH_ITEMS_VALUE_KEY });
    }

    if (action === ACTIONS.SET_TO_FALSE) {
      onChange({ actionIndex, value: false, fieldName: WITH_ITEMS_VALUE_KEY });
    }
  }, [...deps]);
};
