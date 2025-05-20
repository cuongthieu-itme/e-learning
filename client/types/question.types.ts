export type CreateQuestionDto = {
  lectureId: string;
  createdById: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation?: string;
};

export type GetQuestionsDto = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
};

export interface IQuestion {
  _id: string;
  lectureId: string;
  createdById: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation?: string;
  createdAt?: string;
  updatedAt?: string;
}
