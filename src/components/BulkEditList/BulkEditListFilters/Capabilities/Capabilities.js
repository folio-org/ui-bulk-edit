import React from 'react';
import { Accordion, FilterAccordionHeader, RadioButton, RadioButtonGroup } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const Capabilities = ({
  capabilitiesFilterOptions,
  onCapabilityChange,
  capabilities,
  hasInAppEditPerms,
}) => {
  return (
    <Accordion
      separator={false}
      closedByDefault={false}
      displayClearButton={!hasInAppEditPerms}
      header={FilterAccordionHeader}
      label={<FormattedMessage id="ui-bulk-edit.list.filters.capabilities.title" />}
    >
      <RadioButtonGroup
        aria-labelledby="record-types"
      >
        {capabilitiesFilterOptions?.map(option => (
          !option.hidden && (
            <RadioButton
              key={option.value}
              label={option.label}
              name="capabilities"
              value={option.value}
              disabled={option.disabled}
              onChange={onCapabilityChange}
              checked={option.value === capabilities}
            />
          )
        ))}
      </RadioButtonGroup>
    </Accordion>
  );
};

Capabilities.propTypes = {
  capabilitiesFilterOptions: PropTypes.arrayOf(PropTypes.object),
  onCapabilityChange: PropTypes.func,
  capabilities: PropTypes.string,
  hasInAppEditPerms: PropTypes.bool,
};
export default Capabilities;
