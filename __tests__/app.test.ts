import { filteredResponsesController } from '../src/app.js';
import { filterData } from '../src/services/submissions.js';
import { Response } from 'express';
import { apiRes, filters } from '../mocks/mocks.js';

global.fetch = jest.fn();

process.env.FILLOUT_API_KEY = 'test_api_key';
process.env.FILLOUT_API_FORMS_BASE_URL = 'https://api.example.com';
process.env.FILLOUT_DEFAULT_LIMIT = '10';

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('Filtered Responses Controller', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('fetches data successfully from the external API', async () => {
    const mockApiRes = apiRes;

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiRes),
    });

    const req: any = { params: { formId: 'testFormId' }, query: {} };
    const res = mockResponse();

    await filteredResponsesController(req, res, () => {});

    expect(res.json).toHaveBeenCalledWith(mockApiRes);
  });

  it('filters correctly', async () => {
    const responses = apiRes.responses;

    // Johnny AND Engineering AND How many employees work under you?
    let data = filterData(responses, filters[0]);
    expect(data.length).toBe(1);

    // add check for date that is wrong
    data = filterData(responses, [
      ...filters[0],
      {
        id: 'dSRAe3hygqVwTpPK69p5td',
        condition: 'greater_than',
        value: '2024-02-05',
      },
    ]);
    expect(data.length).toBe(0);

    // date in the far future (except the one that is null)
    data = filterData(responses, [...filters[1]]);
    expect(data.length).toBe(5);
  });
});
