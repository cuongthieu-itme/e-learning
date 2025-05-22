import { getApiHandler } from '../api';

export const getAnalytics = async (): Promise<
  ServerResponse<{
    data: {
      overview: {
        totalOrders: number;
        ordersThisMonth: number;
        totalProducts: number;
        productsThisMonth: number;
        totalUsers: number;
        usersThisMonth: number;
        totalRevenue: number;
        revenueThisMonth: number;
      };
      userMetrics: {
        userGrowth: {
          date: string;
          count: number;
        }[];
        roleDistribution: {
          role: string;
          count: number;
        }[];
      };
      courseMetrics: {
        coursesBySubject: {
          subject: string;
          count: number;
        }[];
        courseCreationTrend: {
          date: string;
          count: number;
        }[];
        publishStatus: {
          status: string;
          count: number;
        }[];
        courseTopicsDistribution: {
          averageTopicsPerCourse: number;
          maxTopicsInCourse: number;
          minTopicsInCourse: number;
        };
      };
      lectureMetrics: {
        lecturesPerCourse: {
          courseId: string;
          courseName: string;
          lectureCount: number;
        }[];
        lectureStatusDistribution: {
          status: string;
          count: number;
        }[];
        lectureContentTypes: {
          type: string;
          count: number;
        }[];
      };
      questionMetrics: {
        questionsPerLecture: {
          lectureId: string;
          lectureTitle: string;
          questionCount: number;
        }[];
        correctAnswerDistribution: {
          answer: string;
          count: number;
        }[];
      };
      salesPerformance: {
        _id: string;
        status: string;
        totalPrice: number;
        createdAt: string;
      }[];
      ordersByStatus: {
        id: string;
        status: string;
      }[];
      topSellingProducts: {
        id: string;
        items: {
          product: string;
          quantity: number;
        }[];
      }[];
      customerGrowth: {
        id: string;
        createdAt: string;
      }[];
    };
  }>
> => {
  return await getApiHandler('analytics');
};
