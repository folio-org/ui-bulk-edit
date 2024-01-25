import React, { memo } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  MultiColumnList,
} from '@folio/stripes/components';
import { PrevNextPagination, usePagination } from '@folio/stripes-acq-components';
import { PREVIEW_COLUMN_WIDTHS } from '../../../../PermissionsModal/constants/lists';
import { getVisibleColumnsKeys } from '../../../../../utils/helpers';
import css from '../Preview.css';
import { LOGS_PAGINATION_CONFIG } from '../../../../../constants';


const PreviewAccordion = ({
  contentData,
  columnMapping,
  visibleColumns,
  isInitial,
  step,
  totalRecords,
}) => {
  const translationKey = isInitial ? 'title' : 'titleChanged';

  const accordionLabel = <FormattedMessage id={`ui-bulk-edit.list.preview.${translationKey}`} />;

  const visibleColumnKeys = getVisibleColumnsKeys(visibleColumns);

  const {
    pagination,
    changePage,
  } = usePagination(LOGS_PAGINATION_CONFIG);

  return (
    <>
      <div className={css.previewAccordion}>
        <Accordion
          label={accordionLabel}
        >
          <MultiColumnList
            striped
            contentData={contentData}
            columnMapping={columnMapping}
            visibleColumns={visibleColumnKeys}
            columnIdPrefix={step}
            columnWidths={PREVIEW_COLUMN_WIDTHS}
            autosize
          />
        </Accordion>
      </div>
      {contentData.length > 0 && (
        <PrevNextPagination
          {...pagination}
          totalCount={totalRecords}
          disabled={false}
          onChange={changePage}
        />
      )}
    </>
  );
};

PreviewAccordion.propTypes = {
  totalRecords: PropTypes.number,
  contentData: PropTypes.arrayOf(PropTypes.object),
  columnMapping: PropTypes.object,
  visibleColumns: PropTypes.arrayOf(PropTypes.object),
  isInitial: PropTypes.bool,
  step: PropTypes.string,
};

export default memo(PreviewAccordion);
