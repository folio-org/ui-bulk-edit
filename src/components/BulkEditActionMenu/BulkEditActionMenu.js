import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';

import {
  Button,
  Icon,
  MultiSelection,
} from '@folio/stripes/components';
import React, { useContext, useState } from 'react';
import { Preloader } from '@folio/stripes-data-transfer-components';
import { useLocation } from 'react-router-dom';
import { ActionMenuGroup } from './ActionMenuGroup/ActionMenuGroup';
import css from './ActionMenuGroup/ActionMenuGroup.css';
import {
  APPROACHES,
  CAPABILITIES,
  getDownloadLinks,
  EDITING_STEPS,
  JOB_STATUSES,
  BULK_VISIBLE_COLUMNS,
  FILE_SEARCH_PARAMS,
  FILE_TO_LINK,
} from '../../constants';
import {
  useBulkPermissions,
  usePathParams,
} from '../../hooks';
import { RootContext } from '../../context/RootContext';
import {
  QUERY_KEY_DOWNLOAD_ACTION_MENU,
  useBulkOperationDetails,
  useFileDownload
} from '../../hooks/api';

const BulkEditActionMenu = ({
  onEdit,
  onToggle,
}) => {
  const intl = useIntl();
  const location = useLocation();
  const perms = useBulkPermissions();
  const search = new URLSearchParams(location.search);
  const capability = search.get('capabilities');
  const step = search.get('step');

  const {
    hasUserEditLocalPerm,
    hasHoldingsInventoryEdit,
    hasItemInventoryEdit,
    hasUserEditInAppPerm,
  } = perms;

  const { id } = usePathParams('/bulk-edit/:id');
  const { bulkDetails, isLoading } = useBulkOperationDetails({ id, additionalQueryKeys: [step] });

  const [fileInfo, setFileInfo] = useState(null);

  const hasEditPerm = (hasHoldingsInventoryEdit && capability === CAPABILITIES.HOLDING)
      || (hasItemInventoryEdit && capability === CAPABILITIES.ITEM)
      || (hasUserEditInAppPerm && capability === CAPABILITIES.USER);


  useFileDownload({
    queryKey: QUERY_KEY_DOWNLOAD_ACTION_MENU,
    enabled: !!fileInfo,
    id,
    fileInfo: {
      fileContentType: FILE_SEARCH_PARAMS[fileInfo?.param],
    },
    onSuccess: data => {
      saveAs(new Blob([data]), fileInfo?.bulkDetails[FILE_TO_LINK[fileInfo?.param]].split('/')[1]);
      setFileInfo(null);
    },
  });

  const { countOfRecords, visibleColumns, setVisibleColumns } = useContext(RootContext);

  const columnsOptions = visibleColumns.map(item => ({
    ...item,
    label: item.ignoreTranslation ? item.label : intl.formatMessage({ id: `ui-bulk-edit.columns.${capability}.${item.label}` }),
  }));

  const selectedValues = columnsOptions.filter(item => item.selected);

  const isStartBulkCsvActive = hasUserEditLocalPerm && capability === CAPABILITIES.USER;
  const isInitialStep = step === EDITING_STEPS.UPLOAD;
  const isStartBulkInAppActive =
       hasEditPerm
    && isInitialStep
    && [JOB_STATUSES.DATA_MODIFICATION, JOB_STATUSES.REVIEW_CHANGES].includes(bulkDetails?.status);

  const handleColumnChange = (values) => {
    if (!values?.length) return;

    const changedColumns = visibleColumns.map(col => {
      return ({
        ...col,
        selected: values.map(({ value }) => value).includes(col.value),
      });
    });

    setVisibleColumns(changedColumns);
    localStorage.setItem(`${BULK_VISIBLE_COLUMNS}_${capability}`, JSON.stringify(changedColumns));
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

    const downloadLinks = getDownloadLinks({ perms, step });

    return downloadLinks.map(l => bulkDetails && Object.hasOwn(bulkDetails, l.KEY) && l.IS_VISIBLE && (
      <Button
        key={l.SEARCH_PARAM}
        buttonStyle="dropdownItem"
        data-testid={l.SEARCH_PARAM}
        onClick={() => handleFileSave({ bulkDetails, param: l.SEARCH_PARAM })}
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
            data-testid="startInAppAction"
            buttonStyle="dropdownItem"
            onClick={() => handleOnStartEdit(APPROACHES.IN_APP)}
          >
            <Icon icon="edit">
              <FormattedMessage id="ui-bulk-edit.start.edit" />
            </Icon>
          </Button>
        )}
        {isStartBulkCsvActive && isInitialStep && countOfRecords > 0 && (
          <Button
            data-testid="startCsvAction"
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
    return (
      <MultiSelection
        placeholder="Select columns"
        dataOptions={columnsOptions}
        value={selectedValues}
        onChange={handleColumnChange}
        backspaceDeletes={false}
      />
    );
  };

  return (
    <div className={css.ActionMenu}>
      <ActionMenuGroup
        title={<FormattedMessage id="ui-bulk-edit.menuGroup.actions" />}
      >
        {renderLinkButtons()}
        {renderStartBulkEditButtons()}
      </ActionMenuGroup>
      <ActionMenuGroup title={<FormattedMessage id="ui-bulk-edit.menuGroup.showColumns" />}>
        {Boolean(columnsOptions.length) && renderColumnsFilter()}
      </ActionMenuGroup>
    </div>
  );
};

BulkEditActionMenu.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default BulkEditActionMenu;
