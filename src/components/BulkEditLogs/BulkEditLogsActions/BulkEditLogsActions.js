import React, { useCallback } from 'react';
import { IconButton, DropdownMenu, Dropdown, MenuSection, Button, Icon } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

const BulkEditLogsActions = () => {
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
        <ul>
          <li>
            <Button
              buttonStyle="dropdownItem"
              onClick={onToggle}
            >
              <Icon icon="download">
                Link to the file 1
              </Icon>
            </Button>
          </li>
        </ul>
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

export default BulkEditLogsActions;
