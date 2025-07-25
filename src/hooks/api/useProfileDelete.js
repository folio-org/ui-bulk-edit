import { useMutation, useQueryClient } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useShowCallout } from '@folio/stripes-acq-components';
import { BULK_EDIT_PROFILES_API } from '../../constants';
import { BULK_EDIT_PROFILES_KEY } from './useBulkEditProfiles';

export const useProfileDelete = ({ onSuccess }) => {
  const ky = useOkapiKy();
  const showCallout = useShowCallout();
  const client = useQueryClient();
  const [namespace] = useNamespace({ key: BULK_EDIT_PROFILES_KEY });

  const {
    mutateAsync: deleteProfile,
    isLoading: isDeletingProfile,
  } = useMutation({
    mutationFn: async ({ profileId }) => {
      return ky.delete(`${BULK_EDIT_PROFILES_API}/${profileId}`).json();
    },
    onSuccess: () => {
      showCallout({ messageId: 'ui-bulk-edit.settings.profiles.details.action.delete.success' });

      client.invalidateQueries({ queryKey: [namespace] });

      onSuccess();
    },
    onError: () => {
      showCallout({
        messageId: 'ui-bulk-edit.settings.profiles.details.action.delete.error',
        type: 'error',
      });
    }
  });

  return {
    deleteProfile,
    isDeletingProfile,
  };
};
