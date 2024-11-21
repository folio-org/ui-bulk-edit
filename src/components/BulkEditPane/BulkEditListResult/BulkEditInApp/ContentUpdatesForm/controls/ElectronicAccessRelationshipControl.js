import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Loading, Select } from '@folio/stripes/components';
import { checkIfUserInCentralTenant, useStripes } from '@folio/stripes/core';

import { FIELD_VALUE_KEY, getLabelByValue } from '../helpers';
import { getTenantsById, removeDuplicatesByValue } from '../../../../../../utils/helpers';
import {
  useBulkOperationTenants,
  useElectronicAccessEcs,
  useElectronicAccessRelationships
} from '../../../../../../hooks/api';
import { getItemsWithPlaceholder } from '../../../../../../constants';


export const ElectronicAccessRelationshipControl = ({ bulkOperationId, allActions, actionValue, actionIndex, onChange }) => {
  const { formatMessage } = useIntl();
  const stripes = useStripes();

  const isCentralTenant = checkIfUserInCentralTenant(stripes);

  const { data: tenants } = useBulkOperationTenants(bulkOperationId);
  const { electronicAccessRelationships, isElectronicAccessLoading } = useElectronicAccessRelationships();
  const { escData: urlRelationshipsEcs, isFetching: isElectronicAccessEcsLoading } = useElectronicAccessEcs(tenants, { enabled: isCentralTenant });

  const filteredElectronicAccessRelationshipsEcs = urlRelationshipsEcs?.filter(item => actionIndex === 0 || item.value !== allActions[0]?.value);
  const filteredElectronicAccessRelationships = electronicAccessRelationships.filter(item => actionIndex === 0 || item.value !== allActions[0]?.value);
  const relationships = isCentralTenant ? removeDuplicatesByValue(filteredElectronicAccessRelationshipsEcs, tenants) : filteredElectronicAccessRelationships;
  const accessRelationshipsWithPlaceholder = getItemsWithPlaceholder(relationships);
  const title = getLabelByValue(accessRelationshipsWithPlaceholder, actionValue);

  if (isElectronicAccessEcsLoading || isElectronicAccessLoading) return <Loading size="large" />;

  return (
    <div title={title}>
      <Select
        id="urlRelationship"
        value={actionValue}
        loading={isElectronicAccessLoading || isElectronicAccessEcsLoading}
        onChange={e => onChange(
          {
            actionIndex,
            value: e.target.value,
            fieldName: FIELD_VALUE_KEY,
            tenants: getTenantsById(accessRelationshipsWithPlaceholder, e.target.value)
          }
        )}
        dataOptions={accessRelationshipsWithPlaceholder}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.urlRelationshipSelect' })}
        marginBottom0
        dirty={!!actionValue}
      />
    </div>
  );
};

ElectronicAccessRelationshipControl.propTypes = {
  bulkOperationId: PropTypes.string,
  allActions: PropTypes.arrayOf(PropTypes.object),
  actionValue: PropTypes.string,
  actionIndex: PropTypes.number,
  onChange: PropTypes.func,
};
