import { useMutation, useQueryClient } from 'react-query';
import { useIntl } from 'react-intl';
import { useShowCallout } from '@folio/stripes-acq-components';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useErrorMessages } from '../useErrorMessages';
import { BULK_EDIT_PROFILES_KEY } from './useBulkEditProfiles';

export const useProfileUpdate = ({ id, onSuccess }) => {
  const ky = useOkapiKy();
  const callout = useShowCallout();
  const client = useQueryClient();
  const [namespace] = useNamespace({ key: BULK_EDIT_PROFILES_KEY });
  const { formatMessage } = useIntl();
  const { showErrorMessage } = useErrorMessages({
    messageSuffix: formatMessage({ id: 'ui-bulk-edit.settings.profiles.form.create.error' })
  });

  const { mutateAsync: updateProfile, isLoading: isProfileUpdating } = useMutation({
    mutationFn: (json) => {
      return ky.put(`bulk-operations/profiles/${id}`, {
        json,
      }).json();
    },
    onError: showErrorMessage,
    onSuccess: () => {
      callout({
        message: formatMessage({ id: 'ui-bulk-edit.settings.profiles.form.update.success' }),
        type: 'success',
      });

      client.invalidateQueries({ queryKey: [namespace] });

      onSuccess();
    },
  });

  return {
    updateProfile,
    isProfileUpdating,
  };
};
