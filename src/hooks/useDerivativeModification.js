import { useEffect } from 'react';
import { ACTIONS } from '../constants';

export const useDerivativeModification = ({ actionParameters, action, name, path, onChange }) => {
  useEffect(() => {
    if ([ACTIONS.SET_TO_TRUE, ACTIONS.SET_TO_FALSE].includes(action)) {
      onChange({
        path,
        name,
        val: actionParameters?.map((param) => ({ ...param, value: action === ACTIONS.SET_TO_TRUE })),
      });
    }
  },
  // Here we disabled that rule, coz update of deps will lead to maximum deps update
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [action]);
};
