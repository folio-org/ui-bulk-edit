import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { useStripes } from '@folio/stripes/core';
import {
  Datepicker,
  Select,
  Selection,
  TextField,
  TextArea,
  Loading,
} from '@folio/stripes/components';
import {
  LocationLookup,
  LocationSelection
} from '@folio/stripes/smart-components';
import {
  FindLocation,
  useCurrentUserTenants
} from '@folio/stripes-acq-components';

import {
  BASE_DATE_FORMAT,
  CAPABILITIES,
  CONTROL_TYPES,
  getDuplicateNoteOptions,
  getHoldingsNotes, getInstanceNotes,
  getItemStatusOptions,
  getItemsWithPlaceholder,
  getNotesOptions,
} from '../../../../../constants';
import {
  FIELD_VALUE_KEY,
  TEMPORARY_LOCATIONS
} from './helpers';
import {
  useBulkOperationTenants,
  useHoldingsNotesEsc,
  useItemNotesEsc,
  useLoanTypes,
  usePatronGroup,
  useItemNotes,
  useHoldingsNotes,
  useElectronicAccessRelationships,
  useInstanceNotes,
  useLocationEsc,
  useLoanTypesEsc,
  useElectronicAccessEsc
} from '../../../../../hooks/api';
import { usePreselectedValue } from '../../../../../hooks/usePreselectedValue';
import {
  useSearchParams,
  usePathParams
} from '../../../../../hooks';
import { sortAlphabeticallyWithoutGroups } from '../../../../../utils/sortAlphabetically';
import {
  filterByIds,
  getTenantsById,
  removeDuplicatesByValue
} from '../../../../../utils/helpers';

export const ValuesColumn = ({ action, allActions, actionIndex, onChange, option }) => {
  const { user, okapi } = useStripes();
  const { formatMessage } = useIntl();
  const {
    currentRecordType,
  } = useSearchParams();
  const { id: bulkOperationId } = usePathParams('/bulk-edit/:id');
  const centralTenant = user?.user?.consortium?.centralTenantId;
  const tenantId = okapi.tenant;
  const isCentralTenant = tenantId === centralTenant;

  const isUserCapability = currentRecordType === CAPABILITIES.USER;
  const isItemCapability = currentRecordType === CAPABILITIES.ITEM;
  const isHoldingsCapability = currentRecordType === CAPABILITIES.HOLDING;
  const isInstanceCapability = currentRecordType === CAPABILITIES.INSTANCE;

  const currentTenants = useCurrentUserTenants();
  const { userGroups } = usePatronGroup({ enabled: isUserCapability });
  const { loanTypes, isLoanTypesLoading } = useLoanTypes({ enabled: isItemCapability });
  const { itemNotes, usItemNotesLoading } = useItemNotes({ enabled: isItemCapability });
  const { instanceNotes, isInstanceNotesLoading } = useInstanceNotes({ enabled: isInstanceCapability });
  const { data: tenants } = useBulkOperationTenants(bulkOperationId);
  const { notesEsc: itemsNotes, isFetching: isItemsNotesEscLoading } = useItemNotesEsc(tenants, 'action', { enabled: isItemCapability && Boolean(tenants?.length) });
  const { notesEsc: holdingsNotesEsc, isFetching: isHoldingsNotesEscLoading } = useHoldingsNotesEsc(tenants, 'action', { enabled: isHoldingsCapability && Boolean(tenants?.length) });
  const { locationsEsc, isFetching: isLocationEscLoading } = useLocationEsc(tenants, { enabled: Boolean(tenants?.length) });
  const { escData: loanTypesEsc, isFetching: isLoanTypesEscLoading } = useLoanTypesEsc(tenants, { enabled: Boolean(tenants?.length) });

  const { electronicAccessRelationships, isElectronicAccessLoading } = useElectronicAccessRelationships({ enabled: isHoldingsCapability });
  const { escData: urlRelationshipsEsc, isFetching: isElectronicAccessEscLoading } = useElectronicAccessEsc(tenants, { enabled: Boolean(tenants?.length) });
  // exclude from second action the first action value
  const filteredElectronicAccessRelationships = electronicAccessRelationships.filter(item => actionIndex === 0 || item.value !== allActions[0]?.value);
  const filteredElectronicAccessRelationshipsEsc = urlRelationshipsEsc?.filter(item => actionIndex === 0 || item.value !== allActions[0]?.value);
  const accessRelationshipsWithPlaceholder = getItemsWithPlaceholder(isCentralTenant ? removeDuplicatesByValue(filteredElectronicAccessRelationshipsEsc, tenants) : filteredElectronicAccessRelationships);

  const { holdingsNotes, isHoldingsNotesLoading } = useHoldingsNotes({ enabled: isHoldingsCapability });
  const duplicateNoteOptions = getDuplicateNoteOptions(formatMessage).filter(el => el.value !== option);

  const filteredAndMappedNotes = getNotesOptions(formatMessage, isCentralTenant ? removeDuplicatesByValue(itemsNotes, tenants) : itemNotes)
    .filter(obj => obj.value !== option)
    .map(({ label, value, tenant }) => ({ label, value, tenant }));

  const filteredAndMappedHoldingsNotes = getHoldingsNotes(formatMessage, isCentralTenant ? removeDuplicatesByValue(holdingsNotesEsc, tenants) : holdingsNotes)
    .filter(obj => obj.value !== option)
    .map(({ label, value, disabled, tenant }) => ({ label, value, disabled, tenant }));

  const filteredAndMappedInstanceNotes = getInstanceNotes(formatMessage, instanceNotes)
    .filter(obj => obj.value !== option)
    .map(({ label, value, disabled }) => ({ label, value, disabled }));

  const sortWithoutPlaceholder = (array) => {
    const [placeholder, ...rest] = array;

    return [placeholder, ...rest.sort((a, b) => a.label.localeCompare(b.label))];
  };

  function getLabelByValue(items, targetValue) {
    const item = items.find((labeledValue) => labeledValue.value === targetValue);
    return item ? item.label : undefined;
  }
  const sortedNotes = sortWithoutPlaceholder(filteredAndMappedNotes);
  const sortedHoldingsNotes = sortWithoutPlaceholder(filteredAndMappedHoldingsNotes);
  const sortedInstanceNotes = sortWithoutPlaceholder(filteredAndMappedInstanceNotes);

  const statuses = getItemStatusOptions(formatMessage);
  const actionValue = action.value;
  const controlType = action.controlType(action.name);

  usePreselectedValue(controlType, duplicateNoteOptions, onChange, actionIndex);

  const renderTextField = () => controlType === CONTROL_TYPES.INPUT && (
    <TextField
      value={actionValue}
      onChange={e => onChange({ actionIndex, value: e.target.value, fieldName: FIELD_VALUE_KEY })}
      data-testid={`input-email-${actionIndex}`}
      aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.textField' })}
      marginBottom0
      dirty={!!actionValue}
    />
  );

  const renderTextArea = () => controlType === CONTROL_TYPES.TEXTAREA && (
    <TextArea
      value={actionValue}
      onChange={e => onChange({ actionIndex, value: e.target.value, fieldName: FIELD_VALUE_KEY })}
      data-testid={`input-textarea-${actionIndex}`}
      aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.textArea' })}
      marginBottom0
      dirty={!!actionValue}
      fullWidth
      lockWidth
    />
  );

  const renderPatronGroupSelect = () => {
    const patronGroups = sortAlphabeticallyWithoutGroups(Object.values(userGroups).reduce(
      (acc, { id, group, desc }) => {
        const description = desc ? `(${desc})` : '';
        const groupObject = {
          value: id,
          label: `${group} ${description}`,
        };

        acc.push(groupObject);

        return acc;
      },
      [
        {
          value: '',
          label: formatMessage({ id: 'ui-bulk-edit.layer.selectPatronGroup' }),
        },
      ],
    ), formatMessage({ id: 'ui-bulk-edit.layer.selectPatronGroup' }));

    return controlType === CONTROL_TYPES.PATRON_GROUP_SELECT && (
      <div title={getLabelByValue(patronGroups, actionValue)}>
        <Select
          dataOptions={patronGroups}
          value={actionValue}
          onChange={e => onChange({ actionIndex, value: e.target.value, fieldName: FIELD_VALUE_KEY })}
          data-testid={`select-patronGroup-${actionIndex}`}
          aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.patronGroupSelect' })}
          marginBottom0
          dirty={!!actionValue}
        />
      </div>
    );
  };

  const renderDatepicker = () => controlType === CONTROL_TYPES.DATE && (
    <Datepicker
      value={actionValue}
      onChange={(e, value, formattedValue) => {
        onChange({ actionIndex, value: formattedValue, fieldName: FIELD_VALUE_KEY });
      }}
      data-testid={`dataPicker-experation-date-${actionIndex}`}
      backendDateStandard={BASE_DATE_FORMAT}
      aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.date' })}
      marginBottom0
      dirty={!!actionValue}
    />
  );

  const renderLocationSelect = () => (
    controlType === CONTROL_TYPES.LOCATION && (
      <>
        {isCentralTenant ? (
          <div title={getLabelByValue(locationsEsc, actionValue)}>
            <Selection
              id="locations-esc"
              loading={isLocationEscLoading}
              value={actionValue}
              dataOptions={locationsEsc}
              disabled
            />
            <FindLocation
              id="fund-locations"
              crossTenant
              tenantsList={filterByIds(currentTenants, tenants)}
              tenantId={tenants[0]}
              onRecordsSelect={(loc) => {
                onChange({
                  actionIndex,
                  value: loc[0].id,
                  fieldName: FIELD_VALUE_KEY,
                  tenants: getTenantsById(removeDuplicatesByValue(locationsEsc, tenants), loc[0].id)
                });
              }}
            />
          </div>
        ) : (
          <div title={getLabelByValue(locationsEsc, actionValue)}>
            <LocationSelection
              value={actionValue}
              onSelect={(loc) => onChange({ actionIndex, value: loc?.id, fieldName: FIELD_VALUE_KEY })}
              placeholder={formatMessage({ id: 'ui-bulk-edit.layer.selectLocation' })}
              data-test-id={`textField-${actionIndex}`}
              aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.location' })}
              dirty={!!actionValue}
            />
            <LocationLookup
              marginBottom0
              isTemporaryLocation={TEMPORARY_LOCATIONS.includes(option)}
              onLocationSelected={(loc) => onChange({
                actionIndex,
                value: loc.id,
                fieldName: FIELD_VALUE_KEY,
              })
                      }
              data-testid={`locationLookup-${actionIndex}`}
            />
          </div>
        )}
      </>
    )
  );

  const renderStatusSelect = () => controlType === CONTROL_TYPES.STATUS_SELECT && (
    <div title={getLabelByValue(statuses, actionValue)}>
      <Select
        dataOptions={statuses}
        value={actionValue}
        onChange={e => onChange({ actionIndex, value: e.target.value, fieldName: FIELD_VALUE_KEY })}
        data-testid={`select-statuses-${actionIndex}`}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.statusSelect' })}
        marginBottom0
        dirty={!!actionValue}
      />
    </div>
  );

  const renderLoanTypeSelect = () => controlType === CONTROL_TYPES.LOAN_TYPE && (
    isLoanTypesEscLoading ?
      <Loading size="large" />
      :
      <div title={getLabelByValue(isCentralTenant ? removeDuplicatesByValue(loanTypesEsc, tenants) : loanTypes, actionValue)}>
        <Selection
          id="loanType"
          value={actionValue}
          loading={isLoanTypesLoading}
          onChange={value => {
            onChange(
              {
                actionIndex,
                value,
                fieldName: FIELD_VALUE_KEY,
                tenants: getTenantsById(removeDuplicatesByValue(loanTypesEsc, tenants), value)
              }
            );
          }}
          placeholder={formatMessage({ id: 'ui-bulk-edit.layer.selectLoanType' })}
          dataOptions={isCentralTenant ? removeDuplicatesByValue(loanTypesEsc, tenants) : loanTypes}
          aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.loanTypeSelect' })}
          dirty={!!actionValue}
        />
      </div>
  );

  const renderNoteTypeSelect = () => controlType === CONTROL_TYPES.NOTE_SELECT && (
    <>
      {isHoldingsCapability && (
        isHoldingsNotesEscLoading ?
          <Loading size="large" />
          :
          <div title={getLabelByValue(sortedHoldingsNotes, action.value)}>
            <Select
              id="noteHoldingsType"
              value={action.value}
              loading={isHoldingsNotesLoading}
              onChange={e => onChange(
                {
                  actionIndex,
                  value: e.target.value,
                  fieldName: FIELD_VALUE_KEY,
                  tenants: getTenantsById(sortedHoldingsNotes, e.target.value)
                }
              )}
              dataOptions={sortedHoldingsNotes}
              aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.loanTypeSelect' })}
              marginBottom0
              dirty={!!action.value}
            />
          </div>
      )}
      {isItemCapability && (
        isItemsNotesEscLoading ?
          <Loading size="large" />
          :
          <div title={getLabelByValue(sortedNotes, action.value)}>
            <Select
              id="noteType"
              value={action.value}
              disabled={usItemNotesLoading || isItemsNotesEscLoading}
              onChange={e => onChange({
                actionIndex,
                value: e.target.value,
                fieldName: FIELD_VALUE_KEY,
                tenants: getTenantsById(sortedNotes, e.target.value),
              })}
              dataOptions={sortedNotes}
              aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.loanTypeSelect' })}
              marginBottom0
              dirty={!!actionValue}
            />
          </div>
      )}
      {isInstanceCapability && (
        <div title={getLabelByValue(sortedInstanceNotes, actionValue)}>
          <Select
            id="noteInstanceType"
            value={action.value}
            loading={isInstanceNotesLoading}
            onChange={e => onChange({ actionIndex, value: e.target.value, fieldName: FIELD_VALUE_KEY })}
            dataOptions={sortedInstanceNotes}
            aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.loanTypeSelect' })}
            marginBottom0
            dirty={!!action.value}
          />
        </div>
      )}
    </>
  );

  const renderNoteDuplicateTypeSelect = () => controlType === CONTROL_TYPES.NOTE_DUPLICATE_SELECT && (
    <div title={getLabelByValue(duplicateNoteOptions, action.value)}>
      <Select
        id="noteTypeDuplicate"
        value={action.value}
        disabled
        onChange={e => onChange({ actionIndex, value: e.target.value, fieldName: FIELD_VALUE_KEY })}
        dataOptions={duplicateNoteOptions}
        aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.loanTypeSelect' })}
        marginBottom0
        dirty={!!actionValue}
      />
    </div>
  );

  const renderElectronicAccessRelationshipSelect = () => controlType === CONTROL_TYPES.ELECTRONIC_ACCESS_RELATIONSHIP_SELECT && (
    isElectronicAccessEscLoading ?
      <Loading size="large" />
      :
      <div title={getLabelByValue(accessRelationshipsWithPlaceholder, action.value)}>
        <Select
          id="urlRelationship"
          value={action.value}
          loading={isElectronicAccessLoading || isElectronicAccessEscLoading}
          onChange={e => onChange(
            {
              actionIndex,
              value: e.target.value,
              fieldName: FIELD_VALUE_KEY,
              tenants: getTenantsById(accessRelationshipsWithPlaceholder, e.target.value)
            }
          )}
          dataOptions={accessRelationshipsWithPlaceholder}
          aria-label={formatMessage({ id: 'ui-bulk-edit.ariaLabel.urlRelationshipSelect' })}
          marginBottom0
          dirty={!!actionValue}
        />
      </div>
  );

  return (
    <>
      {renderTextField()}
      {renderTextArea()}
      {renderPatronGroupSelect()}
      {renderDatepicker()}
      {renderLocationSelect()}
      {renderStatusSelect()}
      {renderLoanTypeSelect()}
      {renderNoteTypeSelect()}
      {renderNoteDuplicateTypeSelect()}
      {renderElectronicAccessRelationshipSelect()}
    </>
  );
};

ValuesColumn.propTypes = {
  option: PropTypes.string,
  action: PropTypes.shape({
    controlType: PropTypes.func,
    name: PropTypes.string,
    value: PropTypes.string,
  }),
  actionIndex: PropTypes.number,
  allActions: PropTypes.arrayOf(PropTypes.shape({
    controlType: PropTypes.func,
    name: PropTypes.string,
    value: PropTypes.string,
  })),
  onChange: PropTypes.func,
};
