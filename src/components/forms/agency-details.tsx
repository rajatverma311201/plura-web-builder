"use client";
import {
    deleteAgency,
    updateAgencyDetails,
    upsertAgency,
} from "@/actions/agency";
import { initUser, saveActivityLogsNotification } from "@/actions/users";
import { FileUpload } from "@/components/global/file-upload";
import { Loading } from "@/components/global/loading";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Agency } from "@prisma/client";
import { NumberInput } from "@tremor/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 } from "uuid";
import * as z from "zod";

interface AgencyDetailsProps {
    data?: Partial<Agency>;
}

const FormSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Agency name must be atleast 2 chars." }),
    companyEmail: z.string().min(1),
    companyPhone: z.string().min(1),
    whiteLabel: z.boolean(),
    address: z.string().min(1),
    city: z.string().min(1),
    zipCode: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
    agencyLogo: z.string().min(1),
});

export const AgencyDetails: React.FC<AgencyDetailsProps> = ({ data }) => {
    const router = useRouter();
    const [deletingAgency, setDeletingAgency] = useState(false);
    const form = useForm<z.infer<typeof FormSchema>>({
        mode: "onChange",
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: data?.name,
            companyEmail: data?.companyEmail,
            companyPhone: data?.companyPhone,
            whiteLabel: data?.whiteLabel || false,
            address: data?.address,
            city: data?.city,
            zipCode: data?.zipCode,
            state: data?.state,
            country: data?.country,
            agencyLogo: data?.agencyLogo,
        },
    });
    const isLoading = form.formState.isSubmitting;

    useEffect(() => {
        if (data) {
            form.reset(data);
        }
    }, [data, form]);

    const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            let newUserData;
            let custId;
            if (!data?.id) {
                const bodyData = {
                    email: values.companyEmail,
                    name: values.name,
                    shipping: {
                        address: {
                            city: values.city,
                            country: values.country,
                            line1: values.address,
                            postal_code: values.zipCode,
                            state: values.zipCode,
                        },
                        name: values.name,
                    },
                    address: {
                        city: values.city,
                        country: values.country,
                        line1: values.address,
                        postal_code: values.zipCode,
                        state: values.zipCode,
                    },
                };

                const customerResponse = await fetch(
                    "/api/stripe/create-customer",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(bodyData),
                    },
                );
                const customerData: { customerId: string } =
                    await customerResponse.json();
                custId = customerData.customerId;
            }

            newUserData = await initUser({ role: "AGENCY_OWNER" });
            if (!data?.customerId && !custId) return;

            const response = await upsertAgency({
                id: data?.id ? data.id : v4(),
                customerId: data?.customerId || custId || "",
                address: values.address,
                agencyLogo: values.agencyLogo,
                city: values.city,
                companyPhone: values.companyPhone,
                country: values.country,
                name: values.name,
                state: values.state,
                whiteLabel: values.whiteLabel,
                zipCode: values.zipCode,
                createdAt: new Date(),
                updatedAt: new Date(),
                companyEmail: values.companyEmail,
                connectAccountId: "",
                goal: 5,
            });
            toast("Created Agency");
            if (data?.id) return router.refresh();
            if (response) {
                return router.refresh();
            }
        } catch (error) {
            console.log(error);
            toast.error("Oops! could not create your agency");
        }
    };
    const handleDeleteAgency = async () => {
        if (!data?.id) return;
        setDeletingAgency(true);
        //WIP: discontinue the subscription
        try {
            const response = await deleteAgency(data.id);
            toast("Deleted your agency and all subaccounts");
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error("Oops! could not delete your agency");
        }
        setDeletingAgency(false);
    };

    return (
        <AlertDialog>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Agency Information</CardTitle>
                    <CardDescription>
                        Lets create an agency for you business. You can edit
                        agency settings later from the agency settings tab.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="agencyLogo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Agency Logo</FormLabel>
                                        <FormControl>
                                            <FileUpload
                                                apiEndpoint="agencyLogo"
                                                onChange={field.onChange}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-4 md:flex-row">
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Agency Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Your agency name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="companyEmail"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Agency Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    readOnly
                                                    placeholder="Email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex gap-4 md:flex-row">
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="companyPhone"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>
                                                Agency Phone Number
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Phone"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="whiteLabel"
                                render={({ field }) => {
                                    return (
                                        <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border p-4">
                                            <div>
                                                <FormLabel>
                                                    Whitelabel Agency
                                                </FormLabel>
                                                <FormDescription>
                                                    Turning on whilelabel mode
                                                    will show your agency logo
                                                    to all sub accounts by
                                                    default. You can overwrite
                                                    this functionality through
                                                    sub account settings.
                                                </FormDescription>
                                            </div>

                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                        </FormItem>
                                    );
                                }}
                            />
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="123 st..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-4 md:flex-row">
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="City"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>State</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="State"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="zipCode"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Zipcpde</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Zipcode"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Country"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {data?.id && (
                                <div className="flex flex-col gap-2">
                                    <FormLabel>Create A Goal</FormLabel>
                                    <FormDescription>
                                        ✨ Create a goal for your agency. As
                                        your business grows your goals grow too
                                        so dont forget to set the bar higher!
                                    </FormDescription>
                                    <NumberInput
                                        defaultValue={data?.goal}
                                        onValueChange={async (val) => {
                                            if (!data?.id) return;
                                            await updateAgencyDetails(data.id, {
                                                goal: val,
                                            });
                                            await saveActivityLogsNotification({
                                                agencyId: data.id,
                                                description: `Updated the agency goal to | ${val} Sub Account`,
                                                subaccountId: undefined,
                                            });
                                            router.refresh();
                                        }}
                                        min={1}
                                        className="!border !border-input bg-background"
                                        placeholder="Sub Account Goal"
                                    />
                                </div>
                            )}
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <Loading />
                                ) : (
                                    "Save Agency Information"
                                )}
                            </Button>
                        </form>
                    </Form>

                    {data?.id && (
                        <div className="mt-4 flex flex-row items-center justify-between gap-4 rounded-lg border border-destructive p-4">
                            <div>
                                <div>Danger Zone</div>
                            </div>
                            <div className="text-muted-foreground">
                                Deleting your agency cannpt be undone. This will
                                also delete all sub accounts and all data
                                related to your sub accounts. Sub accounts will
                                no longer have access to funnels, contacts etc.
                            </div>
                            <AlertDialogTrigger
                                disabled={isLoading || deletingAgency}
                                className="hove:bg-red-600 mt-2 whitespace-nowrap rounded-md p-2 text-center text-red-600 hover:text-white"
                            >
                                {deletingAgency
                                    ? "Deleting..."
                                    : "Delete Agency"}
                            </AlertDialogTrigger>
                        </div>
                    )}
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-left">
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-left">
                                This action cannot be undone. This will
                                permanently delete the Agency account and all
                                related sub accounts.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex items-center">
                            <AlertDialogCancel className="mb-2">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                disabled={deletingAgency}
                                className="bg-destructive hover:bg-destructive"
                                onClick={handleDeleteAgency}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </CardContent>
            </Card>
        </AlertDialog>
    );
};

export default AgencyDetails;
