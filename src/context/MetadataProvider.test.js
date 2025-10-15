import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { MetadataProvider, useMetadata } from './MetadataProvider';

function Consumer() {
  const value = useMetadata();
  return <div data-testid="metadata-value">{JSON.stringify(value)}</div>;
}

describe('MetadataProvider', () => {
  it('provides context value to consumers', () => {
    const testValue = { foo: 'bar' };
    render(
      <MetadataProvider value={testValue}>
        <Consumer />
      </MetadataProvider>
    );
    expect(screen.getByTestId('metadata-value').textContent).toBe(JSON.stringify(testValue));
  });

  it('provides an empty object if value is undefined', () => {
    render(
      <MetadataProvider>
        <Consumer />
      </MetadataProvider>
    );
    expect(screen.getByTestId('metadata-value').textContent).toBe(JSON.stringify({}));
  });

  it('throws if useMetadata is used outside provider', () => {
    // Suppress error output for this test
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    function BadConsumer() {
      useMetadata();
      return null;
    }
    expect(() => render(<BadConsumer />)).toThrow('useMetadata must be used within <MetadataProvider>');
    spy.mockRestore();
  });

  it('updates context value when value prop changes', () => {
    const { rerender } = render(
      <MetadataProvider value={{ a: 1 }}>
        <Consumer />
      </MetadataProvider>
    );
    expect(screen.getByTestId('metadata-value').textContent).toBe(JSON.stringify({ a: 1 }));
    rerender(
      <MetadataProvider value={{ b: 2 }}>
        <Consumer />
      </MetadataProvider>
    );
    expect(screen.getByTestId('metadata-value').textContent).toBe(JSON.stringify({ b: 2 }));
  });
});

