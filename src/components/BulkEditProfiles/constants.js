import { FormattedMessage } from 'react-intl';

import {
  ASC_DIRECTION,
  SORTING_DIRECTION_PARAMETER,
  SORTING_PARAMETER,
} from '@folio/stripes-acq-components';

export const COLUMNS = {
  name: 'name',
  description: 'description',
  updated: 'updated',
  updatedBy: 'updatedBy',
  status: 'status',
};

export const COLUMN_MAPPING = {
  [COLUMNS.name]: <FormattedMessage id="ui-bulk-edit.settings.profiles.columns.name" />,
  [COLUMNS.description]: <FormattedMessage id="ui-bulk-edit.settings.profiles.columns.description" />,
  [COLUMNS.updated]: <FormattedMessage id="ui-bulk-edit.settings.profiles.columns.updated" />,
  [COLUMNS.updatedBy]: <FormattedMessage id="ui-bulk-edit.settings.profiles.columns.updatedBy" />,
  [COLUMNS.status]: <FormattedMessage id="ui-bulk-edit.settings.profiles.columns.status" />,
};

export const VISIBLE_COLUMNS = Object.keys(COLUMN_MAPPING);

export const DEFAULT_SORTING = {
  [SORTING_PARAMETER]: COLUMNS.name,
  [SORTING_DIRECTION_PARAMETER]: ASC_DIRECTION,
};

export const FILTER_SORT_CONFIG = {
  sortingConfig: {
    name: { type: 'string' },
    description: { type: 'string' },
    updatedDate: { type: 'date' },
    updatedBy: {
      field: 'userFullName',
      type: 'string',
    },
    status: { type: 'string' },
  },
  searchIndexes: Object.values(COLUMNS),
};
