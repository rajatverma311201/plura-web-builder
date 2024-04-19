import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ClerkProvider appearance={{ baseTheme: dark }}>
            <main className="h-full">{children}</main>
        </ClerkProvider>
    );
};

export default MainLayout;
