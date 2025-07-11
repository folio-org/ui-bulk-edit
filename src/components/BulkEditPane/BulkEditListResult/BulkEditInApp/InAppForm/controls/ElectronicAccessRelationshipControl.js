import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Loading, Select } from '@folio/stripes/components';
import { checkIfUserInCentralTenant, useStripes } from '@folio/stripes/core';

import { getLabelByValue } from '../../helpers';
import { getTenantsById, removeDuplicatesByValue } from '../../../../../../utils/helpers';
import {
  useBulkOperationTenants,
  useElectronicAccessEcs,
  useElectronicAccess
} from '../../../../../../hooks/api';
import { getItemsWithPlaceholder } from '../../../../../../constants';


export const ElectronicAccessRelationshipControl = ({ ctx, value, path, name, onChange }) => {
  const { formatMessage } = useIntl();
  const stripes = useStripes();

  const isCentralTenant = checkIfUserInCentralTenant(stripes);

  const { tenants } = useBulkOperationTenants();
  const { electronicAccessRelationships, isElectronicAccessLoading } = useElectronicAccess();
  const { escData: urlRelationshipsEcs, isFetching: isElectronicAccessEcsLoading } = useElectronicAccessEcs(tenants, { enabled: isCentralTenant });

  const filteredElectronicAccessRelationshipsEcs = urlRelationshipsEcs?.filter(item => ctx.index === 0 || item.value !== ctx.parentArray[0].value);
  const filteredElectronicAccessRelationships = electronicAccessRelationships.filter(item => ctx.index === 0 || item.value !== ctx.parentArray[0].value);
  const relationships = isCentralTenant ? removeDuplicatesByValue(filteredElectronicAccessRelationshipsEcs, tenants) : filteredElectronicAccessRelationships;
  const accessRelationshipsWithPlaceholder = getItemsWithPlaceholder(relationships);
  const title = getLabelByValue(accessRelationshipsWithPlaceholder, value);

  if (isElectronicAccessEcsLoading || isElectronicAccessLoading) return <Loading size="large" />;

  return (
    <div title={title}>
      <Select
        id="urlRelationship"
        value={value}
        loading={isElectronicAccessLoading || isElectronicAccessEcsLoading}
        onChange={e => onChange({
          path,
          name,
          val: e.target.value,
          tenants: getTenantsById(accessRelationshipsWithPlaceholder, e.target.value),
          resetNext: true,
        })}
        dataOptions={accessRelationshipsWithPlaceholder}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.urlRelationshipSelect' })}
        marginBottom0
        dirty={!!value}
      />
    </div>
  );
};

ElectronicAccessRelationshipControl.propTypes = {
  ctx: PropTypes.shape({
    index: PropTypes.number.isRequired,
    parentArray: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  value: PropTypes.string,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  name: PropTypes.string,
  onChange: PropTypes.func,
};
