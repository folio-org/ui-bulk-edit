import PropTypes from 'prop-types';
import {
  Headline,
  Accordion,
  AccordionSet,
  Col,
  AccordionStatus,
  Row,
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import { PreviewAccordion } from './PreviewAccordion';

export const Preview = ({ fileUploadedName }) => {
  return (
    <AccordionStatus>
      <Row>
        <Col xs={12}>
          <Headline size="large" margin="medium" tag="h3">
              FileName: {fileUploadedName}
          </Headline>
        </Col>
      </Row>
      <AccordionSet>
        <PreviewAccordion />
        <Accordion label={<FormattedMessage id="ui-bulk-edit.list.errors.title" />}>
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

Preview.propTypes = {
  fileUploadedName: PropTypes.string,
};
