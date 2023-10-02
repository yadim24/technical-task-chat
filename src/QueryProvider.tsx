import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {FC, ReactNode} from "react";

type Props = {
    children: ReactNode;
};

const queryClient = new QueryClient();

export const QueryProvider: FC<Props> = ({children}) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};
