


import Routing from "@/routing";
import {LangProvider} from "@/context/LangContext";
import {AuthProvider} from "@/context/AuthContext";
import {ToastContainer} from "react-toastify";



function App() {
  return (
      <>
          <LangProvider>
              <AuthProvider>
                  <ToastContainer
                      position="bottom-left"
                      autoClose={3000} // ms
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      pauseOnHover
                      draggable
                      theme="colored" // or "light" | "dark"
                  />
                  <Routing />
              </AuthProvider>
          </LangProvider>
      </>
  );
}

export default App;
