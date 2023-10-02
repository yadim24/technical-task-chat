import {QueryProvider} from "./QueryProvider";
import {CommentList} from "./components/CommentList";

function App() {
  return (
    <QueryProvider>
      <CommentList />
    </QueryProvider>
  );
}

export default App;
