import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { identifierOptions } from '../../../../constants/optionsRecordIdentifiers';

export const ListSelect = ({ disabled, hanldeRecordIdentifier }) => {
  const intl = useIntl();
  const location = useLocation();

  const options = identifierOptions.map((el) => ({
    value: el.value,
    label: intl.formatMessage({ id: el.label }),
    disabled: el.disabled,
  }));

  const defaultIdentifier = useMemo(() => {
    const identifier = new URLSearchParams(location.search).get('identifier');

    return identifier || options[0].value;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <Select
      dataOptions={options}
      arial-label={intl.formatMessage({ id: 'ui-bulk-edit.list.filters.recordIdentifier' })}
      label={<FormattedMessage id="ui-bulk-edit.list.filters.recordIdentifier" />}
      defaultValue={defaultIdentifier}
      onChange={hanldeRecordIdentifier}
      disabled={disabled}
    />
  );
};

ListSelect.propTypes = {
  hanldeRecordIdentifier: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
