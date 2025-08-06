import { SearchField } from '@folio/stripes/components';
import React from 'react';
import { useIntl } from 'react-intl';
import css from './BulkEditProfilesPane.css';
import { BulkEditProfiles } from './BulkEditProfiles';

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
