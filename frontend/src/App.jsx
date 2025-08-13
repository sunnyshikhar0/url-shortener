
import { useState } from "react";
import UrlShortner from "./components/UrlShortner";
import UrlLists from "./components/UrlLists";

function App() {
  const [refreshList, setRefreshList] = useState(0);

  // Handler for refreshing URL list
  const handleUrlShortened = () => {
    setRefreshList((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-teal-200 to-pink-200">
      <div className="container mx-auto px-4 py-8">
        <UrlShortner onUrlShortened={handleUrlShortened} />
        <UrlLists refresh={refreshList} />
      </div>
    </div>
  );
}

export default App;
