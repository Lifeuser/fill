import {
  ApiRes,
  SubmissionResponse,
  ResponseFiltersType,
  QuestionType,
} from '../types.js';

export async function fetchSubmissons(
  url: string,
  FILLOUT_API_KEY: string,
): Promise<ApiRes> {
  const apiRes = await fetch(url, {
    headers: { Authorization: `Bearer ${FILLOUT_API_KEY}` },
  });

  console.log(`[api]: Fillout /submissions API - fetching data from ${url}`);

  const body: ApiRes = await apiRes.json();
  if (!apiRes.ok || !body || typeof body.totalResponses === 'undefined') {
    console.log(
      '[api]: Fillout /submissions API error ',
      apiRes.status,
      apiRes.statusText,
      body,
    );

    throw new Error('FILLOUT_SUBMISSION_API_ERROR');
  }

  return body;
}

export function filterData(
  data: SubmissionResponse[],
  filters: ResponseFiltersType,
) {
  return data.filter((item) => {
    return filters.every((filter) => {
      const question = item.questions.find((q) => q.id === filter.id);
      if (!question) return false;

      let questionValue: null | string | number | Date = question.value;
      if (questionValue === null) return false;

      if (
        [
          QuestionType.DatePicker,
          QuestionType.TimePicker,
          QuestionType.DateTimePicker,
        ].includes(question.type as QuestionType)
      ) {
        questionValue = new Date(questionValue);
      }

      switch (filter.condition) {
        case 'equals':
          return questionValue === filter.value;
        case 'does_not_equal':
          return questionValue !== filter.value;
        case 'greater_than':
          return questionValue instanceof Date
            ? questionValue > new Date(filter.value)
            : questionValue > filter.value;
        case 'less_than':
          return questionValue instanceof Date
            ? questionValue < new Date(filter.value)
            : questionValue < filter.value;
        default:
          return false;
      }
    });
  });
}
