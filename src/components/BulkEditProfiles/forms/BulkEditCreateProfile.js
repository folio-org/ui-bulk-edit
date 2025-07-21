import { useProfileCreate } from '../../../hooks/api/useProfileCreate';
import { BulkEditProfilesForm } from './BulkEditProfilesForm';

export const BulkEditCreateProfile = ({ entityType, onClose }) => {
  const { createProfile } = useProfileCreate({
    onSuccess: onClose
  });

  const handleSave = async (body) => {
    await createProfile(body);
  };

  return (
    <BulkEditProfilesForm
      entityType={entityType}
      onClose={onClose}
      onSave={handleSave}
    />
  );
};
