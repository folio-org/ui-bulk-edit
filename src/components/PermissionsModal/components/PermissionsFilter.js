import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SearchField, FilterAccordionHeader, Accordion, AccordionSet, Button } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import { CheckboxFilter } from '@folio/stripes/smart-components';
import { ResetButton } from '@folio/stripes-acq-components';
import { PERMS_FILTER_OPTIONS, STATUS_FILTER_OPTIONS } from '../constants/filterOptions';
import { FILTER_KEYS } from '../constants/core';

export const PermissionsFilter = ({ filter, onFilter, onClearFilter }) => {
  const [query, setQuery] = useState('');

  const onFormSubmit = (e) => {
    e.stopPropagation();
    e.preventDefault();

    onFilter(FILTER_KEYS.QUERY, query);
  };
  const handleResetAll = () => {
    setQuery('');

    onClearFilter(FILTER_KEYS.ALL);
  };

  return (
    <form onSubmit={onFormSubmit}>
      <SearchField
        data-testid="search-permissions"
        aria-label=""
        name="query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      <Button
        type="submit"
        buttonStyle="primary"
        fullWidth
        disabled={!query}
      >
        <FormattedMessage id="ui-bulk-edit.permissionsModal.filter.search" />
      </Button>

      <ResetButton
        id="reset-export-filters"
        disabled={false}
        reset={handleResetAll}
        label={<FormattedMessage id="ui-bulk-edit.permissionsModal.filter.resetAll" />}
      />
      <AccordionSet>
        <Accordion
          closedByDefault={false}
          displayClearButton
          header={FilterAccordionHeader}
          id="permissions-type-filter"
          name={FILTER_KEYS.PERMISSIONS}
          label={<FormattedMessage id="ui-bulk-edit.permissionsModal.filter.permissionTypes" />}
          onClearFilter={onClearFilter}
        >

          <CheckboxFilter
            dataOptions={PERMS_FILTER_OPTIONS}
            onChange={({ name, values }) => onFilter(name, values)}
            selectedValues={filter[FILTER_KEYS.PERMISSIONS]}
            name={FILTER_KEYS.PERMISSIONS}
          />
        </Accordion>

        <Accordion
          closedByDefault={false}
          displayClearButton
          header={FilterAccordionHeader}
          id="permissions-status-filter"
          name={FILTER_KEYS.STATUSES}
          label={<FormattedMessage id="ui-bulk-edit.permissionsModal.filter.assignmentStatus" />}
          onClearFilter={onClearFilter}
        >

          <CheckboxFilter
            dataOptions={STATUS_FILTER_OPTIONS}
            onChange={({ name, values }) => onFilter(name, values)}
            selectedValues={filter[FILTER_KEYS.STATUSES]}
            name={FILTER_KEYS.STATUSES}
          />
        </Accordion>
      </AccordionSet>
    </form>
  );
};

PermissionsFilter.propTypes = {
  filter: PropTypes.object.isRequired,
  onFilter: PropTypes.func.isRequired,
  onClearFilter: PropTypes.func.isRequired,
};
