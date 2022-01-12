import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { IfPermission } from '@folio/stripes/core';

import {
  Button,
  Icon,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { buildSearch } from '@folio/stripes-acq-components';
import { ActionMenuGroup } from './ActionMenuGroup/ActionMenuGroup';
import { DEFAULT_COLUMNS } from '../../constants/constants';

const BulkEditActionMenu = ({
  onEdit,
  onDelete,
  onToggle,
  successCsvLink,
  errorCsvLink,
}) => {
  const [selectedValues, setSelectedValues] = useState([]);
  const history = useHistory();
  const location = useLocation();

  const handleChange = ({ values }) => {
    setSelectedValues(values);

    history.replace({
      search: buildSearch({ selectedColumns: JSON.stringify(values) }, location.search),
    });
  };

  const buildButtonClickHandler = buttonClickHandler => () => {
    buttonClickHandler();

    onToggle();
  };

  useEffect(() => {
    const paramsColumns = new URLSearchParams(location.search).get('selectedColumns');
    const defaultColumns = DEFAULT_COLUMNS
      .filter(item => item.selected)
      .map(item => item.value);

    const values = paramsColumns ? JSON.parse(paramsColumns) : defaultColumns;

    setSelectedValues(values);
  }, []);

  return (
    <>
      <ActionMenuGroup title={<FormattedMessage id="ui-bulk-edit.menuGroup.actions" />}>
        <>
          {
              successCsvLink &&
              <IfPermission perm="ui-bulk-edit.edit">
                <a href={successCsvLink} download>
                  <Button
                    buttonStyle="dropdownItem"
                    data-testid="download-link-matched"
                  >
                    <Icon icon="download">
                      <FormattedMessage id="ui-bulk-edit.start.downloadMathcedRecords" />
                    </Icon>
                  </Button>
                </a>
              </IfPermission>
          }
          {errorCsvLink &&
          <IfPermission perm="ui-bulk-edit.edit">
            <a href={errorCsvLink} download>
              <Button
                buttonStyle="dropdownItem"
                data-testid="download-link-error"
              >
                <Icon icon="download">
                  <FormattedMessage id="ui-bulk-edit.start.downloadErrors" />
                </Icon>
              </Button>
            </a>
          </IfPermission>
          }
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
      </ActionMenuGroup>
      <ActionMenuGroup title={<FormattedMessage id="ui-bulk-edit.menuGroup.showColumns" />}>
        <CheckboxFilter
          dataOptions={DEFAULT_COLUMNS}
          name="filter"
          onChange={handleChange}
          selectedValues={selectedValues}
        />
      </ActionMenuGroup>
    </>
  );
};

BulkEditActionMenu.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  successCsvLink: PropTypes.string,
  errorCsvLink: PropTypes.string,
};

export default BulkEditActionMenu;
