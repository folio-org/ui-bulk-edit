import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { BULK_EDIT_PROFILES_API } from '../../constants';

export const useBulkEditProfileMutation = () => {
  const ky = useOkapiKy();

  const {
    mutateAsync: deleteProfile,
    isLoading,
  } = useMutation({
    mutationFn: async ({ profileId }) => {
      return ky.delete(`${BULK_EDIT_PROFILES_API}/${profileId}`).json();
    },
  });

  return {
    deleteProfile,
    isLoading,
  };
};
