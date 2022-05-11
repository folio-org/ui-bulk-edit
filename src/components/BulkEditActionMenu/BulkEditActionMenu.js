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
import { CAPABILITIES } from '../../constants';
import { useCurrentEntityInfo } from '../../hooks/currentEntity';
import { useBulkPermissions } from '../../hooks/useBulkPermissions';

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
  const search = new URLSearchParams(location.search);
  const capabilities = search.get('capabilities');
  const isCompleted = search.get('isCompleted');
  const processedFileName = search.get('processedFileName');
  const history = useHistory();
  const { id } = usePathParams('/bulk-edit/:id');
  const { items } = usePreviewRecords(id, capabilities?.toLowerCase());
  const { hasCsvEditPerms, hasInAppEditPerms, hasAnyEditPermissions } = useBulkPermissions();

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
              <FormattedMessage id={processedFileName || !!isCompleted ? 'ui-bulk-edit.start.downloadChangedRecords' : 'ui-bulk-edit.start.downloadMathcedRecords'} />
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

  const isStartBulkCsvActive = hasCsvEditPerms && capabilities === CAPABILITIES.USER;
  const isStartBulkInAppActive = hasInAppEditPerms && successCsvLink && capabilities === CAPABILITIES.ITEM;

  const renderStartBulkEditButtons = () => {
    return (
      <>
        {isStartBulkInAppActive && (
        <Button
          buttonStyle="dropdownItem"
          onClick={buildButtonClickHandler(onEdit)}
        >
          <Icon icon="edit">
            <FormattedMessage id="ui-bulk-edit.start.edit" />
          </Icon>
        </Button>
        )}

        {isStartBulkCsvActive && (
        <Button
          buttonStyle="dropdownItem"
          onClick={buildButtonClickHandler(onEdit)}
        >
          <Icon icon="edit">
            <FormattedMessage id="ui-bulk-edit.start.edit.csv" />
          </Icon>
        </Button>
        )}
      </>
    );
  };

  return (
    <>
      <ActionMenuGroup title={<FormattedMessage id="ui-bulk-edit.menuGroup.actions" />}>
        <>
          {renderLinkButtons()}

          {renderStartBulkEditButtons()}

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
