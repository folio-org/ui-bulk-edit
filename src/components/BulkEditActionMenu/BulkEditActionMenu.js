import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';

import {
  Button,
  Icon,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';
import React, { useContext, useState } from 'react';
import { Preloader } from '@folio/stripes-data-transfer-components';
import { useLocation } from 'react-router-dom';
import { ActionMenuGroup } from './ActionMenuGroup/ActionMenuGroup';
import {
  APPROACHES,
  CAPABILITIES,
  getDownloadLinks,
  EDITING_STEPS,
  JOB_STATUSES,
  BULK_VISIBLE_COLUMNS,
  getFormattedFilePrefixDate,
} from '../../constants';
import { useBulkPermissions, usePathParams } from '../../hooks';
import { RootContext } from '../../context/RootContext';
import { useBulkOperationDetails, useFileDownload } from '../../hooks/api';

const BulkEditActionMenu = ({
  onEdit,
  onToggle,
}) => {
  const location = useLocation();
  const perms = useBulkPermissions();
  const search = new URLSearchParams(location.search);
  const capability = search.get('capabilities');
  const step = search.get('step');
  const fileName = search.get('fileName') || `${capability}-${search.get('criteria')}.csv`;

  const {
    hasCsvEditPerms,
    hasAnyInAppEditPermissions,
  } = perms;

  const { id } = usePathParams('/bulk-edit/:id');
  const { bulkDetails, isLoading } = useBulkOperationDetails({ id });

  const [fileInfo, setFileInfo] = useState(null);

  useFileDownload({
    id,
    fileInfo,
    onSuccess: data => {
      saveAs(new Blob([data]), fileInfo?.fileName);
      setFileInfo(null);
    },
  });

  const { visibleColumns, setVisibleColumns } = useContext(RootContext);
  const columns = visibleColumns || [];
  const selectedValues = columns.filter(item => !item.selected).map(item => item.value);

  const isStartBulkCsvActive = hasCsvEditPerms && capability === CAPABILITIES.USER;
  const isInitialStep = step === EDITING_STEPS.UPLOAD;
  const isStartBulkInAppActive =
    hasAnyInAppEditPermissions
    && isInitialStep
    && [JOB_STATUSES.DATA_MODIFICATION, JOB_STATUSES.REVIEW_CHANGES].includes(bulkDetails?.status);

  const isLastUnselectedColumn = (value) => {
    return selectedValues?.length === 1 && selectedValues?.[0] === value;
  };

  const columnsOptions = columns.map(item => ({ ...item, disabled: isLastUnselectedColumn(item.value) }));

  const handleColumnChange = ({ values }) => {
    const changedColumns = columns.map(col => {
      return ({
        ...col,
        selected: !values.includes(col.value),
      });
    });

    setVisibleColumns(changedColumns);
    localStorage.setItem(BULK_VISIBLE_COLUMNS, JSON.stringify(changedColumns));
  };

  const handleOnStartEdit = (approach) => {
    onEdit(approach);
    onToggle();
  };

  const handleFileSave = (info) => {
    setFileInfo(info);
  };

  const renderLinkButtons = () => {
    if (isLoading) return <Preloader />;

    const date = getFormattedFilePrefixDate();

    const downloadLinks = getDownloadLinks({ perms, step, fileName, date });

    return downloadLinks.map(l => bulkDetails && Object.hasOwn(bulkDetails, l.KEY) && l.IS_VISIBLE && (
      <Button
        key={l.SEARCH_PARAM}
        buttonStyle="dropdownItem"
        data-testid={l.SEARCH_PARAM}
        onClick={() => handleFileSave({ fileContentType: l.SEARCH_PARAM, fileName: l.SAVE_FILE_NAME })}
      >
        <Icon icon="download">
          {l.LINK_NAME}
        </Icon>
      </Button>
    ));
  };

  const renderStartBulkEditButtons = () => {
    return (
      <>
        {isStartBulkInAppActive && (
          <Button
            buttonStyle="dropdownItem"
            onClick={() => handleOnStartEdit(APPROACHES.IN_APP)}
          >
            <Icon icon="edit">
              <FormattedMessage id="ui-bulk-edit.start.edit" />
            </Icon>
          </Button>
        )}
        {isStartBulkCsvActive && (
          <Button
            buttonStyle="dropdownItem"
            onClick={() => handleOnStartEdit(APPROACHES.MANUAL)}
          >
            <Icon icon="edit">
              <FormattedMessage id="ui-bulk-edit.start.edit.csv" />
            </Icon>
          </Button>
        )}
      </>
    );
  };

  const renderColumnsFilter = () => {
    if (!columnsOptions.length) return null;

    return (
      <CheckboxFilter
        dataOptions={columnsOptions}
        name="filter"
        onChange={handleColumnChange}
        selectedValues={selectedValues}
      />
    );
  };

  return (
    <>
      <ActionMenuGroup
        title={<FormattedMessage id="ui-bulk-edit.menuGroup.actions" />}
      >
        {renderLinkButtons()}
        {renderStartBulkEditButtons()}
      </ActionMenuGroup>
      <ActionMenuGroup title={<FormattedMessage id="ui-bulk-edit.menuGroup.showColumns" />}>
        {renderColumnsFilter()}
      </ActionMenuGroup>

    </>
  );
};

BulkEditActionMenu.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default BulkEditActionMenu;
