import Login from "@/pages/components/Login";
import { useAuthentication } from "@/utils/storage";
import Main from "./components/Layout/Main";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketListenerPayload } from "@/utils/interface";
import SoundPlayer from "./components/utils/SoundPlayer";
import useSWR from "swr";
import axios from "axios";
// import useSound from "use-sound";

export default function Home() {
  const { isAuthenticated } = useAuthentication();
  const [playSound, setPlaySound] = useState<boolean>(false);
  const handlePlaySound = () => {
    setPlaySound(true);
    setTimeout(() => setPlaySound(false), 1000); // Reset playSound after 1 second
  };

  // const [play] = useSound("/assets/sound.mp3", {
  //   playbackRate,
  //   // `interrupt` ensures that if the sound starts again before it's
  //   // ended, it will truncate it. Otherwise, the sound can overlap.
  //   interrupt: true,
  // });

  useSWR(
    "https://mslot10.com/reports",
    async (url) => {
      const res = await axios.get<SocketListenerPayload>(url);
      return res.data;
    },
    {
      refreshInterval: 1000,
      onSuccess: (data) => {
        const { withdrawals, deposits, inquires, newmembers, trades } = data;
        console.log({ withdrawals, deposits, inquires, newmembers, trades });
        if (withdrawals) {
          handlePlaySound();
          toast.info(`New Withdrawal Request: ${withdrawals} withdrawals`);
        }
        if (deposits) {
          handlePlaySound();
          toast.info(`New Deposit Request: ${deposits} deposits`);
        }
        if (inquires) {
          handlePlaySound();
          toast.info(`New Inquiry: ${inquires} inquries`);
        }
        if (newmembers) {
          handlePlaySound();
          toast.info(`New Member: ${newmembers} new members`);
        }
        if (trades) {
          handlePlaySound();
          toast.info(`New Trade: ${trades} trades`);
        }
      },
    }
  );

  useEffect(() => {
    const socket_server = "http://localhost:9000";
    const socket = io(socket_server);

    //listen to event observerChanges
    socket.on("observerChanges", (data: SocketListenerPayload) => {
      const { withdrawals, deposits, inquires, newmembers, trades } = data;
      console.log({ withdrawals, deposits, inquires, newmembers, trades });
      if (withdrawals) {
        handlePlaySound();
        toast.info(`New Withdrawal Request: ${withdrawals} withdrawals`);
      }
      if (deposits) {
        handlePlaySound();
        toast.info(`New Deposit Request: ${deposits} deposits`);
      }
      if (inquires) {
        handlePlaySound();
        toast.info(`New Inquiry: ${inquires} inquries`);
      }
      if (newmembers) {
        handlePlaySound();
        toast.info(`New Member: ${newmembers} new members`);
      }
      if (trades) {
        handlePlaySound();
        toast.info(`New Trade: ${trades} trades`);
      }
    });

    // Use the socket connection here

    // Clean up the connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array means this effect runs once on mount and clean up on unmount

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

//a
