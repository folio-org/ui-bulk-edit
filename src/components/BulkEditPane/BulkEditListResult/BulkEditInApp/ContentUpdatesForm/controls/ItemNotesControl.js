import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Loading, Select } from '@folio/stripes/components';
import { checkIfUserInCentralTenant, useStripes } from '@folio/stripes/core';

import { getLabelByValue, sortWithoutPlaceholder } from '../../helpers';
import { getTenantsById, removeDuplicatesByValue } from '../../../../../../utils/helpers';
import { useBulkOperationTenants, useItemNotes, useItemNotesEcs } from '../../../../../../hooks/api';
import { getItemNotes } from '../../../../../../constants';


export const ItemNotesControl = ({ option, value, path, name, onChange }) => {
  const { formatMessage } = useIntl();
  const stripes = useStripes();

  const isCentralTenant = checkIfUserInCentralTenant(stripes);
  const { tenants } = useBulkOperationTenants();
  const { itemNotes, isItemNotesLoading } = useItemNotes();
  const { notesEcs: itemsNotes, isFetching: isItemsNotesEcsLoading } = useItemNotesEcs(tenants, 'action', { enabled: isCentralTenant });

  const notes = isCentralTenant ? removeDuplicatesByValue(itemsNotes, tenants) : itemNotes;
  const filteredAndMappedNotes = getItemNotes(formatMessage, notes)
    .filter(obj => obj.value !== option)
    .map(({ label, value: val, tenant }) => ({ label, value: val, tenant }));
  const sortedNotes = sortWithoutPlaceholder(filteredAndMappedNotes);
  const title = getLabelByValue(sortedNotes, path);

  if (isItemsNotesEcsLoading || isItemNotesLoading) return <Loading size="large" />;

  return (
    <div title={title}>
      <Select
        id="noteType"
        value={value}
        onChange={e => onChange({
          path,
          name,
          val: e.target.value,
          tenants: getTenantsById(sortedNotes, e.target.value),
        })}
        dataOptions={sortedNotes}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.loanTypeSelect' })}
        marginBottom0
        dirty={!!value}
      />
    </div>
  );
};

ItemNotesControl.propTypes = {
  option: PropTypes.string,
  value: PropTypes.string,
  path: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
};
