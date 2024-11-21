import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Selection } from '@folio/stripes/components';
import { FindLocation, useCurrentUserTenants } from '@folio/stripes-acq-components';
import { LocationLookup, LocationSelection } from '@folio/stripes/smart-components';
import { checkIfUserInCentralTenant, useStripes } from '@folio/stripes/core';

import { filterByIds, getTenantsById, removeDuplicatesByValue } from '../../../../../../utils/helpers';
import { FIELD_VALUE_KEY, getLabelByValue, TEMPORARY_LOCATIONS } from '../helpers';
import { useBulkOperationTenants, useLocationEcs } from '../../../../../../hooks/api';


export const LocationControl = ({ bulkOperationId, option, actionValue, actionIndex, onChange }) => {
  const { formatMessage } = useIntl();
  const stripes = useStripes();

  const isCentralTenant = checkIfUserInCentralTenant(stripes);
  const { data: tenants } = useBulkOperationTenants(bulkOperationId);
  const { locationsEsc, isFetching: isLocationEscLoading } = useLocationEcs(tenants, { enabled: isCentralTenant });

  const title = getLabelByValue(locationsEsc, actionValue);
  const currentTenants = useCurrentUserTenants();

  return (
    <div title={title}>
      {isCentralTenant ? (
        <>
          <Selection
            id="locations-esc"
            loading={isLocationEscLoading}
            value={actionValue}
            dataOptions={locationsEsc}
            disabled
          />
          <FindLocation
            id="fund-locations"
            crossTenant
            tenantsList={filterByIds(currentTenants, tenants)}
            tenantId={tenants[0]}
            onRecordsSelect={(loc) => {
              onChange({
                actionIndex,
                value: loc[0].id,
                fieldName: FIELD_VALUE_KEY,
                tenants: getTenantsById(removeDuplicatesByValue(locationsEsc, tenants), loc[0].id)
              });
            }}
          />
        </>
      ) : (
        <>
          <LocationSelection
            value={actionValue}
            onSelect={(loc) => onChange({ actionIndex, value: loc?.id, fieldName: FIELD_VALUE_KEY })}
            placeholder={formatMessage({ id: 'ui-bulk-edit.layer.selectLocation' })}
            data-test-id={`textField-${actionIndex}`}
            aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.location' })}
            dirty={!!actionValue}
          />
          <LocationLookup
            marginBottom0
            isTemporaryLocation={TEMPORARY_LOCATIONS.includes(option)}
            onLocationSelected={(loc) => onChange({
              actionIndex,
              value: loc.id,
              fieldName: FIELD_VALUE_KEY,
            })
            }
            data-testid={`locationLookup-${actionIndex}`}
          />
        </>
      )}
    </div>
  );
};

LocationControl.propTypes = {
  bulkOperationId: PropTypes.string,
  option: PropTypes.string,
  actionValue: PropTypes.string,
  actionIndex: PropTypes.number,
  onChange: PropTypes.func,
};
