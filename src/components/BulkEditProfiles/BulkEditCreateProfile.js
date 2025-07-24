import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';

import { useProfileCreate } from '../../hooks/api/useProfileCreate';
import { BulkEditProfilesForm } from './forms/BulkEditProfilesForm';
import { RECORD_TYPES_PROFILES_MAPPING } from '../../constants';

export const BulkEditCreateProfile = ({ entityType, onClose }) => {
  const intl = useIntl();
  const { createProfile, isProfileCreating } = useProfileCreate({
    onSuccess: onClose
  });

  const handleSave = async (body) => {
    await createProfile(body);
  };

  const friendlyEntityType = RECORD_TYPES_PROFILES_MAPPING[entityType];
  const title = intl.formatMessage(
    { id: 'ui-bulk-edit.settings.profiles.title.new' },
    { entityType: friendlyEntityType }
  );

  return (
    <TitleManager record={title}>
      <BulkEditProfilesForm
        entityType={entityType}
        title={title}
        onClose={onClose}
        onSave={handleSave}
        isLoading={isProfileCreating}
      />
    </TitleManager>
  );
};

BulkEditCreateProfile.propTypes = {
  entityType: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
