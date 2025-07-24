import difference from 'lodash/difference';
import { FormattedMessage } from 'react-intl';

import {
  ASC_DIRECTION,
  SORTING_DIRECTION_PARAMETER,
  SORTING_PARAMETER,
} from '@folio/stripes-acq-components';

export const COLUMNS = {
  name: 'name',
  description: 'description',
  updatedDate: 'updatedDate',
  updatedBy: 'updatedBy',
  status: 'status',
};

export const COLUMN_MAPPING = {
  [COLUMNS.name]: <FormattedMessage id="ui-bulk-edit.settings.profiles.columns.name" />,
  [COLUMNS.description]: <FormattedMessage id="ui-bulk-edit.settings.profiles.columns.description" />,
  [COLUMNS.updatedDate]: <FormattedMessage id="ui-bulk-edit.settings.profiles.columns.updated" />,
  [COLUMNS.updatedBy]: <FormattedMessage id="ui-bulk-edit.settings.profiles.columns.updatedBy" />,
  [COLUMNS.status]: <FormattedMessage id="ui-bulk-edit.settings.profiles.columns.status" />,
};

export const COLUMN_WIDTHS = {
  [COLUMNS.name]: '20%',
  [COLUMNS.description]: '35%',
  [COLUMNS.updatedDate]: '125px',
  [COLUMNS.updatedBy]: '20%',
  [COLUMNS.status]: '80px',
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
  searchIndexes: [
    COLUMNS.name,
    COLUMNS.description,
    'userFullName',
  ],
};

export const NON_INTERACTIVE_HEADERS = [COLUMNS.description, COLUMNS.status];
export const SORTABLE_COLUMNS = difference(VISIBLE_COLUMNS, NON_INTERACTIVE_HEADERS);

export const PROFILE_DETAILS_ACCORDIONS = {
  SUMMARY: 'summary',
};
