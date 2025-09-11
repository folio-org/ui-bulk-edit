import React from 'react';
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
import { BulkEditProfilesMarcForms } from './forms/BulkEditProfilesMarcForm';
import { useSearchParams } from '../../hooks';

export const BulkEditProfilesMarcDetails = ({ initialRuleDetails, initialMarcRuleDetails }) => {
  const intl = useIntl();
  const stripes = useStripes();
  const { currentRecordType: entityType } = useSearchParams();
  const { fields, setFields, isPristine: isAdministrativeFormPristine } = useBulkEditForm({
    validationSchema: administrativeSchema,
    initialValues: initialRuleDetails,
    template: folioFieldTemplate
  });

  const { fields: marcFields, setFields: setMarcFields } = useBulkEditForm({
    validationSchema: marcSchema,
    initialValues: initialMarcRuleDetails,
    template: marcFieldTemplate
  });

  const filteredOptions = filterOptionsByPermissions(getAdministrativeDataOptions(intl.formatMessage), stripes);
  const sortedOptions = sortAlphabetically(filteredOptions);

  return (
    <BulkEditProfilesMarcForms
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
