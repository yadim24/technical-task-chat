import {QueryProvider} from "./QueryProvider";
import {CommentsList} from "./components/CommentsList";

function App() {
  return (
    <QueryProvider>
      <CommentsList />
    </QueryProvider>
  );
}

export default App;
