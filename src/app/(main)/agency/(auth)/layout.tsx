interface AgencyAuthLayoutProps {
    children: React.ReactNode;
}

const AgencyAuthLayout: React.FC<AgencyAuthLayoutProps> = ({ children }) => {
    return (
        <div className="grid min-h-full place-content-center">{children}</div>
    );
};
export default AgencyAuthLayout;
