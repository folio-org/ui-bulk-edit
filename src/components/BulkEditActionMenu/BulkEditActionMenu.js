import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { IfPermission } from '@folio/stripes/core';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

const BulkEditActionMenu = ({
  onEdit,
  onDelete,
  onToggle,
}) => {
  const buildButtonClickHandler = buttonClickHandler => () => {
    buttonClickHandler();

    onToggle();
  };

  return (
    <>
      <IfPermission perm="ui-bulk-edit.edit">
        <Button
          buttonStyle="dropdownItem"
          onClick={buildButtonClickHandler(onEdit)}
        >
          <Icon icon="edit">
            <FormattedMessage id="ui-bulk-edit.start.edit" />
          </Icon>
        </Button>
      </IfPermission>
      <IfPermission perm="ui-bulk-edit.delete">
        <Button
          buttonStyle="dropdownItem"
          onClick={buildButtonClickHandler(onDelete)}
        >
          <Icon icon="trash">
            <FormattedMessage id="ui-bulk-edit.start.delete" />
          </Icon>
        </Button>
      </IfPermission>
    </>
  );
};

BulkEditActionMenu.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BulkEditActionMenu;
