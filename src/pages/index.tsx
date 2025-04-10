import Login from "@/pages/components/Login";
import { useAuthentication } from "@/utils/storage";
import Main from "./components/Layout/Main";
import { useEffect, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketListenerPayload } from "@/utils/interface";
import SoundPlayer from "./components/utils/SoundPlayer";
import { socket } from "@/utils/socket";
// import useSound from "use-sound";

export default function Home() {
  const { isAuthenticated } = useAuthentication();
  const [playSound, setPlaySound] = useState<boolean>(false);
  const handlePlaySound = () => {
    setPlaySound(true);
    setTimeout(() => setPlaySound(false), 1000); // Reset playSound after 1 second
  };

  useEffect(() => {
    //listen to event observerChanges
    socket.on("observerChanges", (data: SocketListenerPayload) => {
      const { withdrawals, deposits, inquires, newmembers, trades } = data;
      if (withdrawals) {
        handlePlaySound();
        toast.dismiss();
        toast.info(`New Withdrawal Request: ${withdrawals} withdrawals`);
      }
      if (deposits) {
        handlePlaySound();
        toast.dismiss();
        toast.info(`New Deposit Request: ${deposits} deposits`);
      }
      if (inquires) {
        handlePlaySound();
        toast.dismiss();
        toast.info(`New Inquiry: ${inquires} inquries`);
      }
      if (newmembers) {
        handlePlaySound();
        toast.dismiss();
        toast.info(`New Member: ${newmembers} new members`);
      }
      if (trades) {
        handlePlaySound();
        toast.dismiss();
        toast.info(`New Trade: ${trades} trades`);
      }
    });

    socket.on("user_logged_in", ( data: { time:string } ) => {
      handlePlaySound();
      toast.dismiss();
      toast.info("User logged in");
    })

    return () => {
      socket.disconnect();
    };
  }, []);

  if (isAuthenticated) {
    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={10000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
        <SoundPlayer playSound={playSound} />
        <Main />
      </>
    );
  }

  return <Login />;
}
