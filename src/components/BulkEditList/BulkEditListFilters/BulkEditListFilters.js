import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';

import {
  Button,
  ButtonGroup,
  Accordion,
  Badge,
  RadioButtonGroup,
  RadioButton,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { useShowCallout, buildSearch } from '@folio/stripes-acq-components';

import { ListSelect } from './ListSelect/ListSelect';
import { QueryTextArea } from './QueryTextArea/QueryTextArea';
import { ListFileUploader } from '../../ListFileUploader';
import {
  BULK_EDIT_QUERY,
  CRITERIA,
  TRANSLATION_SUFFIX,
  EDITING_STEPS,
} from '../../../constants';
import { useJobCommand, useUserGroupsMap } from '../../../hooks/api';
import { useBulkPermissions, useLocationFilters } from '../../../hooks';

import css from './BulkEditListFilters.css';
import { RootContext } from '../../../context/RootContext';
import { LogsFilters } from './LogsFilters/LogsFilters';
import { useUpload } from '../../../hooks/api/useUpload';
import { useBulkOperationStart } from '../../../hooks/api/useBulkOperationStart';
import { buildQuery } from '../../../utills/buildQuery';
import { getCapabilityOptions, isCapabilityDisabled } from '../../../utills/filters';

export const BulkEditListFilters = ({
  filters,
  setFilters,
  isFileUploaded,
  setIsFileUploaded,
}) => {
  const showCallout = useShowCallout();
  const history = useHistory();
  const location = useLocation();
  const search = new URLSearchParams(location.search);

  const {
    isDropZoneDisabled: isDropZoneDisabledPerm,
    isInventoryRadioDisabled,
    isUserRadioDisabled,
    hasInAppEditPerms,
    isSelectIdentifiersDisabled,
    hasLogViewPerms,
  } = useBulkPermissions();

  const capabilitiesFilterOptions = getCapabilityOptions({
    isInventoryRadioDisabled,
    isUserRadioDisabled,
  });

  const initialFilter = {
    capabilities: search.get('capabilities'),
    criteria: CRITERIA.LOGS,
  };

  const onResetData = () => {};

  const [
    activeFilters,
    applyFilters,
    resetFilters,
  ] = useLocationFilters(location, history, onResetData, initialFilter);

  const applyFiltersAdapter = (callBack) => ({ name, values }) => callBack(name, values);
  const adaptedApplyFilters = useCallback(
    applyFiltersAdapter(applyFilters),
    [applyFilters],
  );

  const { capabilities, recordIdentifier, queryText } = filters;
  const criteria = search.get('criteria');
  const isQuery = criteria === CRITERIA.QUERY;
  const isLogs = criteria === CRITERIA.LOGS;
  const isIdentifier = criteria === CRITERIA.IDENTIFIER;

  const [isDropZoneActive, setDropZoneActive] = useState(false);
  const [isDropZoneDisabled, setIsDropZoneDisabled] = useState(true);
  const { userGroups } = useUserGroupsMap();
  const { requestJobId } = useJobCommand({ entityType: capabilities });
  const { fileUpload, isLoading } = useUpload();
  const { bulkOperationStart } = useBulkOperationStart();
  const { setVisibleColumns } = useContext(RootContext);

  const handleChange = (value, field) => setFilters(prev => ({
    ...prev, [field]: value,
  }));

  const handleDragEnter = () => {
    setDropZoneActive(true);
  };

  const handleDragLeave = () => {
    setDropZoneActive(false);
  };

  const handleRecordIdentifierChange = useCallback((e) => {
    handleChange(e.target.value, 'recordIdentifier');

    history.replace({
      pathname: '/bulk-edit',
      search: buildSearch({ identifier: e.target.value, capabilities, criteria }),
    });

    setIsFileUploaded(false);
  }, [location.search]);

  const handleCapabilityChange = (e) => {
    const value = e.target.value;

    setFilters(prev => ({
      ...prev,
      capabilities: value,
      recordIdentifier: '',
    }));

    history.replace({
      pathname: '/bulk-edit',
      search: buildSearch({
        capabilities: value,
        identifier: null,
      }, location.search),
    });

    setIsFileUploaded(false);
    // clear visibleColumns preset
    localStorage.removeItem('visibleColumns');
    setVisibleColumns(null);
  };

  const uploadFileFlow = async (fileToUpload) => {
    try {
      const { id } = await fileUpload({
        fileToUpload,
        entityType: capabilities,
        identifierType: recordIdentifier,
      });

      await bulkOperationStart({
        id,
        step: EDITING_STEPS.UPLOAD,
      });

      search.delete('queryText');

      history.replace({
        pathname: `/bulk-edit/${id}/progress`,
        search: buildSearch({ fileName: fileToUpload.name }, location.search),
      });

      setIsFileUploaded(true);
    } catch ({ message }) {
      showCallout({
        message: <FormattedMessage id="ui-bulk-edit.error.uploadedFile" />,
        type: 'error',
      });
    }
  };

  const handleDrop = async (fileToUpload) => {
    setDropZoneActive(false);

    if (fileToUpload) {
      await uploadFileFlow(fileToUpload);
    }
  };

  const handleQuerySearch = async () => {
    const parsedQuery = buildQuery(queryText, userGroups);

    await requestJobId({
      recordIdentifier,
      editType: BULK_EDIT_QUERY,
      specificParameters: { query: parsedQuery },
    });

    history.replace({
      search: buildSearch({ queryText }, location.search),
    });
  };

  const uploaderSubTitle = useMemo(() => {
    const messagePrefix = recordIdentifier ? `.${recordIdentifier}` : '';

    return <FormattedMessage id={`ui-bulk-edit.uploaderSubTitle${TRANSLATION_SUFFIX[capabilities]}${messagePrefix}`} />;
  }, [recordIdentifier]);

  useEffect(() => {
    if (isFileUploaded || !recordIdentifier) {
      setIsDropZoneDisabled(true);
    } else {
      setIsDropZoneDisabled(false);
    }
  }, [isFileUploaded, recordIdentifier]);

  useEffect(() => {
    const identifier = search.get('identifier');

    if (identifier) {
      handleChange(identifier, 'recordIdentifier');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  /* useEffect(() => {
    const searchStr = buildSearch({ capabilities }, location.search);

    // Replace history only if the search params are different from
    // the current location search params.
    // https://issues.folio.org/browse/UIBULKED-90
    if (location.search !== `?${searchStr}`) {
      history.replace({
        pathname: location.pathname,
        search: searchStr,
      });
    }
  }, [capabilities]); */

  const renderBadge = () => <Badge data-testid="filter-badge">0</Badge>;

  const handleChangeCriteria = (value) => {
    setFilters(prev => ({ ...prev, criteria: value }));
    history.replace({
      search: buildSearch({ criteria: value }, location.search),
    });
  };

  const renderTopButtons = () => {
    return (
      <>
        <Button
          buttonStyle={isIdentifier ? 'primary' : 'default'}
          onClick={() => handleChangeCriteria('identifier')}
        >
          <FormattedMessage id="ui-bulk-edit.list.filters.identifier" />
        </Button>
        <Button
          buttonStyle={isQuery ? 'primary' : 'default'}
          onClick={() => handleChangeCriteria('query')}
        >
          <FormattedMessage id="ui-bulk-edit.list.filters.query" />
        </Button>
        {hasLogViewPerms &&
        <Button
          buttonStyle={isLogs ? 'primary' : 'default'}
          onClick={() => handleChangeCriteria('logs')}

        >
          <FormattedMessage id="ui-bulk-edit.list.filters.logs" />
        </Button>
        }
      </>
    );
  };

  return (
    <>
      <ButtonGroup fullWidth>
        {renderTopButtons()}
      </ButtonGroup>
      {!isLogs && (
      <Accordion
        separator={false}
        closedByDefault={false}
        displayClearButton={!hasInAppEditPerms}
        header={FilterAccordionHeader}
        label={<FormattedMessage id="ui-bulk-edit.list.filters.capabilities.title" />}
      >
        <RadioButtonGroup>
          {capabilitiesFilterOptions?.map(option => (
            <RadioButton
              key={option.value}
              label={option.label}
              name="capabilities"
              value={option.value}
              disabled={option.disabled}
              onChange={handleCapabilityChange}
              checked={option.value === capabilities}
            />
          ))}
        </RadioButtonGroup>
      </Accordion>
      )}
      {isQuery && (
        <QueryTextArea
          queryText={queryText}
          setQueryText={setFilters}
          handleQuerySearch={handleQuerySearch}
        />
      )}
      {isIdentifier &&
      <>
        <ListSelect
          value={recordIdentifier}
          disabled={isSelectIdentifiersDisabled}
          onChange={handleRecordIdentifierChange}
          capabilities={capabilities}
        />
        <ListFileUploader
          className="FileUploaderContainer"
          isLoading={isLoading}
          isDropZoneActive={isDropZoneActive}
          handleDrop={handleDrop}
          isDropZoneDisabled={isDropZoneDisabled || isDropZoneDisabledPerm}
          recordIdentifier={recordIdentifier}
          handleDragLeave={handleDragLeave}
          handleDragEnter={handleDragEnter}
          disableUploader={isCapabilityDisabled(capabilities)}
          uploaderSubTitle={uploaderSubTitle}
        />
      </>
  }
      {
        isLogs && (
        <LogsFilters
          activeFilters={activeFilters}
          onChange={adaptedApplyFilters}
          resetFilter={resetFilters}
        />
        )
      }
      <Accordion
        className={css.accordionHidden}
        closedByDefault
        displayWhenClosed={renderBadge()}
        displayWhenOpen={renderBadge()}
        label={<FormattedMessage id="ui-bulk-edit.list.savedQueries.title" />}
      >
        <div />
      </Accordion>
    </>
  );
};

BulkEditListFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  isFileUploaded: PropTypes.bool.isRequired,
  setIsFileUploaded: PropTypes.func.isRequired,
};
