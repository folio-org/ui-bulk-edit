import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

export const BulkEditActionMenu = ({
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
      <Button
        buttonStyle="dropdownItem"
        onClick={buildButtonClickHandler(onEdit)}
      >
        <Icon icon="edit">
          <FormattedMessage id="ui-bulk-edit.start.edit" />
        </Icon>
      </Button>
      <Button
        buttonStyle="dropdownItem"
        onClick={buildButtonClickHandler(onDelete)}
      >
        <Icon icon="trash">
          <FormattedMessage id="ui-bulk-edit.start.delete" />
        </Icon>
      </Button>
    </>
  );
};

BulkEditActionMenu.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
