import { memo, useMemo } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Col,
  Row,
  MultiColumnList,
} from '@folio/stripes/components';
import { useCurrentEntityInfo, usePathParams } from '../../../../../hooks';


const PreviewAccordion = ({ items = [], userGroups = {} }) => {
  const {
    location,
    columns,
    resultsFormatter,
    searchParams,
  } = useCurrentEntityInfo({ userGroups });

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

  const visibleColumns = useMemo(() => {
    const paramsColumns = searchParams.get('selectedColumns');

    const defaultColumns = columns
      .filter(item => item.selected)
      .map(item => item.value);

    const existingColumns = columns.reduce((acc, { value }) => (
      paramsColumns?.includes(`"${value}"`) ? [...acc, value] : acc
    ), []);

    return paramsColumns ? existingColumns : defaultColumns;
  }, [location.search, columns]);


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
            visibleColumns={visibleColumns}
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

export default memo(PreviewAccordion);
