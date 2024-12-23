import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  MultiColumnList,
  Headline,
  Icon,
  TextLink, Layout, Checkbox,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
import { PrevNextPagination } from '@folio/stripes-acq-components';
import css from '../Preview.css';
import { useSearchParams } from '../../../../../hooks';
import { CAPABILITIES, ERROR_PARAMETERS_KEYS } from '../../../../../constants';

const getParam = (error, key) => error.parameters.find(param => param.key === key)?.value;

const columnMapping = {
  type: <FormattedMessage id="ui-bulk-edit.list.errors.table.status" />,
  key: <FormattedMessage id="ui-bulk-edit.list.errors.table.code" />,
  message: <FormattedMessage id="ui-bulk-edit.list.errors.table.message" />,
};

const visibleColumns = Object.keys(columnMapping);

const renderErrorMessage = (error, isLinkAvailable) => {
  const link = getParam(error, ERROR_PARAMETERS_KEYS.LINK);

  return (
    <div>
      {error.message}
      {' '}
      {!!link && isLinkAvailable && (
      <span className={css.errorLink}>
        <TextLink to={link} target="_blank">
          <Icon icon="external-link" size="small" iconPosition="end">
            <FormattedMessage id="ui-bulk-edit.list.errors.table.link" />
          </Icon>
        </TextLink>
      </span>
      )}
    </div>
  );
};

const ErrorsAccordion = ({
  errors = [],
  countOfErrors,
  totalCountOfErrors,
  loading,
  pagination,
  onChangePage,
}) => {
  const { user, okapi } = useStripes();
  const centralTenant = user?.user?.consortium?.centralTenantId;
  const tenantId = okapi.tenant;
  const isCentralTenant = tenantId === centralTenant;
  const { capabilities } = useSearchParams();
  const isLinkAvailable = (isCentralTenant && capabilities === CAPABILITIES.INSTANCE) || !isCentralTenant;

  const resultsFormatter = {
    type: () => <FormattedMessage id="ui-bulk-edit.list.errors.table.status.ERROR" />,
    key: error => getParam(error, ERROR_PARAMETERS_KEYS.IDENTIFIER),
    message: error => renderErrorMessage(error, isLinkAvailable),
  };

  const errorLength = errors.length;

  const [opened, setOpened] = useState(!!errorLength);
  const [showWarnings, setShowWarnings] = useState(false);

  const handleShowWarnings = () => {
    setShowWarnings(prev => !prev);
  };

  return (
    <div className={css.previewAccordion}>
      <Accordion
        open={opened}
        onToggle={() => {
          setOpened(!opened);
        }}
        label={<FormattedMessage id="ui-bulk-edit.list.errors.title" />}
      >
        <div className={css.errorAccordionOuter}>
          <Headline size="medium" margin="small">
            <Layout className="display-flex justified">
              <FormattedMessage
                id="ui-bulk-edit.list.errors.info"
                values={{
                  errors: countOfErrors,
                  warnings: 0,
                }}
              />
              <Checkbox
                label={<FormattedMessage id="ui-bulk-edit.list.errors.checkbox" />}
                checked={showWarnings}
                onChange={handleShowWarnings}
              />
            </Layout>
          </Headline>
          <div className={css.previewAccordionInner}>
            <div className={css.previewAccordionList}>
              <MultiColumnList
                contentData={errors}
                columnMapping={columnMapping}
                formatter={resultsFormatter}
                visibleColumns={visibleColumns}
                loading={loading}
                autosize
              />
            </div>
            {errors.length > 0 && (
              <PrevNextPagination
                {...pagination}
                totalCount={totalCountOfErrors}
                disabled={false}
                onChange={onChangePage}
              />
            )}
          </div>
        </div>
      </Accordion>
    </div>
  );
};

ErrorsAccordion.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.object),
  countOfErrors: PropTypes.number,
  totalCountOfErrors: PropTypes.number,
  loading: PropTypes.bool,
  pagination: {
    limit: PropTypes.number,
    offset: PropTypes.number,
  },
  onChangePage: PropTypes.func,
};

export default ErrorsAccordion;
