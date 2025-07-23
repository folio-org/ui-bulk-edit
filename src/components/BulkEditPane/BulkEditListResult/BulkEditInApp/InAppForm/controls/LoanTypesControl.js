import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Loading, Selection } from '@folio/stripes/components';
import { checkIfUserInCentralTenant, useStripes } from '@folio/stripes/core';

import { getLabelByValue } from '../../helpers';
import { getTenantsById, removeDuplicatesByValue } from '../../../../../../utils/helpers';
import { useBulkOperationTenants, useLoanTypes, useLoanTypesEcs } from '../../../../../../hooks/api';


export const LoanTypesControl = ({ value, path, name, readOnly, onChange }) => {
  const { formatMessage } = useIntl();
  const stripes = useStripes();

  const isCentralTenant = checkIfUserInCentralTenant(stripes);
  const { tenants } = useBulkOperationTenants();
  const { loanTypes, isLoanTypesLoading } = useLoanTypes();
  const { escData: loanTypesEcs, isFetching: isLoanTypesEcsLoading } = useLoanTypesEcs(tenants, { enabled: isCentralTenant });

  const types = isCentralTenant ? removeDuplicatesByValue(loanTypesEcs, tenants) : loanTypes;
  const title = getLabelByValue(types, value);

  if (isLoanTypesEcsLoading) return <Loading size="large" />;

  return (
    <div title={title}>
      <Selection
        id="loanType"
        value={value}
        loading={isLoanTypesLoading}
        onChange={val => {
          onChange({
            path,
            val,
            name,
            tenants: getTenantsById(removeDuplicatesByValue(loanTypesEcs, tenants), val)
          });
        }}
        placeholder={formatMessage({ id: 'ui-bulk-edit.layer.selectLoanType' })}
        dataOptions={isCentralTenant ? removeDuplicatesByValue(loanTypesEcs, tenants) : loanTypes}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.loanTypeSelect' })}
        dirty={!!value}
        disabled={readOnly}
      />
    </div>
  );
};

LoanTypesControl.propTypes = {
  value: PropTypes.string,
  name: PropTypes.string,
  path: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  onChange: PropTypes.func,
};
