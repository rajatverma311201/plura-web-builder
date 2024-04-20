import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface AgencyDashboardProps {}

const AgencyDashboard: React.FC<AgencyDashboardProps> = async ({}) => {
    const authUser = await currentUser();

    if (!authUser) {
        return redirect("agency/sign-in");
    }

    return <h1>AgencyDashboard</h1>;
};
export default AgencyDashboard;
