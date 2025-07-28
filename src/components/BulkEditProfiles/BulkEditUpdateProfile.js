import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { Preloader } from '@folio/stripes-data-transfer-components';

import { TitleManager } from '@folio/stripes/core';
import { useProfileUpdate } from '../../hooks/api/useProfileUpdate';
import { BulkEditProfilesForm } from './forms/BulkEditProfilesForm';
import { useBulkEditProfile } from '../../hooks/api';
import { ruleDetailsToSource } from '../BulkEditPane/BulkEditListResult/BulkEditInApp/helpers';

export const BulkEditUpdateProfile = ({ entityType, onClose }) => {
  const { id } = useParams();
  const { profile, isLoading } = useBulkEditProfile(id);
  const { updateProfile, isProfileUpdating } = useProfileUpdate({
    id,
    onSuccess: onClose
  });

  const initialValues = {
    name: profile?.name,
    description: profile?.description,
    locked: profile?.locked,
    entityType,
  };

  const handleSave = async (body) => {
    await updateProfile(body);
  };

  if (isLoading) return <Preloader />;

  return (
    <TitleManager record={profile?.name}>
      <BulkEditProfilesForm
        entityType={entityType}
        title={profile.name}
        onClose={onClose}
        onSave={handleSave}
        initialValues={initialValues}
        initialRuleDetails={ruleDetailsToSource(profile.ruleDetails, entityType)}
        isLoading={isProfileUpdating}
      />
    </TitleManager>
  );
};

BulkEditUpdateProfile.propTypes = {
  entityType: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
