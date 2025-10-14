


import Routing from "@/routing";
import {LangProvider} from "@/context/LangContext";
import {AuthProvider} from "@/context/AuthContext";



function App() {
  return (
      <>
          <LangProvider>
              <AuthProvider>
                  <Routing />
              </AuthProvider>
          </LangProvider>
      </>
  );
}

export default App;
