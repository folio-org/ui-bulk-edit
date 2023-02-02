import React from 'react';
import { Button, Layer, Pane, PaneFooter } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { isContentUpdatesFormValid } from '../BulkEditInApp/ContentUpdatesForm/helpers';

const BulkEditInAppLayer = ({
  isLayerOpen,
  onLayerClose,
  onConfirm,
  contentUpdates,
  children,
  ...paneProps
}) => {
  const renderPaneFooter = () => {
    return (
      <PaneFooter
        renderStart={(
          <Button
            buttonStyle="default mega"
            id="clickable-cancel"
            marginBottom0
            onClick={onLayerClose}
          >
            <FormattedMessage id="stripes-components.cancel" />
          </Button>
        )}
        renderEnd={(
          <Button
            buttonStyle="primary mega"
            id="clickable-create-widget"
            marginBottom0
            onClick={onConfirm}
            type="submit"
            disabled={!isContentUpdatesFormValid(contentUpdates)}
          >
            <FormattedMessage id="ui-bulk-edit.layer.confirmChanges" />
          </Button>
        )}
      />
    );
  };

  return (
    <Layer isOpen={isLayerOpen} inRootSet>
      <Pane
        {...paneProps}
        dismissible
        footer={renderPaneFooter()}
        onClose={onLayerClose}
      >
        {children}
      </Pane>
    </Layer>
  );
};

BulkEditInAppLayer.propTypes = {
  contentUpdates: PropTypes.arrayOf(PropTypes.object),
  isLayerOpen: PropTypes.bool,
  onLayerClose: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default BulkEditInAppLayer;

