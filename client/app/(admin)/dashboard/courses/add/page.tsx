import HandleCourse from "@/components/admin/dashboard/courses/handle/HandleCourse";

const DashboardAddCoursePage = () => {
  return (
    <section className="h-full">
      <HandleCourse isEdit={false} />
    </section>
  );
};

export default DashboardAddCoursePage;
