import { useIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';

import { BulkEditProfilesPane } from '../../components/BulkEditProfiles';
import { CAPABILITIES } from '../../constants';

export const HoldingsProfiles = () => {
  const { formatMessage } = useIntl();

  return (
    <TitleManager page={formatMessage({ id: 'ui-bulk-edit.titleManager.settings.holdingsProfiles' })}>
      <BulkEditProfilesPane
        entityType={CAPABILITIES.HOLDING}
        title={formatMessage({ id: 'ui-bulk-edit.settings.holdingsProfiles' })}
      />
    </TitleManager>
  );
};
