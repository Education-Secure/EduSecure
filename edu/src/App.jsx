import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./components/Dashboard/Auth";
import Index from "./pages/Index";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const App = () => (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/index" element={<Index />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
);

export default App;
