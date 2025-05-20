import HandleQuestion from "@/components/admin/dashboard/questions/handle/HandleQuestion";

const DashboardAddQuestionPage = () => {
  return (
    <section className="h-full">
      <HandleQuestion isEdit={false} />
    </section>
  );
};

export default DashboardAddQuestionPage;
