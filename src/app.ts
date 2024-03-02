import 'dotenv/config';
import express, { RequestHandler, Response } from 'express';
import {
  SubmissionResponse,
  ResponseFiltersType,
  Conditions,
} from './types.js';

const app = express();

const { FILLOUT_API_KEY, FILLOUT_API_FORMS_BASE_URL, FILLOUT_DEFAULT_LIMIT } =
  process.env;

if (!FILLOUT_API_KEY || !FILLOUT_API_FORMS_BASE_URL) {
  process.exit(1);
}

import { fetchSubmissons, filterData } from './services/submissions.js';

export const filteredResponsesController: RequestHandler<{
  formId: string;
}> = async (req, res) => {
  const { formId } = req.params;
  const submissionsURL = `${FILLOUT_API_FORMS_BASE_URL}/${formId}/submissions?`;
  let { limit, offset, filters, ...apiQuery } = req.query;

  const reqLimit = limit
    ? parseInt(limit as string)
    : parseInt(FILLOUT_DEFAULT_LIMIT as string);
  const reqOffset = offset ? parseInt(offset as string) : 0;

  if (isNaN(reqLimit) || isNaN(reqOffset)) {
    return res.status(400).json({ statusCode: 400, error: 'Bad Request' });
  }

  try {
    console.log('[api]: Filters ', filters?.length ?? []);
    const resultFilters: ResponseFiltersType = filters
      ? JSON.parse(filters as string)
      : [];

    // should have used decent validator like Joi
    for (let f of resultFilters) {
      if (
        f.id === undefined ||
        f.value === undefined ||
        ![
          Conditions.does_not_equal,
          Conditions.equals,
          Conditions.greater_than,
          Conditions.less_than,
        ].includes(f.condition as Conditions)
      ) {
        return res.status(400).json({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Failed to parse filter conditions',
        });
      }
    }

    const apiLimit = resultFilters.length
      ? parseInt(FILLOUT_DEFAULT_LIMIT as string)
      : reqLimit;

    let apiOffset = resultFilters.length ? 0 : reqOffset;
    let hasMoreData = true;
    let data: SubmissionResponse[] = [];

    // sadly we can't return right counters back to client without fetching all of the data
    while (hasMoreData) {
      const query = {
        ...apiQuery,
        limit: `${apiLimit}`,
        offset: `${apiOffset}`,
      };
      const queryParams = new URLSearchParams(query);
      const url = submissionsURL + queryParams;
      const response = await fetchSubmissons(url, FILLOUT_API_KEY);

      const { responses } = response;

      if (!resultFilters.length) {
        return res.json(response);
      }

      data = data.concat(responses);
      apiOffset += reqLimit;
      hasMoreData = responses.length === apiLimit;
    }

    const filteredData = filterData(data, resultFilters);

    const responseData = filteredData.slice(reqOffset, reqOffset + reqLimit);

    console.log(
      `[api]: Fetched = ${data.length}, filtered = ${filteredData.length}, limit=${reqLimit}, offset=${reqOffset}`,
    );

    res.json({
      responses: responseData,
      totalResponses: filteredData.length,
      pageCount: Math.ceil(filteredData.length / reqLimit),
    });
  } catch (e: Error | unknown) {
    console.log(`[api]: Error is thrown ${e}`);
    if (e instanceof Error) {
      res.status(500).json({ statusCode: 500, message: e.message });
    } else {
      res
        .status(500)
        .json({ statusCode: 500, message: 'An unknown error occurred' });
    }
  }
};

export function createServer(): express.Application {
  const app = express();

  app.get('/:formId/filteredResponses', filteredResponsesController);

  return app;
}
