import {
  getInventoryResultsFormatter,
  getUserResultsFormatter,
  getHoldingsResultsFormatterBase,
} from '../constants/formatters';
import {
  CAPABILITIES, INVENTORY_COLUMNS,
  itemColumnInAppWidths,
  USER_COLUMNS,
  userColumnInAppWidths,
  HOLDINGS_COLUMNS,
  holdingsColumnInAppWidths,
} from '../constants';
import { useUserGroupsMap } from '../API';

export const useInAppColumnsInfo = ({ capability }) => {
  const { userGroups } = useUserGroupsMap();

  let formatter;
  let baseColumns;
  let columnWidths;

  switch (capability) {
    case CAPABILITIES.USER:
      formatter = getUserResultsFormatter(userGroups);
      baseColumns = USER_COLUMNS;
      columnWidths = userColumnInAppWidths;
      break;
    case CAPABILITIES.ITEM:
      formatter = getInventoryResultsFormatter();
      baseColumns = INVENTORY_COLUMNS;
      columnWidths = itemColumnInAppWidths;
      break;
    case CAPABILITIES.HOLDINGS:
    default:
      formatter = getHoldingsResultsFormatterBase();
      baseColumns = HOLDINGS_COLUMNS;
      columnWidths = holdingsColumnInAppWidths;
      break;
  }

  const columns = Object.keys(formatter);
  const columnMapping = baseColumns.reduce((acc, el) => {
    acc[el.value] = el.label;

    return acc;
  }, {});

  return {
    columns,
    columnMapping,
    columnWidths,
    formatter,
  };
};
