import { CourseService } from '@/models/course/course.service';
import { CourseDocument } from '@/models/course/schema/course.schema';
import { CourseTopicService } from '@/models/course-topic/course-topic.service';
import { CourseTopicDocument } from '@/models/course-topic/schema/course-topic.schema';
import { LectureService } from '@/models/lecture/lecture.service';
import { LectureDocument } from '@/models/lecture/schema/lecture.schema';
import { QuestionService } from '@/models/question/question.service';
import { QuestionDocument } from '@/models/question/schema/question.schema';
import { UserDocument } from '@/models/user/schema/user.schema';
import { UserService } from '@/models/user/user.service';
import { LectureStatus, Role } from '@/types';
import { HttpStatus, Injectable } from '@nestjs/common';

export interface ResponseObject {
  statusCode: number;
  data: any;
  message?: string;
}

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly userService: UserService,
    private readonly courseService: CourseService,
    private readonly lectureService: LectureService,
    private readonly questionService: QuestionService,
    private readonly courseTopicService: CourseTopicService,
  ) {}

  async getAnalytics(): Promise<ResponseObject> {
    const overview = await this.getOverview();
    const userMetrics = await this.getUserMetrics();
    const courseMetrics = await this.getCourseMetrics();
    const lectureMetrics = await this.getLectureMetrics();
    const questionMetrics = await this.getQuestionMetrics();

    return {
      statusCode: HttpStatus.OK,
      data: {
        overview: overview.data,
        userMetrics: userMetrics.data,
        courseMetrics: courseMetrics.data,
        lectureMetrics: lectureMetrics.data,
        questionMetrics: questionMetrics.data,
      },
    };
  }

  private async getOverview() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const totalUsers = await this.userService.countDocuments({});
    const usersThisMonth = await this.userService.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const totalCourses = await this.courseService.countDocuments({});
    const coursesThisMonth = await this.courseService.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const totalLectures = await this.lectureService.countDocuments({});
    const lecturesThisMonth = await this.lectureService.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const totalQuestions = await this.questionService.countDocuments({});
    const questionsThisMonth = await this.questionService.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    const publishedCourses = await this.courseService.countDocuments({
      isPublished: true,
    });

    const completedLectures = await this.lectureService.countDocuments({
      status: LectureStatus.PUBLISHED,
    });

    return {
      data: {
        totalUsers,
        usersThisMonth,
        totalCourses,
        coursesThisMonth,
        totalLectures,
        lecturesThisMonth,
        totalQuestions,
        questionsThisMonth,
        publishedCourses,
        completedLectures,
      },
    };
  }

  private async getUserMetrics() {
    // Get user growth over time (monthly)
    const userGrowthData = await this.getUserGrowthByMonth();
    
    // Get user role distribution
    const userRoleDistribution = await this.getUserRoleDistribution();

    return {
      data: {
        userGrowth: userGrowthData,
        roleDistribution: userRoleDistribution,
      },
    };
  }

  private async getUserGrowthByMonth() {
    const users = await this.userService.find({}, 'createdAt _id');
    
    const usersByMonth = users.reduce((acc: Record<string, number>, user: any) => {
      if (user.createdAt) {
        const date = new Date(user.createdAt);
        const month = date.getMonth();
        const year = date.getFullYear();
        const key = `${year}-${month + 1}`;
        
        if (!acc[key]) {
          acc[key] = 0;
        }
        
        acc[key]++;
      }
      return acc;
    }, {});
    
    // Convert to array for frontend consumption
    return Object.entries(usersByMonth).map(([date, count]) => ({
      date,
      count,
    }));
  }

  private async getUserRoleDistribution() {
    const users = await this.userService.find({}, 'role _id');
    
    const roleCount = users.reduce((acc, user: UserDocument) => {
      if (!acc[user.role]) {
        acc[user.role] = 0;
      }
      
      acc[user.role]++;
      return acc;
    }, {});
    
    return Object.entries(roleCount).map(([role, count]) => ({
      role,
      count,
    }));
  }

  private async getCourseMetrics() {
    // Get courses by subject
    const coursesBySubject = await this.getCoursesBySubject();
    
    // Get course creation trend
    const courseCreationTrend = await this.getCourseCreationTrend();
    
    // Get published vs unpublished courses ratio
    const publishStatus = await this.getPublishedStatus();

    // Get course topics distribution
    const courseTopicsDistribution = await this.getCourseTopicsDistribution();
    
    return {
      data: {
        coursesBySubject,
        courseCreationTrend,
        publishStatus,
        courseTopicsDistribution,
      },
    };
  }

  private async getCoursesBySubject() {
    const courses = await this.courseService.find({}, 'subject _id');
    
    const subjectCount = courses.reduce((acc, course: CourseDocument) => {
      if (!acc[course.subject]) {
        acc[course.subject] = 0;
      }
      
      acc[course.subject]++;
      return acc;
    }, {});
    
    return Object.entries(subjectCount).map(([subject, count]) => ({
      subject,
      count,
    }));
  }

  private async getCourseCreationTrend() {
    const courses = await this.courseService.find({}, 'createdAt _id');
    
    const coursesByMonth = courses.reduce((acc: Record<string, number>, course: any) => {
      if (course.createdAt) {
        const date = new Date(course.createdAt);
        const month = date.getMonth();
        const year = date.getFullYear();
        const key = `${year}-${month + 1}`;
        
        if (!acc[key]) {
          acc[key] = 0;
        }
        
        acc[key]++;
      }
      return acc;
    }, {});
    
    return Object.entries(coursesByMonth).map(([date, count]) => ({
      date,
      count,
    }));
  }

  private async getPublishedStatus() {
    const published = await this.courseService.countDocuments({ isPublished: true });
    const unpublished = await this.courseService.countDocuments({ isPublished: false });
    
    return [
      { status: 'Published', count: published },
      { status: 'Unpublished', count: unpublished },
    ];
  }

  private async getCourseTopicsDistribution() {
    const courseTopics = await this.courseTopicService.find({}, 'courseId topic');
    
    // Group topics by course
    const topicsByCourse = courseTopics.reduce((acc, topic: CourseTopicDocument) => {
      const courseId = topic.courseId.toString();
      
      if (!acc[courseId]) {
        acc[courseId] = 0;
      }
      
      acc[courseId]++;
      return acc;
    }, {});
    
    // Get distribution stats
    const topicCounts = Object.values(topicsByCourse) as number[];
    const totalCourses = Object.keys(topicsByCourse).length;
    
    if (totalCourses === 0) {
      return {
        averageTopicsPerCourse: 0,
        maxTopicsInCourse: 0,
        minTopicsInCourse: 0,
      };
    }
    
    const sum = topicCounts.reduce((a: number, b: number) => a + b, 0);
    const average = sum / totalCourses;
    const max = Math.max(...topicCounts);
    const min = Math.min(...topicCounts);
    
    return {
      averageTopicsPerCourse: average,
      maxTopicsInCourse: max,
      minTopicsInCourse: min,
    };
  }

  private async getLectureMetrics() {
    // Get lectures per course
    const lecturesPerCourse = await this.getLecturesPerCourse();
    
    // Get lecture status distribution
    const lectureStatusDistribution = await this.getLectureStatusDistribution();
    
    // Get lecture content types distribution
    const lectureContentTypes = await this.getLectureContentTypes();
    
    return {
      data: {
        lecturesPerCourse,
        lectureStatusDistribution,
        lectureContentTypes,
      },
    };
  }

  private async getLecturesPerCourse() {
    const lectures = await this.lectureService.find({}, 'courseId _id');
    
    const lecturesByCourse = lectures.reduce((acc, lecture: LectureDocument) => {
      const courseId = lecture.courseId.toString();
      
      if (!acc[courseId]) {
        acc[courseId] = 0;
      }
      
      acc[courseId]++;
      return acc;
    }, {});
    
    // Get courses with their names
    const courseIds = Object.keys(lecturesByCourse);
    const courses = await this.courseService.find(
      { _id: { $in: courseIds } },
      'name _id'
    );
    
    // Map course names to IDs
    const courseMap = courses.reduce((acc: Record<string, string>, course: CourseDocument) => {
      if (course._id && course.name) {
        acc[course._id.toString()] = course.name;
      }
      return acc;
    }, {});
    
    // Format the data for frontend
    return Object.entries(lecturesByCourse)
      .map(([courseId, count]: [string, number]) => ({
        courseId,
        courseName: courseMap[courseId] || 'Unknown Course',
        lectureCount: count,
      }))
      .sort((a, b) => b.lectureCount - a.lectureCount);
  }

  private async getLectureStatusDistribution() {
    const lectures = await this.lectureService.find({}, 'status _id');
    
    const statusCount = lectures.reduce((acc, lecture: LectureDocument) => {
      if (!acc[lecture.status]) {
        acc[lecture.status] = 0;
      }
      
      acc[lecture.status]++;
      return acc;
    }, {});
    
    return Object.entries(statusCount).map(([status, count]) => ({
      status,
      count,
    }));
  }

  private async getLectureContentTypes() {
    const lectures = await this.lectureService.find(
      {},
      'pptxUrl mindmapUrl _id'
    );
    
    let withPptx = 0;
    let withMindmap = 0;
    let withBoth = 0;
    let withNeither = 0;
    
    lectures.forEach((lecture: LectureDocument) => {
      const hasPptx = !!lecture.pptxUrl;
      const hasMindmap = !!lecture.mindmapUrl;
      
      if (hasPptx && hasMindmap) {
        withBoth++;
      } else if (hasPptx) {
        withPptx++;
      } else if (hasMindmap) {
        withMindmap++;
      } else {
        withNeither++;
      }
    });
    
    return [
      { type: 'With PPTX Only', count: withPptx },
      { type: 'With Mindmap Only', count: withMindmap },
      { type: 'With Both', count: withBoth },
      { type: 'With Neither', count: withNeither },
    ];
  }

  private async getQuestionMetrics() {
    // Get questions per lecture
    const questionsPerLecture = await this.getQuestionsPerLecture();
    
    // Get correct answer distribution
    const correctAnswerDistribution = await this.getCorrectAnswerDistribution();
    
    return {
      data: {
        questionsPerLecture,
        correctAnswerDistribution,
      },
    };
  }

  private async getQuestionsPerLecture() {
    const questions = await this.questionService.find({}, 'lectureId _id');
    
    const questionsByLecture = questions.reduce((acc, question: QuestionDocument) => {
      const lectureId = question.lectureId.toString();
      
      if (!acc[lectureId]) {
        acc[lectureId] = 0;
      }
      
      acc[lectureId]++;
      return acc;
    }, {});
    
    // Get lectures with their titles
    const lectureIds = Object.keys(questionsByLecture);
    const lectures = await this.lectureService.find(
      { _id: { $in: lectureIds } },
      'title _id'
    );
    
    // Map lecture titles to IDs
    const lectureMap = lectures.reduce((acc: Record<string, string>, lecture: LectureDocument) => {
      if (lecture._id && lecture.title) {
        acc[lecture._id.toString()] = lecture.title;
      }
      return acc;
    }, {});
    
    // Format the data for frontend
    return Object.entries(questionsByLecture)
      .map(([lectureId, count]: [string, number]) => ({
        lectureId,
        lectureTitle: lectureMap[lectureId] || 'Unknown Lecture',
        questionCount: count,
      }))
      .sort((a, b) => b.questionCount - a.questionCount);
  }

  private async getCorrectAnswerDistribution() {
    const questions = await this.questionService.find({}, 'correctAnswer _id');
    
    const answerCount = questions.reduce((acc, question: QuestionDocument) => {
      if (!acc[question.correctAnswer]) {
        acc[question.correctAnswer] = 0;
      }
      
      acc[question.correctAnswer]++;
      return acc;
    }, {});
    
    return Object.entries(answerCount).map(([answer, count]) => ({
      answer,
      count,
    }));
  }
}
