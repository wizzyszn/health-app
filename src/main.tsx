import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "@/config/stores/store.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { scan } from "react-scan";
// OAuth environment validation (development only)
import "./lib/oauth-env-check.ts";

const queryClient = new QueryClient();
scan({
  enabled: false,
});
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
);
