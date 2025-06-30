import { validationSchema } from './validation';
import { ACTIONS, OPTIONS } from '../../../../constants';

describe('validationSchema', () => {
  const nonFinalActionName = ACTIONS.FIND;
  const finalActionName = ACTIONS.CLEAR_FIELD;

  it('should validate a simple valid case with string value for non-final action', async () => {
    const data = [
      {
        option: OPTIONS.ADMINISTRATIVE_NOTE,
        actionsDetails: {
          actions: [
            { name: nonFinalActionName, value: 'some text' },
          ],
        },
      },
    ];
    await expect(validationSchema.validate(data)).resolves.toEqual(data);
  });

  it('should reject if option is missing', async () => {
    const data = [
      {
        actionsDetails: {
          actions: [
            { name: nonFinalActionName, value: 'x' },
          ],
        },
      },
    ];
    await expect(validationSchema.validate(data)).rejects.toThrow(/option is a required field/);
  });

  it('should reject if actions is not an array', async () => {
    const data = [
      {
        option: OPTIONS.ADMINISTRATIVE_NOTE,
        actionsDetails: {
          actions: { name: nonFinalActionName, value: 'x' },
        },
      },
    ];
    await expect(validationSchema.validate(data)).rejects.toThrow(/actions must be a `array` type/);
  });

  it('should reject if non-final action has empty string value', async () => {
    const data = [
      {
        option: OPTIONS.ADMINISTRATIVE_NOTE,
        actionsDetails: {
          actions: [
            { name: nonFinalActionName, value: '' },
          ],
        },
      },
    ];
    await expect(validationSchema.validate(data)).rejects.toThrow(/value is a required field/);
  });

  it('should validate non-final action with non-empty array value', async () => {
    const data = [
      {
        option: OPTIONS.ITEM_NOTE,
        actionsDetails: {
          actions: [
            { name: nonFinalActionName, value: ['one', 'two'] },
          ],
        },
      },
    ];
    await expect(validationSchema.validate(data)).resolves.toEqual(data);
  });

  it('should reject non-final action with empty array value', async () => {
    const data = [
      {
        option: OPTIONS.ITEM_NOTE,
        actionsDetails: {
          actions: [
            { name: nonFinalActionName, value: [] },
          ],
        },
      },
    ];
    await expect(validationSchema.validate(data)).rejects.toThrow(/at least 1 items/);
  });

  it('should allow missing or any value for final actions', async () => {
    const dataMissingValue = [
      {
        option: OPTIONS.ADMINISTRATIVE_NOTE,
        actionsDetails: {
          actions: [
            { name: finalActionName },
          ],
        },
      },
    ];
    const dataWithValue = [
      {
        option: OPTIONS.ADMINISTRATIVE_NOTE,
        actionsDetails: {
          actions: [
            { name: finalActionName, value: 'anything goes' },
          ],
        },
      },
    ];

    await expect(validationSchema.validate(dataMissingValue)).resolves.toEqual(dataMissingValue);
    await expect(validationSchema.validate(dataWithValue)).resolves.toEqual(dataWithValue);
  });

  it('should reject when the top‐level value is not an array', async () => {
    const data = { option: 'nope' };
    await expect(validationSchema.validate(data)).rejects.toThrow(/this must be a `array` type/);
  });

  it('should reject completely empty array items', async () => {
    const data = [{}];
    await expect(validationSchema.validate(data)).rejects.toThrow();
  });

  it('should validate multiple entries at once', async () => {
    const data = [
      {
        option: OPTIONS.ADMINISTRATIVE_NOTE,
        actionsDetails: {
          actions: [
            { name: nonFinalActionName, value: 'value' },
            { name: finalActionName },
          ],
        },
      },
      {
        option: OPTIONS.ADMINISTRATIVE_NOTE,
        actionsDetails: {
          actions: [
            { name: nonFinalActionName, value: ['value'] },
          ],
        },
      },
    ];
    await expect(validationSchema.validate(data)).resolves.toEqual(data);
  });
});
