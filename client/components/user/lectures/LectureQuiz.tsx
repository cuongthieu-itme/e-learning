"use client";

import { Button } from '@/components/ui/buttons/button';
import { getAllQuestionsRandomByLectureId } from '@/lib/actions/question.actions';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, Clock, Medal, RefreshCw, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Question {
  _id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
  createdAt: string;
  createdBy: {
    _id: string;
    first_name: string;
    last_name: string;
  };
}

interface QuizProps {
  lectureId: string;
  onClose?: () => void;
}

const LectureQuiz = ({ lectureId, onClose }: QuizProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<string>('00:00');
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Fetch questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAllQuestionsRandomByLectureId(lectureId);
        
        if (response.statusCode === 200 && response.questions?.length > 0) {
          setQuestions(response.questions);
          setStartTime(new Date());
        } else {
          setError('Không tìm thấy câu hỏi cho bài giảng này.');
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Không thể tải câu hỏi. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [lectureId]);

  // Setup timer
  useEffect(() => {
    if (startTime && !quizSubmitted) {
      const interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
        const seconds = (diff % 60).toString().padStart(2, '0');
        setTimeElapsed(`${minutes}:${seconds}`);
      }, 1000);
      
      setTimerInterval(interval);
      
      return () => clearInterval(interval);
    }
  }, [startTime, quizSubmitted]);

  // Stop timer when quiz is submitted
  useEffect(() => {
    if (quizSubmitted && timerInterval) {
      clearInterval(timerInterval);
      setEndTime(new Date());
    }
  }, [quizSubmitted, timerInterval]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
  };

  const calculateScore = () => {
    let correctCount = 0;
    
    questions.forEach(question => {
      if (selectedAnswers[question._id] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    return {
      correctCount,
      totalQuestions: questions.length,
      percentage: Math.round((correctCount / questions.length) * 100)
    };
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setQuizSubmitted(false);
    setStartTime(new Date());
    setEndTime(null);
    setTimeElapsed('00:00');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl bg-white p-8 shadow-md">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
        <p className="text-gray-600">Đang tải câu hỏi...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl bg-white p-8 shadow-md">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <p className="mb-4 text-center text-red-500">{error}</p>
        <Button onClick={onClose} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
      </div>
    );
  }

  // No questions state
  if (questions.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl bg-white p-8 shadow-md">
        <AlertCircle className="mb-4 h-12 w-12 text-amber-500" />
        <p className="mb-4 text-center text-gray-600">Không có câu hỏi nào cho bài giảng này.</p>
        <Button onClick={onClose} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
      </div>
    );
  }

  // Quiz results
  if (quizSubmitted) {
    const { correctCount, totalQuestions, percentage } = calculateScore();
    const isPassed = percentage >= 60;

    return (
      <div className="relative overflow-hidden rounded-xl bg-white p-8 shadow-md">
        {/* Background decoration */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-100 opacity-50"></div>
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-amber-100 opacity-50"></div>
        
        <div className="relative z-10">
          <div className="mb-6 flex items-center justify-center">
            <div className="relative rounded-full">
              <svg className="h-32 w-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke={isPassed ? "#4f46e5" : "#ef4444"}
                  strokeWidth="8"
                  strokeDasharray="352"
                  strokeDashoffset={352 - (352 * percentage) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 64 64)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{percentage}%</span>
                <span className="text-sm text-gray-500">Điểm số</span>
              </div>
            </div>
          </div>

          <h2 className="mb-2 text-center text-2xl font-bold">
            {isPassed ? 'Chúc mừng!' : 'Cố gắng lần sau!'}
          </h2>
          
          <div className="mb-6 flex flex-col items-center justify-center">
            <p className="text-center text-lg">
              Bạn đã trả lời đúng <span className="font-bold text-indigo-600">{correctCount}</span> trên <span className="font-bold">{totalQuestions}</span> câu hỏi
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              Thời gian hoàn thành: {timeElapsed}
            </p>
          </div>

          <div className="mb-8 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-4 text-lg font-semibold">Chi tiết kết quả</h3>
            <div className="space-y-3">
              {questions.map((question, index) => {
                const isCorrect = selectedAnswers[question._id] === question.correctAnswer;
                const userAnswer = selectedAnswers[question._id] || 'Không trả lời';
                
                return (
                  <div key={question._id} className="rounded-lg border p-3">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold">
                          {index + 1}
                        </span>
                        <p className="font-medium">{question.question}</p>
                      </div>
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 shrink-0 text-red-500" />
                      )}
                    </div>
                    <div className="ml-8 text-sm">
                      <p>
                        <span className="font-medium">Đáp án của bạn:</span>{' '}
                        <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                          {userAnswer}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p>
                          <span className="font-medium">Đáp án đúng:</span>{' '}
                          <span className="text-green-600">{question.correctAnswer}</span>
                        </p>
                      )}
                      {!isCorrect && question.explanation && (
                        <p className="mt-1 text-gray-600">
                          <span className="font-medium">Giải thích:</span> {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={resetQuiz} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Làm lại bài
            </Button>
            <Button onClick={onClose} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Current question
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-md md:p-8">
      {/* Progress and timer bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            Câu {currentQuestionIndex + 1}/{questions.length}
          </span>
          <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200 md:w-48">
            <div 
              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{timeElapsed}</span>
          </div>
          <div className="text-gray-600">
            {answeredCount}/{questions.length} câu đã trả lời
          </div>
        </div>
      </div>

      {/* Question content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h2 className="mb-6 text-xl font-medium">{currentQuestion.question}</h2>

          <div className="space-y-3">
            {['A', 'B', 'C', 'D'].map((option) => {
              const optionText = currentQuestion[`option${option}` as keyof Question] as string;
              const isSelected = selectedAnswers[currentQuestion._id] === option;
              
              return (
                <div
                  key={option}
                  className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600 ring-offset-2'
                      : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50'
                  }`}
                  onClick={() => handleAnswerSelect(currentQuestion._id, option)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {option}
                    </div>
                    <span>{optionText}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <Button
          onClick={handlePreviousQuestion}
          variant="outline"
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Câu trước
        </Button>

        <div className="flex gap-3">
          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={answeredCount < questions.length}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Nộp bài
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="flex items-center gap-2"
            >
              Câu tiếp
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Question navigation dots */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {questions.map((_, index) => {
          const isAnswered = selectedAnswers[questions[index]._id] !== undefined;
          const isCurrent = index === currentQuestionIndex;
          
          return (
            <button
              key={index}
              className={`h-3 w-3 rounded-full transition-all ${
                isCurrent
                  ? 'bg-indigo-600 ring-2 ring-indigo-200'
                  : isAnswered
                  ? 'bg-indigo-400'
                  : 'bg-gray-200'
              }`}
              onClick={() => setCurrentQuestionIndex(index)}
              aria-label={`Đi đến câu ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LectureQuiz;
