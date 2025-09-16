import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  EmptyMessage,
  Layout,
  Loading,
} from '@folio/stripes/components';

import React from 'react';
import { APPROACHES } from '../../constants';
import { useBulkEditForm } from '../../hooks/useBulkEditForm';
import { useOptionsWithTenants } from '../../hooks/useOptionsWithTenants';
import { folioFieldTemplate } from '../BulkEditPane/BulkEditListResult/BulkEditInApp/helpers';
import { InAppForm } from '../BulkEditPane/BulkEditListResult/BulkEditInApp/InAppForm/InAppForm';
import { validationSchema } from '../BulkEditPane/BulkEditListResult/BulkEditInApp/validation';
import { PROFILE_DETAILS_ACCORDIONS } from './constants';

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
  ruleDetails,
}) => {
  const { options, areAllOptionsLoaded } = useOptionsWithTenants(entityType);

  if (isLoading || !areAllOptionsLoaded) {
    return (
      <Layout className="display-flex centerContent">
        <Loading size="large" />
      </Layout>
    );
  }

  return (
    <Accordion
      id={PROFILE_DETAILS_ACCORDIONS.BULK_EDITS}
      label={<FormattedMessage id={`ui-bulk-edit.settings.profiles.details.${PROFILE_DETAILS_ACCORDIONS.BULK_EDITS}`} />}
    >
      <BulkEditsForm
        entityType={entityType}
        initialValues={ruleDetails}
        options={options}
      />
    </Accordion>
  );
};

BulkEditProfileBulkEditsDetails.propTypes = {
  entityType: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  ruleDetails: PropTypes.arrayOf(PropTypes.shape({})),
};

BulkEditsForm.propTypes = {
  entityType: PropTypes.string.isRequired,
  initialValues: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
