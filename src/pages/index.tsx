import Login from "@/pages/components/Login";
import { useAuthentication } from "@/utils/storage";
import Main from "./components/Layout/Main";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketListenerPayload } from "@/utils/interface";
// import useSound from "use-sound";

export default function Home() {
  const { isAuthenticated } = useAuthentication();
  const [playbackRate, setPlaybackRate] = useState(0.75);

  // const [play] = useSound("/assets/sound.mp3", {
  //   playbackRate,
  //   // `interrupt` ensures that if the sound starts again before it's
  //   // ended, it will truncate it. Otherwise, the sound can overlap.
  //   interrupt: true,
  // });

  useEffect(() => {
    const socket_server = "http://77.37.45.109:9000/";
    const socket = io(socket_server);

    //listen to event observerChanges
    socket.on("observerChanges", (data: SocketListenerPayload) => {
      const { withdrawals, deposits, inquires, newmembers, trades } = data;
      console.log({ withdrawals, deposits, inquires, newmembers, trades });
      if (withdrawals) {
        // play();
        toast.info(`New Withdrawal Request: ${withdrawals} withdrawals`);
      }
      if (deposits) {
        // play();
        toast.info(`New Deposit Request: ${deposits} deposits`);
      }
      if (inquires) {
        // play();
        toast.info(`New Inquiry: ${inquires} inquries`);
      }
      if (newmembers) {
        // play();
        toast.info(`New Member: ${newmembers} new members`);
      }
      if (trades) {
        // play();
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
        <Main />
      </>
    );
  }

  return <Login />;
}

//a
