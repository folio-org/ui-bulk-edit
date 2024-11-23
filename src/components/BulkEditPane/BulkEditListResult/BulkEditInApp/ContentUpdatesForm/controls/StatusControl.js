import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { FIELD_VALUE_KEY, getLabelByValue } from '../helpers';
import { getItemStatusOptions } from '../../../../../../constants';


export const StatusControl = ({ actionValue, actionIndex, onChange }) => {
  const { formatMessage } = useIntl();

  const statuses = getItemStatusOptions(formatMessage);
  const title = getLabelByValue(statuses, actionValue);

  return (
    <div title={title}>
      <Select
        dataOptions={statuses}
        value={actionValue}
        onChange={e => onChange({
          actionIndex,
          value: e.target.value,
          fieldName: FIELD_VALUE_KEY
        })}
        data-testid={`select-statuses-${actionIndex}`}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.statusSelect' })}
        marginBottom0
        dirty={!!actionValue}
      />
    </div>
  );
};

StatusControl.propTypes = {
  actionValue: PropTypes.string,
  actionIndex: PropTypes.number,
  onChange: PropTypes.func,
};
