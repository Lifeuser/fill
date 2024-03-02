export type Question = {
  id: string;
  name: string;
  type: string;
  value: string | null | number;
};

export type SubmissionResponse = {
  questions: Question[];
};

export type ApiRes = {
  responses: SubmissionResponse[];
  totalResponses: number;
  pageCount: number;
};

export type FilterClauseType = {
  id: string;
  condition: 'equals' | 'does_not_equal' | 'greater_than' | 'less_than';
  value: number | string;
};

export type ResponseFiltersType = FilterClauseType[];

export enum QuestionType {
  Address = 'Address',
  AudioRecording = 'AudioRecording',
  Calcom = 'Calcom',
  Calendly = 'Calendly',
  Captcha = 'Captcha',
  Checkbox = 'Checkbox',
  Checkboxes = 'Checkboxes',
  ColorPicker = 'ColorPicker',
  CurrencyInput = 'CurrencyInput',
  DatePicker = 'DatePicker',
  DateRange = 'DateRange',
  DateTimePicker = 'DateTimePicker',
  Dropdown = 'Dropdown',
  EmailInput = 'EmailInput',
  FileUpload = 'FileUpload',
  ImagePicker = 'ImagePicker',
  LocationCoordinates = 'LocationCoordinates',
  LongAnswer = 'LongAnswer',
  Matrix = 'Matrix',
  MultiSelect = 'MultiSelect',
  MultipleChoice = 'MultipleChoice',
  NumberInput = 'NumberInput',
  OpinionScale = 'OpinionScale',
  Password = 'Password',
  Payment = 'Payment',
  PhoneNumber = 'PhoneNumber',
  Ranking = 'Ranking',
  RecordPicker = 'RecordPicker',
  ShortAnswer = 'ShortAnswer',
  Signature = 'Signature',
  Slider = 'Slider',
  StarRating = 'StarRating',
  Switch = 'Switch',
  TimePicker = 'TimePicker',
  URLInput = 'URLInput',
}

export enum Conditions {
  equals = 'equals',
  does_not_equal = 'does_not_equal',
  greater_than = 'greater_than',
  less_than = 'less_than',
}
