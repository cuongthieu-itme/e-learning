import HandleCourseTopic from "@/components/admin/dashboard/course-topics/handle/HandleCourseTopic";

const DashboardAddCourseTopicPage = () => {
  return (
    <section className="h-full">
      <HandleCourseTopic isEdit={false} />
    </section>
  );
};

export default DashboardAddCourseTopicPage;
