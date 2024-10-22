import React from 'react';

jest.mock('react-intl', () => {
  const intl = {
    formatDate: value => (value ? value.substring(0, 10) : value),
    formatTime: value => (value ? value.substring(0, 10) : value),
    formatDisplayName: value => value,
    formatMessage: ({ id }) => id,
    formatNumber: value => value,
    messages: [],
  };

  const sharedMockFn = jest.fn(({
    value, children,
  }) => {
    if (children) {
      return children([value]);
    }

    return value;
  });

  return {
    ...jest.requireActual('react-intl'),
    FormattedMessage: jest.fn(({
      id, children,
    }) => {
      if (children) {
        return children([id]);
      }

      return id;
    }),
    FormattedTime: sharedMockFn,
    FormattedNumber: sharedMockFn,
    useIntl: () => intl,
    injectIntl: Component => props => (
      <Component
        {...props}
        intl={intl}
      />
    ),
  };
});
