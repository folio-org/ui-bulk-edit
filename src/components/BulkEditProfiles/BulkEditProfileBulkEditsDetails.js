import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { EmptyMessage } from '@folio/stripes/components';

import { APPROACHES } from '../../constants';
import { useBulkEditForm } from '../../hooks/useBulkEditForm';
import { useOptionsWithTenants } from '../../hooks/useOptionsWithTenants';
import { folioFieldTemplate } from '../BulkEditPane/BulkEditListResult/BulkEditInApp/helpers';
import { InAppForm } from '../BulkEditPane/BulkEditListResult/BulkEditInApp/InAppForm/InAppForm';
import { validationSchema } from '../BulkEditPane/BulkEditListResult/BulkEditInApp/validation';

export const BulkEditProfileBulkEditsDetails = ({
  entityType,
  initialValues,
}) => {
  const { options, areAllOptionsLoaded } = useOptionsWithTenants(entityType);
  const { fields, setFields } = useBulkEditForm({
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
      loading={!areAllOptionsLoaded}
      disabled
      isNonInteractive
    />
  );
};

BulkEditProfileBulkEditsDetails.propTypes = {
  entityType: PropTypes.string.isRequired,
  initialValues: PropTypes.arrayOf(PropTypes.shape({})),
};
