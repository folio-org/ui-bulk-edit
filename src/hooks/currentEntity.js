import { useLocation } from 'react-router-dom';
import { CAPABILITIES, INVENTORY_COLUMNS, USER_COLUMNS } from '../constants';
import {
  getInventoryResultsFormatter,
  getUserResultsFormatter,
} from '../components/BulkEditList/BulkEditListResult/Preview/PreviewAccordion/formatters';

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
