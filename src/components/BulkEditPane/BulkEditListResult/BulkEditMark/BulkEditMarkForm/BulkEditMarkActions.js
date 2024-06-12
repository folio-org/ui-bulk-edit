import React from 'react';
import PropTypes from 'prop-types';

import { IconButton } from '@folio/stripes/components';

import css from '../../../BulkEditPane.css';


const BulkEditMarkActions = ({
  addingDisabled,
  removingDisabled,
  rowIndex,
  subfieldIndex,
  onAdd,
  onRemove
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
  subfieldIndex: PropTypes.number,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default BulkEditMarkActions;
