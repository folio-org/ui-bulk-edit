import { buildQuery } from './buildQuery';

describe('buildQuery', () => {
  it('should parse query with patron group', () => {
    const query = 'patron group=staff';
    const userGroups = {
      staffId: 'staff',
    };

    expect(buildQuery(query, userGroups)).toEqual('patronGroup=staffId');
  });
  it('should parse query with status', () => {
    const query = 'status=active';

    expect(buildQuery(query)).toEqual('active=true');
  });
  it('should not parse query without status or patron group', () => {
    const query = 'barcode=123';

    expect(buildQuery(query)).toEqual(query);
  });
});
