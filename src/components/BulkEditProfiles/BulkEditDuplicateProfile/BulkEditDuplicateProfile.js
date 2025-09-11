import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';

import { Preloader } from '@folio/stripes-data-transfer-components';
import { TitleManager } from '@folio/stripes/core';

import { RECORD_TYPES_PROFILES_MAPPING } from '../../../constants';
import { useProfileCreate } from '../../../hooks/api/useProfileCreate';
import { useBulkEditProfile } from '../../../hooks/api';
import { ruleDetailsToSource } from '../../BulkEditPane/BulkEditListResult/BulkEditInApp/helpers';

import { BulkEditProfilesForm } from '../forms/BulkEditProfilesForm';
import { useSearchParams } from '../../../hooks';

export const BulkEditDuplicateProfile = ({ onClose }) => {
  const intl = useIntl();
  const { id } = useParams();
  const { currentRecordType: entityType } = useSearchParams();
  const { profile, isLoading } = useBulkEditProfile(id);
  const { createProfile, isProfileCreating } = useProfileCreate({
    onSuccess: onClose
  });

  const initialValues = {
    name: profile?.name
      && intl.formatMessage({ id: 'ui-bulk-edit.settings.profiles.form.name.copy' }, { name: profile?.name }),
    description: profile?.description,
    locked: profile?.locked,
    entityType,
  };

  const handleSave = async (body) => {
    await createProfile(body);
  };

  if (isLoading) return <Preloader />;

  const friendlyEntityType = RECORD_TYPES_PROFILES_MAPPING[entityType];
  const title = intl.formatMessage(
    { id: 'ui-bulk-edit.settings.profiles.title.new' },
    { entityType: friendlyEntityType }
  );

  return (
    <TitleManager record={title}>
      <BulkEditProfilesForm
        title={title}
        onClose={onClose}
        onSave={handleSave}
        initialValues={initialValues}
        initialRuleDetails={ruleDetailsToSource(profile.ruleDetails, entityType)}
        initialMarcRuleDetails={profile.marcRuleDetails}
        isLoading={isProfileCreating}
      />
    </TitleManager>
  );
};

BulkEditDuplicateProfile.propTypes = {
  onClose: PropTypes.func.isRequired,
};
