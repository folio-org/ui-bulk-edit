import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { getLabelByValue } from '../../helpers';
import { getDuplicateNoteOptions } from '../../../../../../constants';
import { usePreselectedValue } from '../../../../../../hooks/usePreselectedValue';


export const DuplicateNoteControl = ({ option, value, controlType, name, path, onChange }) => {
  const { formatMessage } = useIntl();

  const duplicateNoteOptions = getDuplicateNoteOptions(formatMessage).filter(el => el.value !== option);
  const title = getLabelByValue(duplicateNoteOptions, value);

  usePreselectedValue(controlType, duplicateNoteOptions, onChange, path);

  return (
    <div title={title}>
      <Select
        id="noteTypeDuplicate"
        value={value}
        disabled
        onChange={e => onChange({ path, val: e.target.value, name })}
        dataOptions={duplicateNoteOptions}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.duplicateSelect' })}
        marginBottom0
        dirty={!!value}
      />
    </div>
  );
};

DuplicateNoteControl.propTypes = {
  option: PropTypes.string,
  value: PropTypes.string,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  name: PropTypes.string,
  controlType: PropTypes.string,
  onChange: PropTypes.func,
};
