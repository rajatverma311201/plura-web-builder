import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/actions/users";
import { Plan, Role } from "@prisma/client";
import { AgencyDetails } from "@/components/forms/agency-details";

interface AgencyDashboardProps {
    searchParams: {
        plan: Plan;
        state: string;
        code: string;
    };
}

const AgencyDashboard: React.FC<AgencyDashboardProps> = async ({
    searchParams,
}) => {
    // const authUser = await currentUser();

    // if (!authUser) {
    //     return redirect("/agency/sign-in");
    // }

    const agencyId = await verifyAndAcceptInvitation();

    const user = await getAuthUserDetails();

    if (agencyId) {
        const isForSubaccount =
            user?.role === Role.SUBACCOUNT_USER ||
            user?.role === Role.SUBACCOUNT_GUEST;

        const isForAgency =
            user?.role === Role.AGENCY_OWNER ||
            user?.role === Role.AGENCY_ADMIN;

        if (isForSubaccount) {
            return redirect(`/subaccount`);
        } else if (isForAgency) {
            if (searchParams.plan) {
                return redirect(
                    `/agency/${agencyId}/billing?plan=${searchParams.plan}`,
                );
            }
            if (searchParams.state) {
                const statePath = searchParams.state.split("___")[0];
                const stateAgencyId = searchParams.state.split("___")[1];
                if (!stateAgencyId) return <div>Not authorized</div>;
                return redirect(
                    `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`,
                );
            } else return redirect(`/agency/${agencyId}`);
        } else {
            return <div>Not authorized</div>;
        }
    }

    const authUser = await currentUser();
    return (
        <div className="mt-4 flex items-center justify-center">
            <div className="max-w-[850px] rounded-xl border-[1px] p-4">
                <h1 className="mb-2 text-4xl"> Create An Agency</h1>
                <AgencyDetails
                    data={{
                        companyEmail: authUser?.emailAddresses[0].emailAddress,
                    }}
                />
            </div>
        </div>
    );
};
export default AgencyDashboard;
