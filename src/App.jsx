import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { ThemeLayout } from "./pages/ThemeLayout/ThemeLayout";
import { Reading } from "./pages/Reading/Reading";
import { Logic } from "./pages/Logic/Logic";
import { SpecificLearn } from "./pages/SpecificLearn/SpecificLearn";
import { Parent } from "./pages/Parent/Parent";
import { ShapeGame } from "./pages/ShapeGame/ShapeGame";
import { NotFound } from "./pages/NotFound/NotFound";

function App() {
  return (
    <Routes>
      {/* Layout avec Navbar pour les  pages */}
      <Route element={<ThemeLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/Logic" element={<Logic />} />
        <Route path="/Parent" element={<Parent />} />
        <Route path="/Reading" element={<Reading />} />
        <Route path="/SpecificLearn" element={<SpecificLearn />} />
        <Route path="/ShapeGame" element={<ShapeGame />} />
      </Route>

      {/* Page 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
