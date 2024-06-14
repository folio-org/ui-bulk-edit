import PropTypes from 'prop-types';

import { IconButton } from '@folio/stripes/components';

import noop from 'lodash/noop';
import css from '../../../BulkEditPane.css';


const BulkEditMarkActions = ({
  addingDisabled = false,
  removingDisabled = false,
  onAdd = noop,
  onRemove,
  rowIndex,
  subfieldIndex
}) => {
  return (
    <div className={css.actionButtonsWrapper}>
      {!addingDisabled && (
        <IconButton
          className={css.iconButton}
          data-row-index={rowIndex}
          data-subfield-index={subfieldIndex}
          icon="plus-sign"
          size="medium"
          onClick={onAdd}
          data-testid={`add-button-${rowIndex}`}
        />
      )}
      <IconButton
        className={css.iconButton}
        data-row-index={rowIndex}
        data-subfield-index={subfieldIndex}
        icon="trash"
        onClick={onRemove}
        disabled={removingDisabled}
        data-testid={`remove-button-${rowIndex}`}
      />
    </div>
  );
};

BulkEditMarkActions.propTypes = {
  addingDisabled: PropTypes.bool,
  removingDisabled: PropTypes.bool,
  rowIndex: PropTypes.number.isRequired,
  subfieldIndex: PropTypes.number.isRequired,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func.isRequired,
};

export default BulkEditMarkActions;
