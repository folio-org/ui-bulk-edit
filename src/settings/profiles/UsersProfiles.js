import { useIntl } from 'react-intl';
import { TitleManager } from '@folio/stripes/core';

export const UsersProfiles = () => {
  const { formatMessage } = useIntl();

  return <TitleManager page={formatMessage({ id: 'ui-bulk-edit.titleManager.settings.usersProfiles' })} />;
};
