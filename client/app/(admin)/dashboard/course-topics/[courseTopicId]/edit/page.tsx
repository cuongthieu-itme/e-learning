import DashboardEditCourseTopic from '@/components/admin/dashboard/course-topics/DashboardEditCourseTopic';

const DashboardEditCourseTopicPage = async ({
    params,
}: {
    params: Promise<{ courseTopicId: string }>;
}) => {
    const { courseTopicId } = await params;

    return (
        <section className="h-full">
            <DashboardEditCourseTopic courseTopicId={courseTopicId} />
        </section>
    );
};

export default DashboardEditCourseTopicPage;
