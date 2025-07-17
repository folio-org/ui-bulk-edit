import { render, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing'; // for expect assertions
import { ActionParameters } from './ActionParameters';
import { ACTIONS, PARAMETERS_KEYS } from '../../../../../../constants';

describe('AdditionalActionParameters', () => {
  const parameters = [
    {
      key: PARAMETERS_KEYS.APPLY_TO_ITEMS,
      value: true
    }
  ];

  const renderParameters = (overrides) => (
    <ActionParameters
      actionParameters={parameters}
      name="name"
      action={ACTIONS.FIND}
      path={[0, 'parameters']}
      onChange={() => {}}
      {...overrides}
    />
  );

  it('renders checkboxes based on action parameters', () => {
    const { getByLabelText } = render(renderParameters());

    expect(getByLabelText(`ui-bulk-edit.layer.action.apply.${PARAMETERS_KEYS.APPLY_TO_ITEMS}`)).toBeInTheDocument();
  });

  it('should render with no axe errors', async () => {
    render(renderParameters());

    await runAxeTest({
      rootNode: document.body,
    });
  });

  it('calls onChange with updated parameters when a checkbox is clicked', () => {
    const mockOnChange = jest.fn();

    const overrideParameters = {
      onChange: mockOnChange
    };

    const { getByLabelText } = render(renderParameters(overrideParameters));

    fireEvent.click(getByLabelText(`ui-bulk-edit.layer.action.apply.${PARAMETERS_KEYS.APPLY_TO_ITEMS}`));

    expect(mockOnChange).toHaveBeenCalledWith({
      path: [0, 'parameters', 'name', 0],
      val: false,
      name: 'value',
    });
  });

  it('shouldn`t render component if there are not params', () => {
    const overrideParameters = {
      actionParameters: [],
    };

    const { queryByText } = render(renderParameters(overrideParameters));

    expect(queryByText(`ui-bulk-edit.layer.action.apply.${PARAMETERS_KEYS.APPLY_TO_ITEMS}`)).toBeNull();
  });

  it('should render component if there are parameters for specific action', () => {
    const overrideParameters = {
      action: ACTIONS.ADD_TO_EXISTING,
      actionParameters: [
        {
          key: PARAMETERS_KEYS.STAFF_ONLY,
          value: false,
          onlyForActions: [ACTIONS.ADD_TO_EXISTING]
        }
      ]
    };

    const { queryByText } = render(renderParameters(overrideParameters));

    expect(queryByText(`ui-bulk-edit.layer.action.apply.${PARAMETERS_KEYS.STAFF_ONLY}`)).not.toBeNull();
  });

  it('should NOT render component if there are parameters for not selected action', () => {
    const overrideParameters = {
      actionParameters: [
        {
          key: PARAMETERS_KEYS.STAFF_ONLY,
          value: false,
          onlyForActions: [ACTIONS.ADD_TO_EXISTING]
        }
      ]
    };

    const { queryByText } = render(renderParameters(overrideParameters));

    expect(queryByText(`ui-bulk-edit.layer.action.apply.${PARAMETERS_KEYS.STAFF_ONLY}`)).toBeNull();
  });
});
