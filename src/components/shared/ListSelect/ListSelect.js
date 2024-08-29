import { memo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { Select } from '@folio/stripes/components';

import { useStripes } from '@folio/stripes/core';
import { identifierOptions } from '../../../constants';

export const ListSelect = memo(({
  value = '',
  capabilities = '',
  disabled,
  onChange
}) => {
  const intl = useIntl();
  const stripes = useStripes();
  const isCentralTenant = stripes.user?.user?.consortium?.centralTenantId;
  const tenantId = stripes.okapi.tenant;

  const options = identifierOptions[capabilities]?.filter((el) => {
    return !(isCentralTenant === tenantId && el.isIgnoredInCentralTenant);
  }).map((el) => ({
    value: el.value,
    label: intl.formatMessage({ id: el.label }),
    disabled: el.disabled,
  }));

  const isDisabled = capabilities === '' ? true : disabled;

  return (
    <Select
      dataOptions={options}
      arial-label={intl.formatMessage({ id: 'ui-bulk-edit.list.filters.recordIdentifier' })}
      label={<FormattedMessage id="ui-bulk-edit.list.filters.recordIdentifier" />}
      value={value}
      onChange={onChange}
      disabled={isDisabled}
    />
  );
});

ListSelect.propTypes = {
  value: PropTypes.string,
  disabled: PropTypes.bool,
  capabilities: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
