import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import {
  Headline,
  Accordion,
  AccordionSet,
  Col,
  AccordionStatus,
  Row,
} from '@folio/stripes/components';
import { PreviewAccordion } from './PreviewAccordion';

export const Preview = () => {
  const intl = useIntl();
  const location = useLocation();

  const title = useMemo(() => {
    const queryText = new URLSearchParams(location.search).get('queryText');
    const fileUploadedName = new URLSearchParams(location.search).get('fileName');

    return fileUploadedName
      ? intl.formatMessage({ id: 'ui-bulk-edit.preview.file.title' }, { fileUploadedName })
      : intl.formatMessage({ id: 'ui-bulk-edit.preview.query.title' }, { queryText });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <AccordionStatus>
      <Row>
        <Col xs={12}>
          <Headline size="large" margin="medium" tag="h3">
            {title}
          </Headline>
        </Col>
      </Row>
      <AccordionSet>
        <PreviewAccordion />
        <Accordion label={intl.formatMessage({ id: 'ui-bulk-edit.list.errors.title' })}>
          <Row>
            <Col xs={12}>
              <Headline size="medium" margin="xx-small" tag="h4">
                  User-UUIDs.csv: 302 entries * 300 records matched
              </Headline>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
             Errors
            </Col>
          </Row>

        </Accordion>
      </AccordionSet>
    </AccordionStatus>
  );
};
