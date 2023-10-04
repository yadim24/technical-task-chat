import {CommentList} from "./components/CommentList";
import {LikeStateProvider} from "./providers/LikeStateProvider";
import {QueryProvider} from "./providers/QueryProvider";

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
