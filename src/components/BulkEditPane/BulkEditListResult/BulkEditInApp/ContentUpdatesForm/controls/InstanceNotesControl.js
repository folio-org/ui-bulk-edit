import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { FIELD_VALUE_KEY, getLabelByValue, sortWithoutPlaceholder } from '../helpers';
import { getInstanceNotes } from '../../../../../../constants';
import { useInstanceNotes } from '../../../../../../hooks/api';


export const InstanceNotesControl = ({ option, actionValue, actionIndex, onChange }) => {
  const { formatMessage } = useIntl();

  const { instanceNotes, isInstanceNotesLoading } = useInstanceNotes();

  const filteredAndMappedInstanceNotes = getInstanceNotes(formatMessage, instanceNotes)
    .filter(obj => obj.value !== option)
    .map(({ label, value, disabled }) => ({ label, value, disabled }));
  const sortedInstanceNotes = sortWithoutPlaceholder(filteredAndMappedInstanceNotes);
  const title = getLabelByValue(sortedInstanceNotes, actionValue);

  return (
    <div title={title}>
      <Select
        id="noteInstanceType"
        value={actionValue}
        loading={isInstanceNotesLoading}
        onChange={e => onChange({
          actionIndex,
          value: e.target.value,
          fieldName: FIELD_VALUE_KEY
        })}
        dataOptions={sortedInstanceNotes}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.loanTypeSelect' })}
        marginBottom0
        dirty={!!actionValue}
      />
    </div>
  );
};

InstanceNotesControl.propTypes = {
  option: PropTypes.string,
  actionValue: PropTypes.string,
  actionIndex: PropTypes.number,
  onChange: PropTypes.func,
};
