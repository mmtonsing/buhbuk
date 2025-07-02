// App.jsx
import { AuthProvider } from "./context/AuthProvider";
import { AppRoutes } from "./AppRoutes";
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <AppRoutes />
      </HelmetProvider>
    </AuthProvider>
  );
}

export default App;
