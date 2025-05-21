import DashboardEditCourse from '@/components/admin/dashboard/courses/DashboardEditCourse';

const DashboardEditCoursePage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;

  return (
    <section className="h-full">
      <DashboardEditCourse courseId={courseId} />
    </section>
  );
};

export default DashboardEditCoursePage;
