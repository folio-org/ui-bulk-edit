import React from 'react';
import { listHoldings, listItems, listUsers } from '../../test/jest/__mock__/fakeData';
import { CAPABILITIES } from '../constants';

// will be replaced with API call
export const useRetrievedDataList = ({ capability }) => {
  const capabilityMap = {
    [CAPABILITIES.USER]: listUsers,
    [CAPABILITIES.ITEM]: listItems,
    [CAPABILITIES.HOLDINGS]: listHoldings,
  };

  return capabilityMap[capability];
};
