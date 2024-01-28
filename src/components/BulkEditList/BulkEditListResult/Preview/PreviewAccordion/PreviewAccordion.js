import React, { memo } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  MultiColumnList,
} from '@folio/stripes/components';
import { PrevNextPagination } from '@folio/stripes-acq-components';
import { PREVIEW_COLUMN_WIDTHS } from '../../../../PermissionsModal/constants/lists';
import { getVisibleColumnsKeys } from '../../../../../utils/helpers';
import css from '../Preview.css';


const PreviewAccordion = ({
  contentData,
  columnMapping,
  visibleColumns,
  isInitial,
  step,
  totalRecords,
  pagination,
  onChangePage,
  isFetching,
}) => {
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
};

PreviewAccordion.propTypes = {
  totalRecords: PropTypes.number,
  contentData: PropTypes.arrayOf(PropTypes.object),
  columnMapping: PropTypes.object,
  visibleColumns: PropTypes.arrayOf(PropTypes.object),
  isInitial: PropTypes.bool,
  step: PropTypes.string,
  pagination: PropTypes.shape({
    offset: PropTypes.number,
    limit: PropTypes.number,
  }),
  onChangePage: PropTypes.func,
  isFetching: PropTypes.bool,
};

export default memo(PreviewAccordion);
