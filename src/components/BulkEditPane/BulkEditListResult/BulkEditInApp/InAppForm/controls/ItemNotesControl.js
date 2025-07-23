import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Loading, Select } from '@folio/stripes/components';
import { checkIfUserInCentralTenant, useStripes } from '@folio/stripes/core';

import { getLabelByValue, sortWithoutPlaceholder } from '../../helpers';
import { getTenantsById, removeDuplicatesByValue } from '../../../../../../utils/helpers';
import { useBulkOperationTenants, useItemNotes, useItemNotesEcs } from '../../../../../../hooks/api';
import { getItemNotes } from '../../../../../../constants';


export const ItemNotesControl = ({ parameters, option, value, path, name, readOnly, onChange }) => {
  const { formatMessage } = useIntl();
  const stripes = useStripes();

  const isCentralTenant = checkIfUserInCentralTenant(stripes);
  const { tenants } = useBulkOperationTenants();
  const { itemNotes, isItemNotesLoading } = useItemNotes();
  const { notesEcs: itemsNotes, isFetching: isItemsNotesEcsLoading } = useItemNotesEcs(tenants, 'action', { enabled: isCentralTenant });

  const notes = isCentralTenant ? removeDuplicatesByValue(itemsNotes, tenants) : itemNotes;
  const filteredAndMappedNotes = getItemNotes(formatMessage, notes)
    .filter(obj => (parameters ? !parameters.map(param => param.value).includes(obj.value) : obj.value !== option))
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
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.itemNotes' })}
        marginBottom0
        dirty={!!value}
        disabled={readOnly}
      />
    </div>
  );
};

ItemNotesControl.propTypes = {
  parameters: PropTypes.arrayOf(PropTypes.shape({})),
  option: PropTypes.string,
  value: PropTypes.string,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  name: PropTypes.string,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
};
