import React, {
  useCallback,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  DropdownMenu,
  Dropdown,
  MenuSection,
  Button,
  Icon,
  InfoPopover,
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import { QUERY_KEY_DOWNLOAD_LOGS, useFileDownload } from '../../../hooks/api';
import { APPROACHES, CAPABILITIES, LINK_KEYS } from '../../../constants';
import { useBulkPermissions } from '../../../hooks';
import { savePreviewFile } from '../../../utils/files';

const BulkEditLogsActions = ({ item }) => {
  const fileNamePostfix = item?.fqlQueryId ? `.${APPROACHES.QUERY}` : '';

  const {
    hasUsersViewPerms,
    hasInventoryInstanceViewPerms,
  } = useBulkPermissions();

  const [triggeredFile, setTriggeredFile] = useState(null);
  const { refetch } = useFileDownload({
    queryKey: QUERY_KEY_DOWNLOAD_LOGS,
    enabled: false,
    id: item.id,
    fileContentType: LINK_KEYS[triggeredFile],
    onSuccess: fileData => {
      savePreviewFile({
        fileName: item?.[triggeredFile],
        fileData,
      });

      setTriggeredFile(null);
    },
  });

  useEffect(() => {
    if (triggeredFile) {
      refetch();
    }
  }, [triggeredFile, refetch]);

  const onLoadFile = (file) => {
    setTriggeredFile(file);
  };

  const availableFiles = Object.keys(LINK_KEYS).filter(linkName => item[linkName]);

  const renderTrigger = useCallback(({ triggerRef, onToggle, ariaProps, keyHandler }) => (
    <IconButton
      icon="ellipsis"
      size="medium"
      ref={triggerRef}
      onClick={onToggle}
      onKeyDown={keyHandler}
      {...ariaProps}
    />
  ), []);

  const renderMenu = useCallback(({ onToggle }) => (
    <DropdownMenu
      role="menu"
      onToggle={onToggle}
    >
      <MenuSection label={<FormattedMessage id="ui-bulk-edit.list.actions.download" />}>
        {availableFiles.map((file) => (
          <Button
            key={file}
            data-testid={file}
            buttonStyle="dropdownItem"
            onClick={() => onLoadFile(file)}
          >
            <Icon icon="download">
              <FormattedMessage id={`ui-bulk-edit.logs.actions.${file}${fileNamePostfix}`} />
            </Icon>
          </Button>
        ))}
      </MenuSection>
    </DropdownMenu>
  ), [availableFiles, fileNamePostfix]);

  if (item.entityType === CAPABILITIES.USER && !hasUsersViewPerms) return null;
  if (item.entityType === CAPABILITIES.HOLDING &&
      !hasInventoryInstanceViewPerms) return null;
  if (item.entityType === CAPABILITIES.ITEM &&
      !hasInventoryInstanceViewPerms) return null;
  if ([CAPABILITIES.INSTANCE, CAPABILITIES.INSTANCE_MARC].includes(item.entityType) &&
     !hasInventoryInstanceViewPerms) return null;

  return (
    item.expired ?
      <InfoPopover
        key={item.id}
        iconSize="medium"
        content={
          <FormattedMessage
            id="ui-bulk-edit.logs.infoPopover"
          />
            }
      />
      :
      <Dropdown
        renderTrigger={renderTrigger}
        renderMenu={renderMenu}
      />
  );
};

BulkEditLogsActions.propTypes = {
  item: PropTypes.object.isRequired,
};

export default BulkEditLogsActions;
