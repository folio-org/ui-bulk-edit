import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Layout, Icon } from '@folio/stripes/components';

import { CRITERIA, TRANSLATION_SUFFIX } from '../../../../constants';

import css from './NoResultsMessage.css';
import { useSearchParams } from '../../../../hooks/useSearchParams';

export const NoResultsMessage = () => {
  const {
    criteria,
    identifier,
    capabilities,
    queryRecordType,
  } = useSearchParams();

  const message = useMemo(() => {
    const getPostfix = () => {
      if (criteria === CRITERIA.IDENTIFIER && identifier) {
        return `.${identifier}`;
      }

      if (criteria === CRITERIA.QUERY) {
        return `.${criteria}`;
      }

      return '';
    };

    const getKey = () => {
      if (criteria === CRITERIA.QUERY) {
        return queryRecordType;
      }

      return capabilities;
    };

    return <FormattedMessage id={`ui-bulk-edit.list.result.emptyMessage${TRANSLATION_SUFFIX[getKey()]}${getPostfix()}`} />;
  }, [identifier, criteria, capabilities, queryRecordType]);

  return (
    <>
      <Layout className="display-flex centerContent">
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div className={css.noResultsMessage} data-testid="empty-message" tabIndex={0}>
          <div className={css.noResultsMessageLabelWrap}>
            <Icon iconRootClass={css.noResultsMessageIcon} icon="arrow-left" />
            <span className={css.noResultsMessageLabel}>
              {message}
            </span>
          </div>
        </div>
      </Layout>
    </>
  );
};
