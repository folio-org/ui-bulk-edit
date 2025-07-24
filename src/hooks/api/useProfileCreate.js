import { useMutation, useQueryClient } from 'react-query';
import { useIntl } from 'react-intl';
import { useShowCallout } from '@folio/stripes-acq-components';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useErrorMessages } from '../useErrorMessages';
import { BULK_EDIT_PROFILES_KEY } from './useBulkEditProfiles';
import { BULK_EDIT_PROFILES_API } from '../../constants';

export const useProfileCreate = ({ onSuccess }) => {
  const ky = useOkapiKy();
  const callout = useShowCallout();
  const client = useQueryClient();
  const [namespace] = useNamespace({ key: BULK_EDIT_PROFILES_KEY });
  const { formatMessage } = useIntl();
  const { showErrorMessage } = useErrorMessages({
    messageSuffix: formatMessage({ id: 'ui-bulk-edit.settings.profiles.form.create.error' })
  });

  const { mutateAsync: createProfile, isLoading: isProfileCreating } = useMutation({
    mutationFn: (json) => {
      return ky.post(BULK_EDIT_PROFILES_API, {
        json,
      }).json();
    },
    onError: showErrorMessage,
    onSuccess: () => {
      callout({
        message: formatMessage({ id: 'ui-bulk-edit.settings.profiles.form.create.success' }),
        type: 'success',
      });

      client.invalidateQueries({ queryKey: [namespace] });

      onSuccess();
    },
  });

  return {
    createProfile,
    isProfileCreating,
  };
};
