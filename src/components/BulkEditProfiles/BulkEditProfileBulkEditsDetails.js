import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  EmptyMessage,
  Layout,
  Loading,
} from '@folio/stripes/components';

import { APPROACHES } from '../../constants';
import { useBulkEditForm } from '../../hooks/useBulkEditForm';
import { useOptionsWithTenants } from '../../hooks/useOptionsWithTenants';
import { folioFieldTemplate } from '../BulkEditPane/BulkEditListResult/BulkEditInApp/helpers';
import { InAppForm } from '../BulkEditPane/BulkEditListResult/BulkEditInApp/InAppForm/InAppForm';
import { validationSchema } from '../BulkEditPane/BulkEditListResult/BulkEditInApp/validation';
import { useTenants } from '../../context/TenantsContext';

const BulkEditsForm = ({
  entityType,
  initialValues,
  options,
}) => {
  const { fields, setFields, isPristine } = useBulkEditForm({
    validationSchema,
    initialValues,
    template: folioFieldTemplate,
  });

  if (!fields?.[0]?.option) {
    return (
      <EmptyMessage>
        <FormattedMessage id="ui-bulk-edit.options.empty" />
      </EmptyMessage>
    );
  }

  return (
    <InAppForm
      fields={fields}
      setFields={setFields}
      options={options}
      recordType={entityType}
      approach={APPROACHES.IN_APP}
      isNonInteractive
      derivedFieldsConfig={{ isActive: !isPristine }}
    />
  );
};

export const BulkEditProfileBulkEditsDetails = ({
  entityType,
  isLoading,
  values,
}) => {
  const { tenants } = useTenants();
  const { options, areAllOptionsLoaded } = useOptionsWithTenants(entityType, tenants);

  if (isLoading || !areAllOptionsLoaded) {
    return (
      <Layout className="display-flex centerContent">
        <Loading size="large" />
      </Layout>
    );
  }

  return (
    <BulkEditsForm
      entityType={entityType}
      initialValues={values}
      options={options}
    />
  );
};

BulkEditProfileBulkEditsDetails.propTypes = {
  entityType: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  values: PropTypes.arrayOf(PropTypes.shape({})),
};

BulkEditsForm.propTypes = {
  entityType: PropTypes.string.isRequired,
  initialValues: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
