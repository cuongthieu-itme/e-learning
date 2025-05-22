"use client";

import { Button } from '@/components/ui/buttons/button';
import { getAllQuestionsRandomByLectureId } from '@/lib/actions/question.actions';
import { IQuestion } from '@/types/question.types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, Clock, RefreshCw, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

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

// Types for quiz state management
type QuizStatus = 'loading' | 'error' | 'ready' | 'in-progress' | 'submitted';

interface QuizProps {
  lectureId: string;
  onClose?: () => void;
  returnUrl?: string;
}

const LectureQuiz = ({ lectureId, onClose, returnUrl }: QuizProps) => {
  const router = useRouter();
  
  // Core quiz state
  const [quizStatus, setQuizStatus] = useState<QuizStatus>('loading');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Timer related state
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<string>('00:00');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  // Fetch questions from API
  const fetchQuestions = useCallback(async () => {
    try {
      setQuizStatus('loading');
      setErrorMessage('');
      
      const response = await getAllQuestionsRandomByLectureId(lectureId);
      
      if (response.statusCode === 200) {
        if (response.questions?.length > 0) {
          // Transform the API response to match our Question type
          const transformedQuestions = response.questions.map((q: any) => ({
            _id: q._id,
            question: q.question,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || '',
            createdAt: q.createdAt,
            createdBy: q.createdBy || {
              _id: q.createdById?._id || '',
              first_name: q.createdById?.first_name || '',
              last_name: q.createdById?.last_name || ''
            }
          }));
          
          setQuestions(transformedQuestions);
          
          // Reset other state to ensure clean start
          setSelectedAnswers({});
          setCurrentQuestionIndex(0);
          
          // Initialize timer and update status
          const now = new Date();
          setStartTime(now);
          startTimeRef.current = now;
          setTimeElapsed('00:00');
          setQuizStatus('ready');
        } else {
          setErrorMessage('Không tìm thấy câu hỏi nào cho bài giảng này.');
          setQuizStatus('error');
        }
      } else {
        setErrorMessage(response.message || 'Đã xảy ra lỗi khi tải câu hỏi.');
        setQuizStatus('error');
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
      setErrorMessage('Không thể kết nối với máy chủ. Vui lòng thử lại sau.');
      setQuizStatus('error');
    }
  }, [lectureId]);

  // Load questions on component mount
  useEffect(() => {
    fetchQuestions();
    
    // Cleanup timer on component unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [fetchQuestions]);

  // Setup and manage timer
  useEffect(() => {
    // Only run timer in active quiz states
    if (quizStatus === 'ready' || quizStatus === 'in-progress') {
      // Only start the timer if we have a valid start time
      if (!startTimeRef.current) return;
      
      // Clear any existing interval
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Set up new interval
      timerRef.current = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTimeRef.current!.getTime()) / 1000);
        const minutes = Math.floor(diff / 60).toString().padStart(2, '0');
        const seconds = (diff % 60).toString().padStart(2, '0');
        setTimeElapsed(`${minutes}:${seconds}`);
      }, 1000);
      
      // If state just changed to ready, update to in-progress
      // This avoids needing to wait for first answer to start quiz
      if (quizStatus === 'ready') {
        setQuizStatus('in-progress');
      }
      
      // Cleanup on unmount or status change
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }
    
    // Stop timer when quiz is submitted
    if (quizStatus === 'submitted') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [quizStatus]);

  // Handle selecting an answer for a question
  const handleAnswerSelect = useCallback((questionId: string, answer: string) => {
    setSelectedAnswers(prev => {
      // If same answer is selected again, do nothing (prevent toggle behavior)
      if (prev[questionId] === answer) return prev;
      
      // Otherwise set the new answer
      return {
        ...prev,
        [questionId]: answer,
      };
    });
    
    // Ensure quiz is in progress after first answer
    if (quizStatus === 'ready') {
      setQuizStatus('in-progress');
    }
  }, [quizStatus]);

  // Navigation between questions
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  // Jump to a specific question
  const jumpToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  }, [questions.length]);

  // Submit the quiz
  const handleSubmitQuiz = useCallback(() => {
    // Only allow submission if all questions are answered
    const allAnswered = questions.every(q => selectedAnswers[q._id] !== undefined);
    if (!allAnswered) return;
    
    // Stop the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setQuizStatus('submitted');
  }, [questions, selectedAnswers]);

  // Calculate the quiz score
  const calculateScore = useCallback(() => {
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
  }, [questions, selectedAnswers]);

  // Reset the quiz to start over
  const resetQuiz = useCallback(() => {
    // Stop any existing timer first
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Reset all quiz state
    setSelectedAnswers({});
    setCurrentQuestionIndex(0); // Start from first question
    
    // Reset timer
    const now = new Date();
    setStartTime(now);
    startTimeRef.current = now;
    setTimeElapsed('00:00');
    
    // Reset quiz status to begin from the start
    setQuizStatus('ready');
    
    // Scroll to top if needed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  // Handle closing/returning
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else if (returnUrl) {
      router.push(returnUrl);
    } else {
      router.back();
    }
  }, [onClose, returnUrl, router]);

  // Loading state
  if (quizStatus === 'loading') {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl bg-white p-8 shadow-md">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>
        <p className="text-gray-600">Đang tải câu hỏi...</p>
      </div>
    );
  }

  // Error state
  if (quizStatus === 'error') {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl bg-white p-8 shadow-md">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <p className="mb-4 text-center text-red-500">{errorMessage}</p>
        <Button onClick={handleClose} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
      </div>
    );
  }

  // No questions state
  if (questions.length === 0 && (quizStatus === 'ready' || quizStatus === 'in-progress')) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl bg-white p-8 shadow-md">
        <AlertCircle className="mb-4 h-12 w-12 text-amber-500" />
        <p className="mb-4 text-center text-gray-600">Không có câu hỏi nào cho bài giảng này.</p>
        <Button onClick={handleClose} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
      </div>
    );
  }

  // Quiz results
  if (quizStatus === 'submitted') {
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
                            {!isCorrect && question.explanation && question.explanation.trim() !== '' && (
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
            <Button onClick={handleClose} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Current question and quiz stats
  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const allQuestionsAnswered = answeredCount === questions.length;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  // Calculate progress based on current position (not completion)
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  return (
    <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-md md:p-8">
      {/* Progress and timer bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            Câu {currentQuestionIndex + 1}/{questions.length}
          </span>
          <div 
            className="h-2 w-32 overflow-hidden rounded-full bg-gray-200 md:w-48"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Đang ở câu ${currentQuestionIndex + 1} trong tổng số ${questions.length} câu`}
          >
            <div 
              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-600" aria-live="polite" aria-atomic="true">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>{timeElapsed}</span>
          </div>
          <div 
            className={cn("text-gray-600", allQuestionsAnswered && "text-green-600 font-medium")}
            aria-live="polite"
          >
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
          aria-live="polite"
        >
          <h2 className="mb-6 text-xl font-medium" id="current-question">{currentQuestion.question}</h2>

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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleAnswerSelect(currentQuestion._id, option);
                    }
                  }}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Đáp án ${option}: ${optionText}`}
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {option}
                    </div>
                    <span className="break-words">{optionText}</span>
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
          aria-label="Câu hỏi trước đó"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Câu trước
        </Button>

        <div className="flex gap-3">
          {isLastQuestion ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={!allQuestionsAnswered}
              className={cn(
                "flex items-center gap-2",
                allQuestionsAnswered ? "bg-green-600 hover:bg-green-700" : ""
              )}
              aria-label={allQuestionsAnswered ? "Nộp bài" : "Cần trả lời tất cả câu hỏi trước khi nộp bài"}
            >
              <CheckCircle className="h-4 w-4" aria-hidden="true" />
              Nộp bài
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              className="flex items-center gap-2"
              aria-label="Câu hỏi tiếp theo"
            >
              Câu tiếp
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>

      {/* Question navigation dots */}
      <nav aria-label="Điều hướng câu hỏi" className="mt-6">
        <div className="flex flex-wrap justify-center gap-2">
          {questions.map((question, index) => {
            const isAnswered = selectedAnswers[question._id] !== undefined;
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
                onClick={() => jumpToQuestion(index)}
                aria-label={`Câu hỏi ${index + 1}${isAnswered ? ' (đã trả lời)' : ''}${isCurrent ? ' (đang xem)' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
              />
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default LectureQuiz;
