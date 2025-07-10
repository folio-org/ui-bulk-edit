import { useIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';

import { BulkEditProfilesPane } from '../../components/BulkEditProfiles';
import { CAPABILITIES } from '../../constants';

export const InstancesProfiles = () => {
  const { formatMessage } = useIntl();

  return (
    <TitleManager page={formatMessage({ id: 'ui-bulk-edit.titleManager.settings.instancesProfiles' })}>
      <BulkEditProfilesPane
        entityType={CAPABILITIES.INSTANCE}
        title={formatMessage({ id: 'ui-bulk-edit.settings.instanceProfiles' })}
      />
    </TitleManager>
  );
};
