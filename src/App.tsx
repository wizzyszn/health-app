import { ToastProvider } from "./components/toast";

// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import AppRouter from "./config/routes/index.route";

const App = () => {
  return (
    <>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      <ToastProvider />
      <AppRouter />
    </>
  );
};

export default App;
