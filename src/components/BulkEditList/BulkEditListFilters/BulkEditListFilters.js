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
  BULK_EDIT_IDENTIFIERS,
  EDIT_CAPABILITIES,
  BULK_EDIT_QUERY,
  CRITERIA, CAPABILITIES, translationSuffix, TYPE_OF_PROGRESS,
} from '../../../constants';
import { useJobCommand, useFileUploadCommand, useUserGroupsMap, useLaunchJob } from '../../../API';
import { buildQuery, useLocationFilters } from '../../../hooks';
import { useBulkPermissions } from '../../../hooks/useBulkPermissions';

import css from './BulkEditListFilters.css';
import { RootContext } from '../../../context/RootContext';
import { LogsFilters } from './LogsFilters/LogsFilters';
import { useProgressStatus } from '../../../API/useProgressStatus';

export const BulkEditListFilters = ({
  filters,
  setFilters,
  isFileUploaded,
  setIsFileUploaded,
}) => {
  const showCallout = useShowCallout();
  const history = useHistory();
  const location = useLocation();

  const {
    isDropZoneDisabled: isDropZoneDisabledPerm,
    isInventoryRadioDisabled,
    isUserRadioDisabled,
    hasInAppEditPerms,
    isSelectIdentifiersDisabled,
    hasLogViewPerms,
    hasQueryPerms,
    hasQueryAndItemsPerms,
    hasQueryAndHoldingsPerms,
    hasQueryAndUsersPerms,
  } = useBulkPermissions();
  const search = new URLSearchParams(location.search);

  const initialFilter = {
    capabilities: search.get('capabilities'),
    criteria: 'logs',
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

  const hasAnyQueryEditPerms = hasQueryAndItemsPerms
    || hasQueryAndHoldingsPerms
    || hasQueryAndUsersPerms;

  const [isDropZoneActive, setDropZoneActive] = useState(false);
  const [isDropZoneDisabled, setIsDropZoneDisabled] = useState(true);
  const { startJob } = useLaunchJob();
  const { userGroups } = useUserGroupsMap();
  const { requestJobId } = useJobCommand({ entityType: capabilities });
  const { fileUpload, isLoading } = useFileUploadCommand();
  const { setVisibleColumns } = useContext(RootContext);

  const [jobId, setJobId] = useState(null);

  const { setRefetchInterval } = useProgressStatus(jobId, TYPE_OF_PROGRESS.INITIAL, () => {
    search.delete('fileName');

    history.replace({
      search: buildSearch({ queryText }, location.search),
    });

    setJobId(null);
  });

  const isCapabilityDisabled = (capabilityValue) => {
    const capabilitiesMap = {
      [CAPABILITIES.USER]: isQuery ? !hasQueryAndUsersPerms : isUserRadioDisabled,
      [CAPABILITIES.ITEM]: isQuery ? !hasQueryAndItemsPerms : isInventoryRadioDisabled,
      [CAPABILITIES.HOLDINGS]: isQuery ? !hasQueryAndHoldingsPerms : isInventoryRadioDisabled,
    };

    return capabilitiesMap[capabilityValue];
  };

  const capabilitiesFilterOptions = EDIT_CAPABILITIES?.map(capability => ({
    ...capability,
    disabled: isCapabilityDisabled(capability.value),
  }));

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
    setFilters(prev => ({
      ...prev,
      capabilities: e.target.value,
      recordIdentifier: '',
    }));

    history.replace({
      pathname: '/bulk-edit',
      search: buildSearch({
        capabilities,
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
      const { id } = await requestJobId({ recordIdentifier, editType: BULK_EDIT_IDENTIFIERS });

      await fileUpload({ id, fileToUpload });

      // start job manually for ITEM capability only
      if (capabilities === CAPABILITIES.ITEM) {
        await startJob({ jobId: id });
      }

      search.delete('queryText');

      history.replace({
        pathname: `/bulk-edit/${id}/initialProgress`,
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

    const { id } = await requestJobId({
      recordIdentifier,
      editType: BULK_EDIT_QUERY,
      specificParameters: { query: parsedQuery },
    });

    history.replace({
      search: buildSearch({ queryText }, location.search),
    });

    setRefetchInterval(500);
    setJobId(id);
  };

  const uploaderSubTitle = useMemo(() => {
    const messagePrefix = recordIdentifier ? `.${recordIdentifier}` : '';

    return <FormattedMessage id={`ui-bulk-edit.uploaderSubTitle${translationSuffix[capabilities]}${messagePrefix}`} />;
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

  useEffect(() => {
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
  }, [capabilities]);

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
      {(isQuery && hasQueryPerms) && (
        <QueryTextArea
          queryText={queryText}
          setQueryText={setFilters}
          handleQuerySearch={handleQuerySearch}
          disabled={!hasAnyQueryEditPerms}
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
