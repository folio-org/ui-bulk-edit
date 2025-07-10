import { useIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';

import { BulkEditProfilesPane } from '../../components/BulkEditProfiles';
import { CAPABILITIES } from '../../constants';

export const UsersProfiles = () => {
  const { formatMessage } = useIntl();

  return (
    <TitleManager page={formatMessage({ id: 'ui-bulk-edit.titleManager.settings.usersProfiles' })}>
      <BulkEditProfilesPane
        entityType={CAPABILITIES.USER}
        title={formatMessage({ id: 'ui-bulk-edit.settings.userProfiles' })}
      />
    </TitleManager>
  );
};
