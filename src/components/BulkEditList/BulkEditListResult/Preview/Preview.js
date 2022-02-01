import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useParams, useLocation } from 'react-router';
import { useIntl, FormattedMessage } from 'react-intl';
import {
  Headline,
  Accordion,
  AccordionSet,
  Col,
  AccordionStatus,
  Row,
  MessageBanner,
} from '@folio/stripes/components';
import { PreviewAccordion } from './PreviewAccordion';
import { useDownloadLinks } from '../../../../API/useDownloadLinks';

export const Preview = () => {
  const intl = useIntl();
  const location = useLocation();
  const { id } = useParams();
  const { data } = useDownloadLinks(id);

  const processed = data?.progress?.processed;
  const fileUploadedName = useMemo(() => new URLSearchParams(location.search).get('fileName'), [location.search]);

  const title = useMemo(() => {
    const queryText = new URLSearchParams(location.search).get('queryText');

    return fileUploadedName
      ? intl.formatMessage({ id: 'ui-bulk-edit.preview.file.title' }, { fileUploadedName })
      : intl.formatMessage({ id: 'ui-bulk-edit.preview.query.title' }, { queryText });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <AccordionStatus>
      {processed && (
        <MessageBanner type="success" contentClassName="SuccessBanner">
          <FormattedMessage
            id="ui-bulk-edit.recordsSuccessfullyChanged"
            values={{ value: processed }}
          />
        </MessageBanner>)
      }
      {fileUploadedName && (
        <Headline size="large" margin="medium" tag="h3">
          {title}
        </Headline>
      )}
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

