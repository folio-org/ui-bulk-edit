import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { useStripes } from '@folio/stripes/core';

import { useBulkEditForm } from '../../hooks/useBulkEditForm';
import { validationSchema as administrativeSchema } from '../BulkEditPane/BulkEditListResult/BulkEditInApp/validation';
import { folioFieldTemplate } from '../BulkEditPane/BulkEditListResult/BulkEditInApp/helpers';
import { validationSchema as marcSchema } from '../BulkEditPane/BulkEditListResult/BulkEditMarc/validation';
import { marcFieldTemplate } from '../BulkEditPane/BulkEditListResult/BulkEditMarc/helpers';
import { filterOptionsByPermissions } from '../../utils/helpers';
import { getAdministrativeDataOptions } from '../../constants';
import { sortAlphabetically } from '../../utils/sortAlphabetically';
import { useSearchParams } from '../../hooks';
import { BulkEditProfilesMarcForm } from './forms/BulkEditProfilesMarcForm';

export const BulkEditProfilesMarcDetails = ({ ruleDetails, marcRuleDetails }) => {
  const intl = useIntl();
  const stripes = useStripes();
  const { currentRecordType: entityType } = useSearchParams();
  const { fields, setFields, isPristine: isAdministrativeFormPristine } = useBulkEditForm({
    validationSchema: administrativeSchema,
    initialValues: ruleDetails,
    template: folioFieldTemplate
  });

  const { fields: marcFields, setFields: setMarcFields } = useBulkEditForm({
    validationSchema: marcSchema,
    initialValues: marcRuleDetails,
    template: marcFieldTemplate
  });

  const filteredOptions = filterOptionsByPermissions(getAdministrativeDataOptions(intl.formatMessage), stripes);
  const sortedOptions = sortAlphabetically(filteredOptions);

  return (
    <BulkEditProfilesMarcForm
      fields={fields}
      setFields={setFields}
      marcFields={marcFields}
      setMarcFields={setMarcFields}
      options={sortedOptions}
      entityType={entityType}
      isAdministrativeFormPristine={isAdministrativeFormPristine}
      isNonInteractive
    />
  );
};

BulkEditProfilesMarcDetails.propTypes = {
  ruleDetails: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  marcRuleDetails: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
