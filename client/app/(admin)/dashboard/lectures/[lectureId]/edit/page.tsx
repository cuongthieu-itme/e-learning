import DashboardEditLecture from '@/components/admin/dashboard/lectures/DashboardEditLecture';

const DashboardEditLecturePage = async ({
  params,
}: {
  params: Promise<{ lectureId: string }>;
}) => {
  const { lectureId } = await params;

  return (
    <section className="h-full">
      <DashboardEditLecture lectureId={lectureId} />
    </section>
  );
};

export default DashboardEditLecturePage;
