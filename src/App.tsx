import {QueryProvider} from "./QueryProvider";
import {CommentList} from "./components/CommentList";
import {LikeStateProvider} from "./providers/LikeStateProvider";

function App() {
  return (
    <QueryProvider>
      <LikeStateProvider>
        <CommentList />
      </LikeStateProvider>
    </QueryProvider>
  );
}

export default App;
