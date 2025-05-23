import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  AccordionSet,
  Accordion,
  FilterAccordionHeader,
  Selection,
  dayjs,
} from '@folio/stripes/components';
import {
  createClearFilterHandler,
  DATE_FORMAT,
  ResetButton,
} from '@folio/stripes-acq-components';
import {
  CheckboxFilter,
  DateRangeFilter,
} from '@folio/stripes/smart-components';

import React, { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  LOGS_FILTERS,
  FILTER_OPTIONS,
  CRITERIA,
} from '../../../../constants';
import { useBulkOperationUsers } from '../../../../hooks/api/useBulkOperationUsers';
import { getFullName } from '../../../../utils/getFullName';
import { useLocationFilters, useLogsQueryParams, useSearchParams } from '../../../../hooks';
import { customFilter, getTransformedLogsFilterValue } from '../../../../utils/helpers';


export const LogsTab = () => {
  const intl = useIntl();
  const location = useLocation();
  const {
    step,
    initialFileName,
    identifier,
    capabilities,
    queryRecordType,
    progress,
  } = useSearchParams();

  const [
    activeFilters,
    applyFilters,
    resetFilters,
  ] = useLocationFilters({
    initialFilter: {
      step,
      identifier,
      capabilities,
      queryRecordType,
      criteria: CRITERIA.LOGS,
      fileName: initialFileName,
      progress,
    }
  });

  const adaptedApplyFilters = useCallback(({ name, values }) => {
    return applyFilters(name, getTransformedLogsFilterValue(values));
  }, [applyFilters]);

  const { logsQueryParams } = useLogsQueryParams({ search: location.search });

  const { data } = useBulkOperationUsers(logsQueryParams);

  const userOptions = data?.users.map(({ id, firstName, lastName, middleName, preferredFirstName }) => ({
    label: getFullName({ firstName, lastName, middleName, preferredFirstName }),
    value: id,
  })) || [];

  const getDateRange = filterValue => {
    let dateRange = {
      startDate: '',
      endDate: '',
    };

    if (filterValue) {
      const [startDateString, endDateString] = filterValue[0].split(':');
      const endDate = dayjs.utc(endDateString);
      const startDate = dayjs.utc(startDateString);

      dateRange = {
        startDate: startDate.isValid()
          ? startDate.format(DATE_FORMAT)
          : '',
        endDate: endDate.isValid()
          ? endDate.subtract(1, 'days').format(DATE_FORMAT)
          : '',
      };
    }

    return dateRange;
  };

  const getDateFilter = (startDate, endDate) => {
    const endDateCorrected = dayjs.utc(endDate).add(1, 'day').format(DATE_FORMAT);

    return `${startDate}:${endDateCorrected}`;
  };

  const getIsDisabled = () => Object.values(LOGS_FILTERS).some((el) => location.search.includes(el));

  return (
    <div data-testid="logsFilters">
      <AccordionSet>
        <ResetButton
          id="reset-export-filters"
          disabled={!getIsDisabled()}
          reset={resetFilters}
          label={<FormattedMessage id="ui-bulk-edit.resetFilters" />}
        />
        <Accordion
          closedByDefault={false}
          displayClearButton={!!activeFilters[LOGS_FILTERS.STATUS]}
          header={FilterAccordionHeader}
          id={LOGS_FILTERS.STATUS}
          label={<FormattedMessage id="ui-bulk-edit.logs.filter.title.status" />}
          onClearFilter={createClearFilterHandler(adaptedApplyFilters, LOGS_FILTERS.STATUS)}
        >
          <CheckboxFilter
            dataOptions={FILTER_OPTIONS.STATUS}
            name={LOGS_FILTERS.STATUS}
            selectedValues={activeFilters[LOGS_FILTERS.STATUS]}
            onChange={adaptedApplyFilters}
          />
        </Accordion>
        <Accordion
          closedByDefault={false}
          displayClearButton={!!activeFilters[LOGS_FILTERS.CAPABILITY]}
          header={FilterAccordionHeader}
          id={LOGS_FILTERS.CAPABILITY}
          label={<FormattedMessage id="ui-bulk-edit.logs.filter.title.capability" />}
          onClearFilter={createClearFilterHandler(adaptedApplyFilters, LOGS_FILTERS.CAPABILITY)}
        >
          <CheckboxFilter
            dataOptions={FILTER_OPTIONS.CAPABILITY}
            name={LOGS_FILTERS.CAPABILITY}
            selectedValues={activeFilters[LOGS_FILTERS.CAPABILITY]}
            onChange={adaptedApplyFilters}
          />
        </Accordion>
        <Accordion
          closedByDefault
          displayClearButton={!!activeFilters[LOGS_FILTERS.START_DATE]}
          header={FilterAccordionHeader}
          id={LOGS_FILTERS.START_DATE}
          label={<FormattedMessage id="ui-bulk-edit.logs.filter.startDate" />}
          onClearFilter={createClearFilterHandler(adaptedApplyFilters, LOGS_FILTERS.START_DATE)}
        >
          <DateRangeFilter
            name={LOGS_FILTERS.START_DATE}
            selectedValues={getDateRange(activeFilters[LOGS_FILTERS.START_DATE])}
            makeFilterString={getDateFilter}
            dateFormat={DATE_FORMAT}
            onChange={adaptedApplyFilters}
          />
        </Accordion>
        <Accordion
          closedByDefault
          displayClearButton={!!activeFilters[LOGS_FILTERS.END_DATE]}
          header={FilterAccordionHeader}
          id={LOGS_FILTERS.END_DATE}
          label={<FormattedMessage id="ui-bulk-edit.logs.filter.endDate" />}
          onClearFilter={createClearFilterHandler(adaptedApplyFilters, LOGS_FILTERS.END_DATE)}
        >
          <DateRangeFilter
            name={LOGS_FILTERS.END_DATE}
            selectedValues={getDateRange(activeFilters[LOGS_FILTERS.END_DATE])}
            makeFilterString={getDateFilter}
            dateFormat={DATE_FORMAT}
            onChange={adaptedApplyFilters}
          />
        </Accordion>
        <Accordion
          closedByDefault
          displayClearButton={!!activeFilters[LOGS_FILTERS.USER]}
          header={FilterAccordionHeader}
          id={LOGS_FILTERS.USER}
          label={<FormattedMessage id="ui-bulk-edit.logs.filter.title.user" />}
          onClearFilter={createClearFilterHandler(adaptedApplyFilters, LOGS_FILTERS.USER)}
        >
          <Selection
            placeholder={intl.formatMessage({ id: 'ui-bulk-edit.logs.filter.user.placeholder' })}
            dataOptions={userOptions}
            emptyMessage={intl.formatMessage({ id: 'ui-bulk-edit.logs.filter.user.placeholder.empty' })}
            value={activeFilters[LOGS_FILTERS.USER]?.toString()}
            onChange={values => adaptedApplyFilters({ name: LOGS_FILTERS.USER, values })}
            onFilter={customFilter}
          />
        </Accordion>
      </AccordionSet>
    </div>
  );
};
