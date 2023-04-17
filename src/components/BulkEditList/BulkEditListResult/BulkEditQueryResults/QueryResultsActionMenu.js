import React from 'react';
import { CheckboxFilter } from '@folio/stripes/smart-components';
import { FormattedMessage } from 'react-intl';
import {
  Headline,
} from '@folio/stripes/components';
import PropTypes from 'prop-types';

export const ActionMenu = ({
  columns,
  visibleColumns,
  onChange,
}) => {
  return (
    <>
      <Headline size="medium" margin="none" tag="p" faded>
        <FormattedMessage id="ui-bulk-edit.pane.query.show-columns" />
      </Headline>
      <CheckboxFilter
        dataOptions={columns}
        name="ui-bulk-edit-columns-filter"
        onChange={onChange}
        selectedValues={visibleColumns}
      />
    </>
  );
};

ActionMenu.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};
