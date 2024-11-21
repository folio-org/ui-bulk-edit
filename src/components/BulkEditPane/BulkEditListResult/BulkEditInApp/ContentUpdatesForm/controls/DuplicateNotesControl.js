import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { FIELD_VALUE_KEY, getLabelByValue } from '../helpers';
import { getDuplicateNoteOptions } from '../../../../../../constants';
import { usePreselectedValue } from '../../../../../../hooks/usePreselectedValue';


export const DuplicateNoteControl = ({ option, action, actionIndex, onChange }) => {
  const { formatMessage } = useIntl();

  const duplicateNoteOptions = getDuplicateNoteOptions(formatMessage).filter(el => el.value !== option);
  const controlType = action.controlType(action.name);
  const title = getLabelByValue(duplicateNoteOptions, action.value);

  usePreselectedValue(controlType, duplicateNoteOptions, onChange, actionIndex);

  return (
    <div title={title}>
      <Select
        id="noteTypeDuplicate"
        value={action.value}
        disabled
        onChange={e => onChange({
          actionIndex,
          value: e.target.value,
          fieldName: FIELD_VALUE_KEY
        })}
        dataOptions={duplicateNoteOptions}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.loanTypeSelect' })}
        marginBottom0
        dirty={!!action.value}
      />
    </div>
  );
};

DuplicateNoteControl.propTypes = {
  option: PropTypes.string,
  action: PropTypes.object,
  actionIndex: PropTypes.number,
  onChange: PropTypes.func,
};
