import DashboardEditQuestion from '@/components/admin/dashboard/questions/DashboardEditQuestion';

const DashboardEditQuestionPage = async ({
  params,
}: {
  params: Promise<{ questionId: string }>;
}) => {
  const { questionId } = await params;

  return (
    <section className="h-full">
      <DashboardEditQuestion questionId={questionId} />
    </section>
  );
};

export default DashboardEditQuestionPage;
