import { HealthController } from './health.controller';

describe('HealthController', () => {
  const mockDdbDoc: any = { send: jest.fn() };
  const controller = new HealthController(mockDdbDoc as any);

  afterEach(() => jest.restoreAllMocks());

  it('getHealth returns healthy when send succeeds', async () => {
    (mockDdbDoc.send as jest.Mock).mockResolvedValue({});
    const res = await controller.getHealth();
    expect(res.status).toBe('healthy');
    expect(res.database).toBe('dynamodb');
  });

  it('getHealth returns unhealthy on error', async () => {
    (mockDdbDoc.send as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await controller.getHealth();
    expect(res.status).toBe('unhealthy');
    expect(res.error).toBeDefined();
  });

  it('getDatabaseHealth returns healthy on success', async () => {
    (mockDdbDoc.send as jest.Mock).mockResolvedValue({ TableNames: ['t1', 't2'] });
    const res = await controller.getDatabaseHealth();
    expect(res.status).toBe('healthy');
    expect(res.tablesCount).toBe(2);
    expect(res.tables).toEqual(['t1', 't2']);
  });

  it('getDatabaseHealth returns unhealthy on error', async () => {
    (mockDdbDoc.send as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await controller.getDatabaseHealth();
    expect(res.status).toBe('unhealthy');
  });
});
