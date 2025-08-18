import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { checkIfUserInCentralTenant, useStripes } from '@folio/stripes/core';
import { Loading, Select } from '@folio/stripes/components';

import { useHoldingsNotes, useHoldingsNotesEcs } from '../../../../../../hooks/api';
import { getLabelByValue, sortWithoutPlaceholder } from '../../helpers';
import { getTenantsById, removeDuplicatesByValue } from '../../../../../../utils/helpers';
import { getHoldingsNotes } from '../../../../../../constants';
import { useTenants } from '../../../../../../context/TenantsContext';


export const HoldingNotesControl = ({ parameters, option, value, path, name, disabled, onChange }) => {
  const { formatMessage } = useIntl();
  const stripes = useStripes();
  const { tenants } = useTenants();

  const isCentralTenant = checkIfUserInCentralTenant(stripes);

  const { notesEcs: holdingsNotesEcs, isFetching: isHoldingsNotesEcsLoading } = useHoldingsNotesEcs(tenants, 'action', { enabled: isCentralTenant });
  const { holdingsNotes, isHoldingsNotesLoading } = useHoldingsNotes();

  const filteredAndMappedHoldingsNotes = getHoldingsNotes(formatMessage, isCentralTenant ? removeDuplicatesByValue(holdingsNotesEcs, tenants) : holdingsNotes)
    .filter(obj => (parameters ? !parameters.map(param => param.value).includes(obj.value) : obj.value !== option))
    .map(({ label, value: val, disabled: noteDisabled, tenant }) => ({ label, value: val, disabled: noteDisabled, tenant }));
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
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.holdingsNotes' })}
        marginBottom0
        dirty={!!value}
        disabled={disabled}
      />
    </div>
  );
};

HoldingNotesControl.propTypes = {
  option: PropTypes.string,
  parameters: PropTypes.arrayOf(PropTypes.shape({})),
  value: PropTypes.string,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};
