// App.jsx
import { AuthProvider } from "./context/AuthProvider";
import { AppRoutes } from "./AppRoutes";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
