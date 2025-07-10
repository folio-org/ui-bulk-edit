import { useIntl } from 'react-intl';

import { TitleManager } from '@folio/stripes/core';

import { BulkEditProfilesPane } from '../../components/BulkEditProfiles';
import { CAPABILITIES } from '../../constants';

export const ItemsProfiles = () => {
  const { formatMessage } = useIntl();

  return (
    <TitleManager page={formatMessage({ id: 'ui-bulk-edit.titleManager.settings.itemsProfiles' })}>
      <BulkEditProfilesPane
        entityType={CAPABILITIES.ITEM}
        title={formatMessage({ id: 'ui-bulk-edit.settings.itemProfiles' })}
      />
    </TitleManager>
  );
};
