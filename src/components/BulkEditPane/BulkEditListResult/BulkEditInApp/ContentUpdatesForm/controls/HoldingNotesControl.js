import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { checkIfUserInCentralTenant, useStripes } from '@folio/stripes/core';
import { Loading, Select } from '@folio/stripes/components';

import { useBulkOperationTenants, useHoldingsNotes, useHoldingsNotesEcs } from '../../../../../../hooks/api';
import { FIELD_VALUE_KEY, getLabelByValue, sortWithoutPlaceholder } from '../helpers';
import { getTenantsById, removeDuplicatesByValue } from '../../../../../../utils/helpers';
import { getHoldingsNotes } from '../../../../../../constants';


export const HoldingNotesControl = ({ bulkOperationId, option, actionValue, actionIndex, onChange }) => {
  const { formatMessage } = useIntl();
  const stripes = useStripes();

  const isCentralTenant = checkIfUserInCentralTenant(stripes);

  const { data: tenants } = useBulkOperationTenants(bulkOperationId);
  const { notesEcs: holdingsNotesEcs, isFetching: isHoldingsNotesEcsLoading } = useHoldingsNotesEcs(tenants, 'action', { enabled: isCentralTenant });
  const { holdingsNotes, isHoldingsNotesLoading } = useHoldingsNotes();

  const filteredAndMappedHoldingsNotes = getHoldingsNotes(formatMessage, isCentralTenant ? removeDuplicatesByValue(holdingsNotesEcs, tenants) : holdingsNotes)
    .filter(obj => obj.value !== option)
    .map(({ label, value, disabled, tenant }) => ({ label, value, disabled, tenant }));
  const sortedHoldingsNotes = sortWithoutPlaceholder(filteredAndMappedHoldingsNotes);
  const title = getLabelByValue(sortedHoldingsNotes, actionValue);

  if (isHoldingsNotesEcsLoading) return <Loading size="large" />;

  return (
    <div title={title}>
      <Select
        id="noteHoldingsType"
        value={actionValue}
        loading={isHoldingsNotesLoading}
        onChange={e => onChange({
          actionIndex,
          value: e.target.value,
          fieldName: FIELD_VALUE_KEY,
          tenants: getTenantsById(sortedHoldingsNotes, e.target.value)
        })}
        dataOptions={sortedHoldingsNotes}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.loanTypeSelect' })}
        marginBottom0
        dirty={!!actionValue}
      />
    </div>
  );
};

HoldingNotesControl.propTypes = {
  bulkOperationId: PropTypes.string,
  option: PropTypes.string,
  actionValue: PropTypes.string,
  actionIndex: PropTypes.number,
  onChange: PropTypes.func,
};
