import { useEffect } from 'react';
import { ACTIONS } from '../constants';
import {
  ACTION_PARAMETERS_KEY,
} from '../components/BulkEditPane/BulkEditListResult/BulkEditInApp/ContentUpdatesForm/helpers';

export const useDerivativeModification = ({ onChange, action, actionIndex }) => {
  useEffect(() => {
    if ([ACTIONS.SET_TO_TRUE, ACTIONS.SET_TO_FALSE].includes(action.name)) {
      onChange({
        actionIndex,
        value: action.parameters?.map((param) => ({ ...param, value: action.name === ACTIONS.SET_TO_TRUE })),
        fieldName: ACTION_PARAMETERS_KEY
      });
    }
  },
  // Here we disabled that rule, coz update of deps will lead to maximum deps update
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [action.name]);
};
