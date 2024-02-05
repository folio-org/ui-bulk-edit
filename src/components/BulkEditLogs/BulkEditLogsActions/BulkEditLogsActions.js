import React, {
  useCallback,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';
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
import { APPROACHES, CAPABILITIES, linkNamesMap } from '../../../constants';
import { useBulkPermissions } from '../../../hooks';
import { getFileName } from '../../../utils/getFileName';

const BulkEditLogsActions = ({ item }) => {
  const fileNamePostfix = item.fqlQueryId ? `.${APPROACHES.QUERY}` : '';

  const {
    hasUsersViewPerms,
    hasInventoryInstanceViewPerms,
  } = useBulkPermissions();

  const [triggeredFile, setTriggeredFile] = useState(null);
  const { refetch } = useFileDownload({
    queryKey: QUERY_KEY_DOWNLOAD_LOGS,
    enabled: false,
    id: item.id,
    fileInfo: {
      fileContentType: linkNamesMap[triggeredFile],
    },
    onSuccess: data => {
      saveAs(new Blob([data]), getFileName(item, triggeredFile));
      setTriggeredFile(null);
    },
  });

  useEffect(() => {
    if (triggeredFile) {
      refetch();
    }
  }, [triggeredFile]);

  const onLoadFile = (file) => {
    setTriggeredFile(file);
  };

  const availableFiles = Object.keys(linkNamesMap).filter(linkName => item[linkName]);

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
  ), [availableFiles]);

  if (item.entityType === CAPABILITIES.USER && !hasUsersViewPerms) return null;
  if (item.entityType === CAPABILITIES.HOLDING &&
      !hasInventoryInstanceViewPerms) return null;
  if (item.entityType === CAPABILITIES.ITEM &&
      !hasInventoryInstanceViewPerms) return null;
  if (item.entityType === CAPABILITIES.INSTANCE &&
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
