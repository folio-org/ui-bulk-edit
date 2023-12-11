import { memo, useMemo } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Col,
  Row,
  MultiColumnList,
} from '@folio/stripes/components';
import { PREVIEW_COLUMN_WIDTHS } from '../../../../PermissionsModal/constants/lists';


const PreviewAccordion = ({ contentData, columnMapping, visibleColumns, isInitial, step }) => {
  const translationKey = isInitial ? 'title' : 'titleChanged';
  const maxHeight = window.innerHeight * 0.4;

  const accordionLabel = <FormattedMessage id={`ui-bulk-edit.list.preview.${translationKey}`} />;

  const visibleColumnKeys = useMemo(() => {
    return visibleColumns?.filter(item => !item.selected).map(item => item.value);
  }, [visibleColumns]);

  return (
    <Accordion
      label={accordionLabel}
    >
      <Row>
        <Col xs={12}>
          <MultiColumnList
            striped
            contentData={contentData}
            columnMapping={columnMapping}
            visibleColumns={visibleColumnKeys}
            maxHeight={maxHeight}
            columnIdPrefix={step}
            columnWidths={PREVIEW_COLUMN_WIDTHS}
          />
        </Col>
      </Row>
    </Accordion>
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
