import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Loading, Selection } from '@folio/stripes/components';
import { checkIfUserInCentralTenant, useStripes } from '@folio/stripes/core';

import { getLabelByValue } from '../../helpers';
import { customFilter, getTenantsById, removeDuplicatesByValue } from '../../../../../../utils/helpers';
import { useMaterialTypes, useMaterialTypesEcs } from '../../../../../../hooks/api';
import { TenantsProvider, useTenants } from '../../../../../../context/TenantsContext';


const controlPropTypes = {
  value: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  onChange: PropTypes.func,
};

const MaterialTypesSelection = ({ value, path, name, disabled, onChange }) => {
  const { formatMessage } = useIntl();
  const stripes = useStripes();
  const { tenants } = useTenants();

  const isCentralTenant = checkIfUserInCentralTenant(stripes);
  const { materialTypes, isLoading } = useMaterialTypes();
  const { escData: materialTypesEcs, isFetching: isMaterialTypesEcsLoading } = useMaterialTypesEcs(tenants, { enabled: isCentralTenant });

  const types = isCentralTenant ? removeDuplicatesByValue(materialTypesEcs, tenants) : materialTypes;
  const title = getLabelByValue(types, value);

  if (isMaterialTypesEcsLoading) return <Loading size="large" />;

  return (
    <div title={title}>
      <Selection
        id="materialType"
        value={value}
        loading={isLoading}
        onChange={val => {
          onChange({
            path,
            val,
            name,
            tenants: getTenantsById(removeDuplicatesByValue(materialTypesEcs, tenants), val)
          });
        }}
        placeholder={formatMessage({ id: 'ui-bulk-edit.layer.selectMaterialType' })}
        onFilter={customFilter}
        dataOptions={types}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.materialTypeSelect' })}
        dirty={!!value}
        disabled={disabled}
      />
    </div>
  );
};

MaterialTypesSelection.propTypes = controlPropTypes;

export const MaterialTypesControl = (props) => {
  const { tenants } = useTenants();

  return (
    <TenantsProvider tenants={tenants} showLocal={false}>
      <MaterialTypesSelection {...props} />
    </TenantsProvider>
  );
};

MaterialTypesControl.propTypes = controlPropTypes;
