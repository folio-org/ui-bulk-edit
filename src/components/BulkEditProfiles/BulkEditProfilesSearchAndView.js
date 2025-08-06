import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { SearchField } from '@folio/stripes/components';

import { BulkEditProfiles } from './BulkEditProfiles';
import css from './BulkEditProfilesPane.css';

export const BulkEditProfilesSearchAndView = ({
  entityType,
  profiles,
  searchTerm,
  sortOrder,
  sortDirection,
  isLoading,
  maxHeight,
  autosize,
  onRowClick,
  onSearchChange,
  onSortingChange,
}) => {
  const intl = useIntl();

  return (
    <>
      <SearchField
        ariaLabel={intl.formatMessage({ id: 'ui-bulk-edit.settings.profiles.search.label' })}
        clearSearchId={`input-${entityType}-search-field-clear-button`}
        id={`input-search-${entityType}-field`}
        loading={isLoading}
        marginBottom0
        onChange={onSearchChange}
        onClear={onSearchChange}
        value={searchTerm}
      />
      <div className={css.profilesList}>
        <BulkEditProfiles
          changeSorting={onSortingChange}
          entityType={entityType}
          isLoading={isLoading}
          profiles={profiles}
          searchTerm={searchTerm}
          sortOrder={sortOrder}
          sortDirection={sortDirection}
          onRowClick={onRowClick}
          maxHeight={maxHeight}
          autosize={autosize}
        />
      </div>
    </>
  );
};

BulkEditProfilesSearchAndView.propTypes = {
  entityType: PropTypes.string.isRequired,
  profiles: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    isActive: PropTypes.bool,
    createdDate: PropTypes.string,
    updatedDate: PropTypes.string,
    createdBy: PropTypes.string,
    updatedBy: PropTypes.string,
  })).isRequired,
  searchTerm: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  maxHeight: PropTypes.string,
  autosize: PropTypes.bool,
  onRowClick: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onSortingChange: PropTypes.func.isRequired,
};
