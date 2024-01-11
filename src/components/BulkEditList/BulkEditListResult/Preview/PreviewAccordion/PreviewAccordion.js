import { memo } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  MultiColumnList,
} from '@folio/stripes/components';
import { PREVIEW_COLUMN_WIDTHS } from '../../../../PermissionsModal/constants/lists';
import { getVisibleColumnsKeys } from '../../../../../utils/helpers';
import css from '../Preview.css';


const PreviewAccordion = ({ contentData, columnMapping, visibleColumns, isInitial, step }) => {
  const translationKey = isInitial ? 'title' : 'titleChanged';

  const accordionLabel = <FormattedMessage id={`ui-bulk-edit.list.preview.${translationKey}`} />;

  const visibleColumnKeys = getVisibleColumnsKeys(visibleColumns);

  return (
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
  );
};

PreviewAccordion.propTypes = {
  contentData: PropTypes.arrayOf(PropTypes.object),
  columnMapping: PropTypes.object,
  visibleColumns: PropTypes.arrayOf(PropTypes.object),
  isInitial: PropTypes.bool,
  step: PropTypes.string,
};

export default memo(PreviewAccordion);
