import { FormattedMessage } from 'react-intl';
import { Layout, Icon } from '@folio/stripes/components';

import css from './NoResultsMessage.css';

export const NoResultsMessage = () => {
  return (
    <>
      <Layout className="display-flex centerContent">
        <div className={css.noResultsMessage} data-testid="empty-message">
          <div className={css.noResultsMessageLabelWrap}>
            <Icon iconRootClass={css.noResultsMessageIcon} icon="arrow-left" />
            <span className={css.noResultsMessageLabel}>
              <FormattedMessage id="ui-bulk-edit.list.result.emptyMessage" />
            </span>
          </div>
        </div>
      </Layout>
    </>
  );
};

