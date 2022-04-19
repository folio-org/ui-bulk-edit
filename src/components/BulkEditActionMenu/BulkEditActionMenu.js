import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';
import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { buildSearch } from '@folio/stripes-acq-components';
import { Preloader } from '@folio/stripes-data-transfer-components';
import { usePathParams } from '../../hooks';
import { ActionMenuGroup } from './ActionMenuGroup/ActionMenuGroup';
import { usePreviewRecords } from '../../API';
import { useCurrentEntityInfo } from '../../hooks/currentEntity';
import { useBulkPermissions } from '../../hooks/bulkPermissions';

const BulkEditActionMenu = ({
  onEdit,
  onToggle,
  successCsvLink,
  errorCsvLink,
  isLoading,
}) => {
  const {
    location,
    columns,
    searchParams,
  } = useCurrentEntityInfo();
  const capabilities = new URLSearchParams(location.search).get('capabilities');
  const history = useHistory();
  const { id } = usePathParams('/bulk-edit/:id');
  const { items } = usePreviewRecords(id, capabilities?.toLowerCase());
  const { hasAnyEditPermissions } = useBulkPermissions();

  const handleChange = ({ values }) => {
    history.replace({
      search: buildSearch({ selectedColumns: JSON.stringify(values) }, location.search),
    });
  };

  const buildButtonClickHandler = buttonClickHandler => () => {
    buttonClickHandler();

    onToggle();
  };

  const columnsOptions = columns.map(item => ({ ...item, disabled: !items?.length }));

  const selectedValues = useMemo(() => {
    const paramsColumns = searchParams.get('selectedColumns');
    const defaultColumns = columns
      .filter(item => item.selected)
      .map(item => item.value);

    return paramsColumns ? JSON.parse(paramsColumns) : defaultColumns;
  }, [location.search]);

  const renderLinkButtons = () => {
    if (isLoading) return <Preloader />;

    return (
      <>
        {(successCsvLink && hasAnyEditPermissions) &&
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
        }
        {(errorCsvLink && hasAnyEditPermissions) &&
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
        }
      </>
    );
  };

  return (
    <>
      <ActionMenuGroup title={<FormattedMessage id="ui-bulk-edit.menuGroup.actions" />}>
        <>
          {renderLinkButtons()}

          {hasAnyEditPermissions && (
          <Button
            buttonStyle="dropdownItem"
            onClick={buildButtonClickHandler(onEdit)}
          >
            <Icon icon="edit">
              <FormattedMessage id="ui-bulk-edit.start.edit" />
            </Icon>
          </Button>
          )}


          {/* Hide till it isn't used in app
          <IfPermission perm="ui-bulk-edit.delete">
            <Button
              buttonStyle="dropdownItem"
              onClick={buildButtonClickHandler(onDelete)}
            >
              <Icon icon="trash">
                <FormattedMessage id="ui-bulk-edit.start.delete" />
              </Icon>
            </Button>
          </IfPermission> */}
        </>
      </ActionMenuGroup>
      <ActionMenuGroup title={<FormattedMessage id="ui-bulk-edit.menuGroup.showColumns" />}>
        <CheckboxFilter
          dataOptions={columnsOptions}
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
  successCsvLink: PropTypes.string,
  errorCsvLink: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default BulkEditActionMenu;
