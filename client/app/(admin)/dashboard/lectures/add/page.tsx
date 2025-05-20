import HandleLecture from "@/components/admin/dashboard/lectures/handle/HandleLecture";

const DashboardAddLecturePage = () => {
  return (
    <section className="h-full">
      <HandleLecture isEdit={false} />
    </section>
  );
};

export default DashboardAddLecturePage;
