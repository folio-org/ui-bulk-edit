import React, { useContext, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
  TextField,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';
import { Preloader } from '@folio/stripes-data-transfer-components';

import { useStripes } from '@folio/stripes/core';
import { ActionMenuGroup } from './ActionMenuGroup/ActionMenuGroup';
import {
  APPROACHES,
  CAPABILITIES,
  getDownloadLinks,
  EDITING_STEPS,
  JOB_STATUSES,
  BULK_VISIBLE_COLUMNS,
  CRITERIA, RECORD_TYPES_PROFILES_MAPPING,
} from '../../constants';
import {
  useBulkPermissions,
  usePathParams,
  useSearchParams
} from '../../hooks';
import { RootContext } from '../../context/RootContext';
import { useBulkOperationDetails } from '../../hooks/api';
import { getVisibleColumnsKeys } from '../../utils/helpers';

import css from './ActionMenuGroup/ActionMenuGroup.css';

const BulkEditActionMenu = ({
  onEdit,
  onSelectProfile,
  onToggle,
  setFileInfo,
}) => {
  const stripes = useStripes();
  const intl = useIntl();
  const perms = useBulkPermissions();
  const {
    step,
    currentRecordType,
    criteria,
  } = useSearchParams();

  const [columnSearch, setColumnSearch] = useState('');

  const {
    hasUserEditLocalPerm,
    hasHoldingsInventoryEdit,
    hasItemInventoryEdit,
    hasUserEditInAppPerm,
    hasInstanceInventoryEdit,
    hasInstanceAndMarcEditPerm,
    hasInventoryAndMarcEditPerm,
  } = perms;

  const { id } = usePathParams('/bulk-edit/:id');
  const { bulkDetails, isLoading } = useBulkOperationDetails({ id });

  const hasEditPerm = (hasHoldingsInventoryEdit && currentRecordType === CAPABILITIES.HOLDING)
      || (hasItemInventoryEdit && currentRecordType === CAPABILITIES.ITEM)
      || (hasUserEditInAppPerm && currentRecordType === CAPABILITIES.USER)
      || (hasInstanceInventoryEdit && currentRecordType === CAPABILITIES.INSTANCE);

  const { countOfRecords, visibleColumns, setVisibleColumns } = useContext(RootContext);
  const columns = visibleColumns || [];
  const visibleColumnKeys = getVisibleColumnsKeys(columns);

  const isECS = stripes.user?.user?.consortium;
  const isStartBulkCsvActive = hasUserEditLocalPerm && currentRecordType === CAPABILITIES.USER;
  const isInitialStep = step === EDITING_STEPS.UPLOAD;
  const isStartBulkInAppActive =
       hasEditPerm
    && isInitialStep
    && [JOB_STATUSES.DATA_MODIFICATION, JOB_STATUSES.REVIEW_CHANGES, JOB_STATUSES.REVIEWED_NO_MARC_RECORDS].includes(bulkDetails?.status);
  const isStartMarcActive = (isStartBulkInAppActive || hasInstanceAndMarcEditPerm || hasInventoryAndMarcEditPerm) && currentRecordType === CAPABILITIES.INSTANCE && isInitialStep
  && [JOB_STATUSES.DATA_MODIFICATION, JOB_STATUSES.REVIEW_CHANGES, JOB_STATUSES.REVIEWED_NO_MARC_RECORDS].includes(bulkDetails?.status);

  const isStartManualButtonVisible = isStartBulkCsvActive && isInitialStep && countOfRecords > 0 && criteria !== CRITERIA.QUERY && !isECS;

  const isLastUnselectedColumn = (value) => {
    return visibleColumnKeys?.length === 1 && visibleColumnKeys?.[0] === value;
  };

  const columnsOptions = columns.map(item => ({
    ...item,
    label: item.ignoreTranslation ? item.label : intl.formatMessage({ id: `ui-bulk-edit.columns.${currentRecordType}.${item.label}` }),
    disabled: isLastUnselectedColumn(item.value) || !countOfRecords,
  }));

  const handleColumnChange = ({ values }) => {
    const changedColumns = columns.map(col => {
      return ({
        ...col,
        selected: values.includes(col.value),
      });
    });

    setVisibleColumns(changedColumns);
    localStorage.setItem(`${BULK_VISIBLE_COLUMNS}_${currentRecordType}`, JSON.stringify(changedColumns));
  };

  const handleOnStartEdit = (approach) => {
    onToggle();
    onEdit(approach);
  };

  const handleSelectProfile = () => {
    onToggle();
    onSelectProfile();
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
        {isStartBulkInAppActive && currentRecordType !== CAPABILITIES.INSTANCE && (
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
        {isStartMarcActive && (
          <ActionMenuGroup
            title={<FormattedMessage id="ui-bulk-edit.menuGroup.startEdit" />}
          >
            {isStartBulkInAppActive && (
            <Button
              data-testid="startInAppAction"
              buttonStyle="dropdownItem"
              onClick={() => handleOnStartEdit(APPROACHES.IN_APP)}
            >
              <Icon icon="edit">
                <FormattedMessage id="ui-bulk-edit.start.edit.instance" />
              </Icon>
            </Button>
            )}
            {(hasInstanceAndMarcEditPerm || hasInventoryAndMarcEditPerm) && (
              <Button
                data-testid="startMarcAction"
                buttonStyle="dropdownItem"
                onClick={() => handleOnStartEdit(APPROACHES.MARC)}
              >
                <Icon icon="edit">
                  <FormattedMessage id="ui-bulk-edit.start.edit.marc" />
                </Icon>
              </Button>
            )}
          </ActionMenuGroup>
        )}
        {isStartManualButtonVisible && (
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

        {isStartBulkInAppActive && (
          <Button
            data-testid="selectProfile"
            buttonStyle="dropdownItem"
            onClick={() => handleSelectProfile()}
          >
            <Icon icon="edit">
              <FormattedMessage
                id="ui-bulk-edit.previewModal.selectProfiles"
                values={{ entityType: RECORD_TYPES_PROFILES_MAPPING[currentRecordType] }}
              />
            </Icon>
          </Button>
        )}
      </>
    );
  };

  const renderColumnsFilter = () => {
    const filteredColumns = columnsOptions
      .filter(item => item.label.toLowerCase().includes(columnSearch.toLowerCase()));

    const allDisabled = columnsOptions.every(item => item.disabled);

    return (
      <div className={css.ActionMenu}>
        <TextField
          value={columnSearch}
          onChange={e => setColumnSearch(e.target.value)}
          aria-label={intl.formatMessage({ id: 'ui-bulk-edit.ariaLabel.columnFilter' })}
          disabled={allDisabled}
          placeholder={intl.formatMessage({ id: 'ui-bulk-edit.actionMenu.placeholder' })}
        />
        <CheckboxFilter
          dataOptions={filteredColumns}
          name="filter"
          onChange={handleColumnChange}
          selectedValues={visibleColumnKeys}
        />
      </div>
    );
  };

  return (
    <>
      {renderLinkButtons()}
      {renderStartBulkEditButtons()}
      {columnsOptions.length > 0 && (
        <ActionMenuGroup title={<FormattedMessage id="ui-bulk-edit.menuGroup.showColumns" />}>
          {renderColumnsFilter()}
        </ActionMenuGroup>
      )}
    </>
  );
};

BulkEditActionMenu.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  setFileInfo: PropTypes.func.isRequired,
  onSelectProfile: PropTypes.func.isRequired,
};

export default BulkEditActionMenu;
