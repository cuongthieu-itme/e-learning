"use client";

import LectureQuiz from "@/components/user/lectures/LectureQuiz";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const LectureDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const lectureId = params.lectureId as string;

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Bài tập</h1>
        <p className="text-gray-600">
          Hãy hoàn thành tất cả câu hỏi để nhận đánh giá
        </p>
      </div>

      <LectureQuiz lectureId={lectureId} onClose={handleClose} />
    </div>
  );
};

export default LectureDetailPage;
