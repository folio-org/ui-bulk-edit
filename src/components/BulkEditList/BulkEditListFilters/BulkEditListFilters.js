import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  ButtonGroup,
  Accordion,
  Badge,
} from '@folio/stripes/components';
import { AcqCheckboxFilter } from '@folio/stripes-acq-components';

import { ListSelect } from './ListSelect/ListSelect';
import { ListFileUploader } from './ListFileUploader/ListFileUploader';
import { QueryTextArea } from './QueryTextArea/QueryTextArea';
import { buildCheckboxFilterOptions } from './utils';
import { EDIT_CAPABILITIES } from '../../../constants/optionsRecordIdentifiers';

export const BulkEditListFilters = () => {
  const [criteria, setCriteria] = useState('identifier');
  const [isLoading, setLoading] = useState(false);
  const [isDropZoneActive, setDropZoneActive] = useState(false);
  const [filters, setFilter] = useState({
    capabilities: ['users'],
    queryText: '',
  });

  const capabilitiesFilterOptions = buildCheckboxFilterOptions(EDIT_CAPABILITIES);

  const renderIdentifierButton = () => {
    return (
      <Button
        buttonStyle={criteria === 'identifier' ? 'primary' : 'default'}
        onClick={() => { setCriteria('identifier'); }}
      >
        <FormattedMessage id="ui-bulk-edit.list.filters.identifier" />
      </Button>
    );
  };

  const renderQueryButton = () => {
    return (
      <Button
        buttonStyle={criteria === 'query' ? 'primary' : 'default'}
        onClick={() => { setCriteria('query'); }}
      >
        <FormattedMessage id="ui-bulk-edit.list.filters.query" />
      </Button>
    );
  };

  const renderBadge = () => <Badge data-testid="filter-badge">0</Badge>;

  const handleDragEnter = () => {
    setDropZoneActive(true);
  };

  const handleDragLeave = () => {
    setDropZoneActive(false);
  };

  const handleDrop = () => {
    setLoading(false);
    setDropZoneActive(false);
  };

  const hanldeCapabilityChange = (event) => setFilter({
    ...filters, capabilities: event.values,
  });

  return (
    <>
      <ButtonGroup fullWidth>
        {renderIdentifierButton()}
        {renderQueryButton()}
      </ButtonGroup>
      {criteria === 'query' ? <QueryTextArea filters={filters} setQueryText={setFilter} /> : null}
      <ListSelect />
      <ListFileUploader
        isLoading={isLoading}
        isDropZoneActive={isDropZoneActive}
        handleDragEnter={handleDragEnter}
        handleDrop={handleDrop}
        handleDragLeave={handleDragLeave}
      />
      <AcqCheckboxFilter
        labelId="ui-bulk-edit.list.filters.capabilities.title"
        options={capabilitiesFilterOptions}
        name="capabilities"
        activeFilters={filters.capabilities}
        onChange={hanldeCapabilityChange}
        closedByDefault={false}
      />
      <Accordion
        closedByDefault
        displayWhenClosed={renderBadge()}
        displayWhenOpen={renderBadge()}
        label={<FormattedMessage id="ui-bulk-edit.list.savedQueries.title" />}
      />
    </>
  );
};
