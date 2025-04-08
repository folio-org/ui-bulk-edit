import React, { memo } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion, MultiColumnList } from '@folio/stripes/components';
import { PrevNextPagination } from '@folio/stripes-acq-components';

import { PREVIEW_COLUMN_WIDTHS } from '../../../../PermissionsModal/constants/lists';
import { getVisibleColumnsKeys } from '../../../../../utils/helpers';
import { EDITING_STEPS } from '../../../../../constants';

import css from '../Preview.css';
import { useSearchParams } from '../../../../../hooks';


export const PreviewRecordsAccordion = memo(({
  contentData,
  columnMapping,
  visibleColumns,
  totalRecords,
  pagination,
  onChangePage,
  isFetching,
}) => {
  const { step } = useSearchParams();

  const isInitial = step === EDITING_STEPS.UPLOAD;
  const translationKey = isInitial ? 'title' : 'titleChanged';
  const accordionLabel = <FormattedMessage id={`ui-bulk-edit.list.preview.${translationKey}`} />;
  const visibleColumnKeys = getVisibleColumnsKeys(visibleColumns);

  return (
    <div className={css.previewAccordion}>
      <Accordion
        label={accordionLabel}
      >
        <div className={css.previewAccordionInner}>
          <div className={css.previewAccordionList}>
            <MultiColumnList
              striped
              contentData={contentData}
              columnMapping={columnMapping}
              visibleColumns={visibleColumnKeys}
              columnIdPrefix={step}
              columnWidths={PREVIEW_COLUMN_WIDTHS}
              autosize
              loading={isFetching}
              getCellClassName={css.alignCell}
            />
          </div>
          {contentData.length > 0 && (
            <PrevNextPagination
              {...pagination}
              totalCount={totalRecords}
              disabled={false}
              onChange={onChangePage}
            />
          )}
        </div>
      </Accordion>
    </div>
  );
});

PreviewRecordsAccordion.propTypes = {
  totalRecords: PropTypes.number,
  contentData: PropTypes.arrayOf(PropTypes.object),
  columnMapping: PropTypes.object,
  visibleColumns: PropTypes.arrayOf(PropTypes.object),
  pagination: PropTypes.shape({
    offset: PropTypes.number,
    limit: PropTypes.number,
  }),
  onChangePage: PropTypes.func,
  isFetching: PropTypes.bool,
};
