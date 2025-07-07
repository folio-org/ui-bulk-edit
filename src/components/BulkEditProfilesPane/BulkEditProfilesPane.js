import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  LoadingPane,
  Pane,
  PaneHeader,
} from '@folio/stripes/components';
import { useUsersBatch } from '@folio/stripes-acq-components';

import { CAPABILITIES } from '../../constants';
import { useBulkEditProfiles } from '../../hooks/api';
import { BulkEditProfiles } from '../BulkEditProfiles';

export const BulkEditProfilesPane = ({
  entityType,
  title,
}) => {
  const {
    isFetching,
    isLoading,
    profiles,
  } = useBulkEditProfiles({ entityType });

  const userIds = useMemo(() => profiles.map(profile => profile.updatedBy), [profiles]);

  const {
    isLoading: isUsersLoading,
    users,
  } = useUsersBatch(userIds);

  const count = profiles.length;

  const renderHeader = useCallback((renderProps) => {
    const paneSub = !isLoading && (
      <FormattedMessage
        id="ui-bulk-edit.settings.profiles.paneSub"
        values={{ count }}
      />
    );

    return (
      <PaneHeader
        {...renderProps}
        paneTitle={title}
        paneSub={paneSub}
      />
    );
  }, [count, isLoading, title]);

  if (isLoading || isUsersLoading) {
    return <LoadingPane renderHeader={renderHeader} />;
  }

  return (
    <Pane
      defaultWidth="fill"
      renderHeader={renderHeader}
    >
      <input />
      <BulkEditProfiles
        entityType={entityType}
        isLoading={isFetching}
        profiles={profiles}
        users={users}
      />
    </Pane>
  );
};

BulkEditProfilesPane.propTypes = {
  entityType: PropTypes.oneOf(Object.values(CAPABILITIES)).isRequired,
  title: PropTypes.node.isRequired,
};
