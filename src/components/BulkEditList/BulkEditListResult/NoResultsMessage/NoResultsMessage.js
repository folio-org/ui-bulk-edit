import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Layout, Icon } from '@folio/stripes/components';

import { CAPABILITIES } from '../../../../constants/constants';

import css from './NoResultsMessage.css';

export const NoResultsMessage = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const capabilities = search.get('capabilities');

  const message = useMemo(() => {
    const identifier = new URLSearchParams(location.search).get('identifier');
    const messagePrefix = identifier ? `.${identifier}` : '';

    return capabilities === CAPABILITIES.USER ? <FormattedMessage id={`ui-bulk-edit.list.result.emptyMessage${messagePrefix}`} />
      :
    <FormattedMessage id={`ui-bulk-edit.list.result.emptyMessage.item${messagePrefix}`} />;
  }, [location.search]);

  return (
    <>
      <Layout className="display-flex centerContent">
        <div className={css.noResultsMessage} data-testid="empty-message">
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
