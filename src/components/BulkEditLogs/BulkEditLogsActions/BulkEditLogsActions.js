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
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import { useFileDownload } from '../../../hooks/api';
import { linkNamesMap } from '../../../constants';

const BulkEditLogsActions = ({ item }) => {
  const [triggeredFile, setTriggeredFile] = useState(null);
  const { refetch } = useFileDownload({
    enabled: false,
    id: item.id,
    fileInfo: {
      fileContentType: linkNamesMap[triggeredFile],
    },
    onSuccess: data => {
      saveAs(new Blob([data]), item[triggeredFile].split('/')[1]);
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
              <FormattedMessage id={`ui-bulk-edit.logs.actions.${file}`} />
            </Icon>
          </Button>
        ))}
      </MenuSection>
    </DropdownMenu>
  ), []);

  return (
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
