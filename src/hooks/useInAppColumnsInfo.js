import {
  getInventoryResultsFormatterBase,
  getUserResultsFormatter,
} from '../constants/formatters';
import {
  CAPABILITIES,
  INVENTORY_COLUMNS_BASE,
  itemColumnInAppWidths,
  USER_COLUMNS,
  userColumnInAppWidths,
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
    default:
      formatter = getInventoryResultsFormatterBase();
      baseColumns = INVENTORY_COLUMNS_BASE;
      columnWidths = itemColumnInAppWidths;
  }

  const visibleColumns = Object.keys(formatter);
  const columnMapping = baseColumns.reduce((acc, el) => {
    acc[el.value] = el.label;

    return acc;
  }, {});

  return {
    visibleColumns,
    columnMapping,
    columnWidths,
    formatter,
  };
};
