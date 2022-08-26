import { useContext, useMemo } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Col,
  Row,
  MultiColumnList,
} from '@folio/stripes/components';
import { useCurrentEntityInfo, usePathParams } from '../../../../../hooks';
import { RootContext } from '../../../../../context/RootContext';


const PreviewAccordion = ({ items = [], userGroups = {} }) => {
  const {
    location,
    columns,
    resultsFormatter,
  } = useCurrentEntityInfo({ userGroups });
  const { visibleColumns } = useContext(RootContext);

  const { id: jobId } = usePathParams('/bulk-edit/:id');

  const accordionLabel = useMemo(() => (
    location.pathname === `/bulk-edit/${jobId}/initial` ?
      <FormattedMessage id="ui-bulk-edit.list.preview.title" />
      :
      <FormattedMessage id="ui-bulk-edit.list.preview.titleChanged" />
  ), [location.pathname]);
  const columnMapping = columns.reduce((acc, el) => {
    acc[el.value] = el.label;

    return acc;
  }, {});

  const finalColumns = useMemo(() => {
    const defaultColumns = columns
      .filter(item => item.selected)
      .map(item => item.value);

    const existingColumns = columns.reduce((acc, { value }) => {
      return visibleColumns?.includes(`"${value}"`) ? [...acc, value] : acc;
    }, []);

    return visibleColumns ? existingColumns : defaultColumns;
  }, [visibleColumns, columns]);


  return (
    <Accordion
      label={accordionLabel}
    >
      <Row>
        <Col xs={12}>
          <MultiColumnList
            striped
            contentData={items}
            columnMapping={columnMapping}
            formatter={resultsFormatter}
            visibleColumns={finalColumns}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

PreviewAccordion.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  userGroups: PropTypes.object,
};

export default PreviewAccordion;
