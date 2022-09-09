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
  CRITERIES, CAPABILITIES, translationSuffix,
} from '../../../constants';
import { useJobCommand, useFileUploadComand, useUserGroupsMap, useLaunchJob } from '../../../API';
import { buildQuery } from '../../../hooks';
import { useBulkPermissions } from '../../../hooks/useBulkPermissions';

import css from './BulkEditListFilters.css';
import { RootContext } from '../../../context/RootContext';

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
  } = useBulkPermissions();
  const search = new URLSearchParams(location.search);

  const { criteria, capabilities, recordIdentifier, queryText } = filters;

  const [isDropZoneActive, setDropZoneActive] = useState(false);
  const [isDropZoneDisabled, setIsDropZoneDisabled] = useState(true);
  const { startJob } = useLaunchJob();
  const { userGroups } = useUserGroupsMap();
  const { requestJobId, isLoading } = useJobCommand({ entityType: capabilities });
  const { fileUpload } = useFileUploadComand();
  const { setVisibleColumns } = useContext(RootContext);

  const isCapabilityDisabled = (capabilityValue) => {
    const capabilitiesMap = {
      [CAPABILITIES.USER]: isUserRadioDisabled,
      [CAPABILITIES.ITEM]: isInventoryRadioDisabled,
      [CAPABILITIES.HOLDINGS]: false, // TODO: disable it based on permissions
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
      pathname: location.pathname,
      search: buildSearch({ identifier: e.target.value }, location.search),
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
      search: buildSearch({ capabilities }),
    });

    setIsFileUploaded(false);

    // clear visibleColumns preset
    localStorage.removeItem('visibleColumns');
    setVisibleColumns(null);
  };

  const uploadFileFlow = async (fileToUpload) => {
    setDropZoneActive(false);

    try {
      const { id } = await requestJobId({ recordIdentifier, editType: BULK_EDIT_IDENTIFIERS });

      await fileUpload({ id, fileToUpload });

      // start job manually for ITEM capability only
      if (capabilities === CAPABILITIES.ITEM) {
        startJob({ jobId: id });
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

    search.delete('fileName');

    history.replace({
      pathname: `/bulk-edit/${id}/initial`,
      search: buildSearch({ queryText }, location.search),
    });
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

  const renderTopButtons = () => {
    return (
      <>
        <Button
          buttonStyle={criteria === CRITERIES.IDENTIFIER ? 'primary' : 'default'}
          onClick={() => setFilters(prev => ({ ...prev, criteria: 'identifier' }))}
        >
          <FormattedMessage id="ui-bulk-edit.list.filters.identifier" />
        </Button>
        <Button
          buttonStyle={criteria === CRITERIES.QUERY ? 'primary' : 'default'}
          onClick={() => setFilters(prev => ({ ...prev, criteria: 'query' }))}
        >
          <FormattedMessage id="ui-bulk-edit.list.filters.query" />
        </Button>
      </>
    );
  };

  return (
    <>
      <ButtonGroup fullWidth>
        {renderTopButtons()}
      </ButtonGroup>
      {criteria === CRITERIES.QUERY && (
        <QueryTextArea
          queryText={queryText}
          setQueryText={setFilters}
          handleQuerySearch={handleQuerySearch}
        />
      )}
      {criteria === CRITERIES.IDENTIFIER &&
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
