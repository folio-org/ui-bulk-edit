import { useLocation } from 'react-router-dom';
import { CAPABILITIES, HOLDINGS_COLUMNS, INVENTORY_COLUMNS, USER_COLUMNS } from '../constants';
import {
  getHoldingsResultsFormatter,
  getInventoryResultsFormatter,
  getUserResultsFormatter,
} from '../constants/formatters';

export const useCurrentEntityInfo = ({ userGroups } = {}) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  let columns;
  let resultsFormatter;

  switch (searchParams.get('capabilities')) {
    case CAPABILITIES.ITEM:
      columns = INVENTORY_COLUMNS;
      resultsFormatter = getInventoryResultsFormatter();
      break;
    case CAPABILITIES.HOLDINGS:
      columns = HOLDINGS_COLUMNS;
      resultsFormatter = getHoldingsResultsFormatter();
      break;
    case CAPABILITIES.USER:
    default:
      columns = USER_COLUMNS;
      resultsFormatter = getUserResultsFormatter(userGroups);
      break;
  }

  return {
    location,
    columns,
    resultsFormatter,
    searchParams,
  };
};
