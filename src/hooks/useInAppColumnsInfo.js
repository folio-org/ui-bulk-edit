import {
  getInventoryResultsFormatterBase,
  getUserResultsFormatter,
  getHoldingsResultsFormatterBase,
} from '../constants/formatters';
import {
  CAPABILITIES,
  INVENTORY_COLUMNS_BASE,
  itemColumnInAppWidths,
  USER_COLUMNS,
  userColumnInAppWidths,
  HOLDINGS_COLUMNS_BASE,
  holdingsColumnInAppWidths,
} from '../constants';

export const useInAppColumnsInfo = ({
  capability,
  userGroups,
}) => {
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
      formatter = getInventoryResultsFormatterBase();
      baseColumns = INVENTORY_COLUMNS_BASE;
      columnWidths = itemColumnInAppWidths;
      break;
    case CAPABILITIES.HOLDINGS:
    default:
      formatter = getHoldingsResultsFormatterBase();
      baseColumns = HOLDINGS_COLUMNS_BASE;
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
