import React from 'react';
import { Button } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { CRITERIA } from '../../../../constants';
import { useBulkPermissions } from '../../../../hooks';

export const TabsFilter = ({
  criteria,
  hasLogViewPerms,
  onCriteriaChange
}) => {
  const buttonStyleActive = (criteriaToCompare) => (criteria === criteriaToCompare ? 'primary' : 'default');
  const { hasQueryPerms } = useBulkPermissions();

  return (
    <>
      <Button
        buttonStyle={buttonStyleActive(CRITERIA.IDENTIFIER)}
        onClick={() => onCriteriaChange(CRITERIA.IDENTIFIER)}
      >
        <FormattedMessage id="ui-bulk-edit.list.filters.identifier" />
      </Button>
      {/* temporarily commented out because of https://issues.folio.org/browse/UIBULKED-351 */}
      {hasQueryPerms && (
        <Button
          buttonStyle={buttonStyleActive(CRITERIA.QUERY)}
          onClick={() => onCriteriaChange(CRITERIA.QUERY)}
        >
          <FormattedMessage id="ui-bulk-edit.list.filters.query" />
        </Button>
      )}
      {hasLogViewPerms && (
        <Button
          buttonStyle={buttonStyleActive(CRITERIA.LOGS)}
          onClick={() => onCriteriaChange(CRITERIA.LOGS)}
        >
          <FormattedMessage id="ui-bulk-edit.list.filters.logs" />
        </Button>
      )}
    </>
  );
};

TabsFilter.propTypes = {
  criteria: PropTypes.string,
  hasLogViewPerms: PropTypes.bool,
  onCriteriaChange: PropTypes.func,
};
