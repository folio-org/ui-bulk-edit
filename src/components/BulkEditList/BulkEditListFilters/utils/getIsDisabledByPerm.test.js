import { getIsDisabledByPerm } from './getIsDisabledByPerm';
import { CAPABILITIES } from '../../../../constants';

let csvPerm;
let inAppPerm;
describe('getIsDisabledByPerm', () => {
  it('should return correct boolean with csvView perm', () => {
    csvPerm = true;
    inAppPerm = false;

    expect(getIsDisabledByPerm(CAPABILITIES.USER, false, csvPerm, inAppPerm)).toBe(true);
  });

  it('should return correct boolean with inApp perm', () => {
    csvPerm = false;
    inAppPerm = true;

    expect(getIsDisabledByPerm(CAPABILITIES.ITEM, false, csvPerm, inAppPerm)).toBe(false);
  });

  it('should return correct boolean with default Perm', () => {
    csvPerm = false;
    inAppPerm = false;

    expect(getIsDisabledByPerm(CAPABILITIES.HOLDING, true, csvPerm, inAppPerm)).toBe(true);
  });
});
