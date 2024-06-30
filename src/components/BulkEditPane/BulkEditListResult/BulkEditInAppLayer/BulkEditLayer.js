import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Button, Layer, Pane, PaneFooter } from '@folio/stripes/components';

import { useSearchParams } from '../../../../hooks';


export const BulkEditLayer = ({
  isLayerOpen,
  isConfirmDisabled,
  onLayerClose,
  onConfirm,
  children,
  ...paneProps
}) => {
  const { approach } = useSearchParams();

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
            disabled={isConfirmDisabled}
          >
            <FormattedMessage id="ui-bulk-edit.layer.confirmChanges" />
          </Button>
        )}
      />
    );
  };

  return (
    <Layer isOpen={isLayerOpen} inRootSet contentLabel={approach}>
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

BulkEditLayer.propTypes = {
  isLayerOpen: PropTypes.bool,
  isConfirmDisabled: PropTypes.bool,
  onLayerClose: PropTypes.func,
  onConfirm: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

