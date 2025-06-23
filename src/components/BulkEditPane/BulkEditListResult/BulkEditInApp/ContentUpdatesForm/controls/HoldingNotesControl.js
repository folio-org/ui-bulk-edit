import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { checkIfUserInCentralTenant, useStripes } from '@folio/stripes/core';
import { Loading, Select } from '@folio/stripes/components';

import { useBulkOperationTenants, useHoldingsNotes, useHoldingsNotesEcs } from '../../../../../../hooks/api';
import { getLabelByValue, sortWithoutPlaceholder } from '../../helpers';
import { getTenantsById, removeDuplicatesByValue } from '../../../../../../utils/helpers';
import { getHoldingsNotes } from '../../../../../../constants';


export const HoldingNotesControl = ({ option, value, path, name, onChange }) => {
  const { formatMessage } = useIntl();
  const stripes = useStripes();

  const isCentralTenant = checkIfUserInCentralTenant(stripes);

  const { tenants } = useBulkOperationTenants();
  const { notesEcs: holdingsNotesEcs, isFetching: isHoldingsNotesEcsLoading } = useHoldingsNotesEcs(tenants, 'action', { enabled: isCentralTenant });
  const { holdingsNotes, isHoldingsNotesLoading } = useHoldingsNotes();

  const filteredAndMappedHoldingsNotes = getHoldingsNotes(formatMessage, isCentralTenant ? removeDuplicatesByValue(holdingsNotesEcs, tenants) : holdingsNotes)
    .filter(obj => obj.value !== option)
    .map(({ label, value: val, disabled, tenant }) => ({ label, value: val, disabled, tenant }));
  const sortedHoldingsNotes = sortWithoutPlaceholder(filteredAndMappedHoldingsNotes);
  const title = getLabelByValue(sortedHoldingsNotes, value);

  if (isHoldingsNotesEcsLoading) return <Loading size="large" />;

  return (
    <div title={title}>
      <Select
        id="noteHoldingsType"
        value={value}
        loading={isHoldingsNotesLoading}
        onChange={e => onChange({
          path,
          name,
          val: e.target.value,
          tenants: getTenantsById(sortedHoldingsNotes, e.target.value)
        })}
        dataOptions={sortedHoldingsNotes}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.loanTypeSelect' })}
        marginBottom0
        dirty={!!value}
      />
    </div>
  );
};

HoldingNotesControl.propTypes = {
  option: PropTypes.string,
  value: PropTypes.string,
  path: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
};
