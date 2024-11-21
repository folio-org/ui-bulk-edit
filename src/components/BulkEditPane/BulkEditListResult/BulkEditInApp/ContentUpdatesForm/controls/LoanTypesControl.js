import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Loading, Selection } from '@folio/stripes/components';
import { checkIfUserInCentralTenant, useStripes } from '@folio/stripes/core';

import { FIELD_VALUE_KEY, getLabelByValue } from '../helpers';
import { getTenantsById, removeDuplicatesByValue } from '../../../../../../utils/helpers';
import { useBulkOperationTenants, useLoanTypes, useLoanTypesEcs } from '../../../../../../hooks/api';


export const LoanTypesControl = ({ bulkOperationId, actionValue, actionIndex, onChange }) => {
  const { formatMessage } = useIntl();
  const stripes = useStripes();

  const isCentralTenant = checkIfUserInCentralTenant(stripes);
  const { data: tenants } = useBulkOperationTenants(bulkOperationId);
  const { loanTypes, isLoanTypesLoading } = useLoanTypes();
  const { escData: loanTypesEsc, isFetching: isLoanTypesEscLoading } = useLoanTypesEcs(tenants, { enabled: isCentralTenant });

  const types = isCentralTenant ? removeDuplicatesByValue(loanTypesEsc, tenants) : loanTypes;
  const title = getLabelByValue(types, actionValue);

  if (isLoanTypesEscLoading) return <Loading size="large" />;

  return (
    <div title={title}>
      <Selection
        id="loanType"
        value={actionValue}
        loading={isLoanTypesLoading}
        onChange={value => {
          onChange({
            actionIndex,
            value,
            fieldName: FIELD_VALUE_KEY,
            tenants: getTenantsById(removeDuplicatesByValue(loanTypesEsc, tenants), value)
          });
        }}
        placeholder={formatMessage({ id: 'ui-bulk-edit.layer.selectLoanType' })}
        dataOptions={isCentralTenant ? removeDuplicatesByValue(loanTypesEsc, tenants) : loanTypes}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.loanTypeSelect' })}
        dirty={!!actionValue}
      />
    </div>
  );
};

LoanTypesControl.propTypes = {
  bulkOperationId: PropTypes.string,
  actionValue: PropTypes.string,
  actionIndex: PropTypes.number,
  onChange: PropTypes.func,
};
