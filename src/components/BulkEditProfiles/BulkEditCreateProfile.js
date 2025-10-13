import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';

import { useProfileCreate } from '../../hooks/api';
import { BulkEditProfilesForm } from './forms/BulkEditProfilesForm';
import { RECORD_TYPES_PROFILES_MAPPING } from '../../constants';
import { useSearchParams } from '../../hooks';
import { MetadataProvider } from '../../context/MetadataProvider';

export const BulkEditCreateProfile = ({ onClose }) => {
  const intl = useIntl();
  const { currentRecordType: entityType } = useSearchParams();

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
      <MetadataProvider value={{ metadata: null }}>
        <BulkEditProfilesForm
          title={title}
          onClose={onClose}
          onSave={handleSave}
          isLoading={isProfileCreating}
        />
      </MetadataProvider>
    </TitleManager>
  );
};

BulkEditCreateProfile.propTypes = {
  onClose: PropTypes.func.isRequired,
};
