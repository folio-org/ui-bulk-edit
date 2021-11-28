import React from 'react';
import { FormattedMessage } from 'react-intl';

export const buildCheckboxFilterOptions = optionsMap => {
  return optionsMap.map(optionValue => ({
    label: <FormattedMessage id={optionValue.label} />,
    value: optionValue.value,
    disabled: optionValue.disabled,
  }));
};
