import Login from "@/pages/components/Login";
import { useAuthentication } from "@/utils/storage";
import Main from "./components/Layout/Main";

export default function Home() {
    const { isAuthenticated } = useAuthentication();

    if (isAuthenticated) {
        return <Main />;
    }

    return <Login />;
}

//a
