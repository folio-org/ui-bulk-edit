import { useState } from 'react';
import isEqual from 'lodash/isEqual';
import { getFormErrors } from '../utils/helpers';
import { profilesValidationSchema } from '../components/BulkEditProfiles/forms/validation';

const initialFormState = (entityType) => ({
  name: '',
  description: '',
  locked: false,
  entityType,
});

export const useProfilesSummaryForm = ({ initialSummaryValues, entityType }) => {
  const initial = initialSummaryValues || initialFormState(entityType);
  const [formState, setFormState] = useState(initial);

  const errors = getFormErrors(formState, profilesValidationSchema);
  const isValid = Object.keys(errors).length === 0;
  const isPristine = isEqual(formState, initial);

  return {
    formState,
    setFormState,
    isValid,
    isPristine,
  };
};
