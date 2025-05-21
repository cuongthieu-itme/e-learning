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

interface ICreator {
  _id: string;
  first_name: string;
  last_name: string;
}

interface ILecture {
  _id: string;
  title: string;
  content?: string;
}

export interface IQuestion {
  _id: string;
  lectureId: string | ILecture;
  createdById: string | ICreator;
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
