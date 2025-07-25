import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Loading, Select } from '@folio/stripes/components';

import { getLabelByValue, sortWithoutPlaceholder } from '../../helpers';
import { getInstanceNotes } from '../../../../../../constants';
import { useInstanceNotes } from '../../../../../../hooks/api';


export const InstanceNotesControl = ({ parameters, option, value, path, name, disabled, onChange }) => {
  const { formatMessage } = useIntl();

  const { instanceNotes, isInstanceNotesLoading } = useInstanceNotes();

  const filteredAndMappedInstanceNotes = getInstanceNotes(formatMessage, instanceNotes)
    .filter(obj => (parameters ? !parameters.map(param => param.value).includes(obj.value) : obj.value !== option))
    .map(({ label, value: val, disabled: disabledValue }) => ({ label, value: val, disabled: disabledValue }));
  const sortedInstanceNotes = sortWithoutPlaceholder(filteredAndMappedInstanceNotes);
  const title = getLabelByValue(sortedInstanceNotes, value);

  if (isInstanceNotesLoading) return <Loading size="large" />;

  return (
    <div title={title}>
      <Select
        id="noteInstanceType"
        value={value}
        onChange={e => onChange({
          path,
          name,
          val: e.target.value,
        })}
        dataOptions={sortedInstanceNotes}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.instanceNotes' })}
        marginBottom0
        dirty={!!value}
        disabled={disabled}
      />
    </div>
  );
};

InstanceNotesControl.propTypes = {
  option: PropTypes.string,
  parameters: PropTypes.arrayOf(PropTypes.shape({})),
  value: PropTypes.string,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};
