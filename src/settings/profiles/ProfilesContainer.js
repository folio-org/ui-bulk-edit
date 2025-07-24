import PropTypes from 'prop-types';
import { TitleManager } from '@folio/stripes/core';
import { useIntl } from 'react-intl';
import { BulkEditProfilesPane } from '../../components/BulkEditProfiles';
import { TRANSLATION_SUFFIX } from '../../constants';

export const ProfilesContainer = ({ entityType }) => {
  const { formatMessage } = useIntl();
  const suffix = TRANSLATION_SUFFIX[entityType] || '';

  return (
    <TitleManager page={formatMessage({ id: `ui-bulk-edit.titleManager.settings${suffix}` })}>
      <BulkEditProfilesPane
        entityType={entityType}
        title={formatMessage({ id: `ui-bulk-edit.settings${suffix}` })}
      />
    </TitleManager>
  );
};

ProfilesContainer.propTypes = {
  entityType: PropTypes.string.isRequired,
};
