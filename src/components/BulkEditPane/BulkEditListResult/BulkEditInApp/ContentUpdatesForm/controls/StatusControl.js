import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { getLabelByValue } from '../../helpers';
import { getItemStatusOptions } from '../../../../../../constants';


export const StatusControl = ({ value, path, name, onChange }) => {
  const { formatMessage } = useIntl();

  const statuses = getItemStatusOptions(formatMessage);
  const title = getLabelByValue(statuses, value);

  return (
    <div title={title}>
      <Select
        dataOptions={statuses}
        value={value}
        onChange={e => onChange({
          path,
          val: e.target.value,
          name
        })}
        data-testid={`select-statuses-${path}`}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.statusSelect' })}
        marginBottom0
        dirty={!!value}
      />
    </div>
  );
};

StatusControl.propTypes = {
  value: PropTypes.string,
  path: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
};
