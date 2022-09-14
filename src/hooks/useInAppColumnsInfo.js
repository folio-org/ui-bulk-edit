import {
  getInventoryResultsFormatter,
  getUserResultsFormatter,
} from '../constants/formatters';
import {
  CAPABILITIES, INVENTORY_COLUMNS,
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
      formatter = getInventoryResultsFormatter();
      baseColumns = INVENTORY_COLUMNS;
      columnWidths = itemColumnInAppWidths;
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
