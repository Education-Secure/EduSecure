import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Auth from "./components/Dashboard/Auth";
import Index from "./pages/Index";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import RoadmapPage from "../src/components/Roadmap"; // <-- import your roadmap page

// Wrapper to extract skill param and pass to RoadmapPage
const RoadmapPageWrapper = () => {
  const { skill } = useParams();
  return <RoadmapPage skill={skill} />;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/index" element={<Index />} />
      <Route path="/roadmap/:skill" element={<RoadmapPageWrapper />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
