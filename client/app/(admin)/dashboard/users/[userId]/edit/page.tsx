import DashboardEditUser from '@/components/admin/dashboard/users/DashboardEditUser';

const DashboardEditUserPage = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const { userId } = await params;

  return (
    <section className="h-full">
      <DashboardEditUser userId={userId} />
    </section>
  );
};

export default DashboardEditUserPage;
