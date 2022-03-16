import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { identifierOptions } from '../../../../constants/optionsRecordIdentifiers';

export const ListSelect = ({ disabled, onChange, capabilities }) => {
  const intl = useIntl();
  const location = useLocation();

  let option;

  const getOption = (recordType) => {
    const options = identifierOptions[recordType].map((el) => ({
      value: el.value,
      label: intl.formatMessage({ id: el.label }),
      disabled: el.disabled,
    }));

    option = options[0].value;

    return options;
  };

  const defaultIdentifier = useMemo(() => {
    const identifier = new URLSearchParams(location.search).get('identifier');

    return identifier || option;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <Select
      dataOptions={getOption(capabilities)}
      arial-label={intl.formatMessage({ id: 'ui-bulk-edit.list.filters.recordIdentifier' })}
      label={<FormattedMessage id="ui-bulk-edit.list.filters.recordIdentifier" />}
      defaultValue={defaultIdentifier}
      onChange={onChange}
      disabled={disabled}
    />
  );
};

ListSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  capabilities: PropTypes.string,
};
