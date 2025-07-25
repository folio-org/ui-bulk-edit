import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Selection } from '@folio/stripes/components';
import { FindLocation, useCurrentUserTenants } from '@folio/stripes-acq-components';
import { LocationLookup, LocationSelection } from '@folio/stripes/smart-components';
import { checkIfUserInCentralTenant, useStripes } from '@folio/stripes/core';

import { filterByIds, getTenantsById, removeDuplicatesByValue } from '../../../../../../utils/helpers';
import { getLabelByValue, TEMPORARY_LOCATIONS } from '../../helpers';
import { useBulkOperationTenants, useLocationEcs } from '../../../../../../hooks/api';


export const LocationControl = ({ option, value, path, name, ctx, disabled, onChange }) => {
  const { formatMessage } = useIntl();
  const stripes = useStripes();

  const isCentralTenant = checkIfUserInCentralTenant(stripes);
  const { tenants } = useBulkOperationTenants();
  const { locationsEcs, isFetching: isLocationEcsLoading } = useLocationEcs(tenants, { enabled: isCentralTenant });

  const title = getLabelByValue(locationsEcs, value);
  const currentTenants = useCurrentUserTenants();

  return (
    <div title={title}>
      {isCentralTenant ? (
        <>
          <Selection
            id="locations-esc"
            loading={isLocationEcsLoading}
            value={value}
            dataOptions={locationsEcs}
            disabled
          />
          <FindLocation
            id="fund-locations"
            crossTenant
            tenantsList={filterByIds(currentTenants, tenants)}
            tenantId={tenants[0]}
            disabled={disabled}
            onRecordsSelect={(loc) => {
              onChange({
                path,
                val: loc[0].id,
                name,
                tenants: getTenantsById(removeDuplicatesByValue(locationsEcs, tenants), loc[0].id)
              });
            }}
          />
        </>
      ) : (
        <>
          <LocationSelection
            value={value}
            onSelect={(loc) => onChange({ path, val: loc?.id, name })}
            placeholder={formatMessage({ id: 'ui-bulk-edit.layer.selectLocation' })}
            data-test-id={`textField-${ctx.index}`}
            aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.location' })}
            dirty={!!value}
            disabled={disabled}
          />
          <LocationLookup
            marginBottom0
            isTemporaryLocation={TEMPORARY_LOCATIONS.includes(option)}
            onLocationSelected={(loc) => onChange({
              path,
              val: loc.id,
              name,
            })
            }
            disabled={disabled}
            data-testid={`locationLookup-${ctx.index}`}
          />
        </>
      )}
    </div>
  );
};

LocationControl.propTypes = {
  option: PropTypes.string,
  value: PropTypes.string,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  name: PropTypes.string,
  disabled: PropTypes.bool,
  ctx: PropTypes.shape({
    index: PropTypes.number.isRequired,
    parentArray: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  onChange: PropTypes.func,
};
