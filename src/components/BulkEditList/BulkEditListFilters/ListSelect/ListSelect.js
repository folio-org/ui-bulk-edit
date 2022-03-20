import { memo } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { identifierOptions } from '../../../../constants/optionsRecordIdentifiers';

export const ListSelect = memo(({ value, disabled, onChange, capabilities }) => {
  const intl = useIntl();
  const location = useLocation();

  const options = identifierOptions[capabilities].map((el) => ({
    value: el.value,
    label: intl.formatMessage({ id: el.label }),
    disabled: el.disabled,
  }));

  const identifier = new URLSearchParams(location.search).get('identifier') || value;

  return (
    <Select
      dataOptions={options}
      arial-label={intl.formatMessage({ id: 'ui-bulk-edit.list.filters.recordIdentifier' })}
      label={<FormattedMessage id="ui-bulk-edit.list.filters.recordIdentifier" />}
      value={identifier}
      onChange={onChange}
      disabled={disabled}
    />
  );
});

ListSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  defaultIdentifier: PropTypes.func,
  disabled: PropTypes.bool,
  capabilities: PropTypes.string,
};
