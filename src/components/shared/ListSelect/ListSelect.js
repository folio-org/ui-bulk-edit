import { memo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { Select, Tooltip } from '@folio/stripes/components';

import { useStripes } from '@folio/stripes/core';
import { identifierOptions } from '../../../constants';

export const ListSelect = memo(({
  value = '',
  capabilities = '',
  disabled,
  onChange,
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

  const isCapabilitySelected = capabilities !== '';
  const isDisabled = !isCapabilitySelected || disabled;

  const selectField = (
    <Select
      dataOptions={options}
      arial-label={intl.formatMessage({ id: 'ui-bulk-edit.list.filters.recordIdentifier' })}
      label={<FormattedMessage id="ui-bulk-edit.list.filters.recordIdentifier" />}
      value={value}
      onChange={onChange}
      disabled={isDisabled}
      required={isCapabilitySelected}
    />
  );

  if (!isCapabilitySelected) {
    return (
      <Tooltip
        id="record-identifier-tooltip"
        text={<FormattedMessage id="ui-bulk-edit.list.filters.recordIdentifier.tooltip" />}
      >
        {({ ref, ariaIds }) => (
          <div ref={ref} aria-labelledby={ariaIds.text}>
            {selectField}
          </div>
        )}
      </Tooltip>
    );
  }

  return selectField;
});

ListSelect.propTypes = {
  value: PropTypes.string,
  disabled: PropTypes.bool,
  capabilities: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
