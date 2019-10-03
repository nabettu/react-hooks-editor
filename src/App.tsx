import React from "react";
import { History } from "history";

// import { FirebaseContext } from "./firebase";
import { FirebaseAuth, signInWithRedirect, signOut } from "./firebase/auth";
import { Router } from "./Router";
const Content: React.FC<{ history: History }> = ({ history }) => {
  return <Router history={history} />;
};

// const Context: React.FC = () => {
//   const { userId, userName } = useContext(FirebaseContext);
//   return (
//     <div>
//       {userName} ({userId})
//     </div>
//   );
// };

const App: React.FC<{ history: History }> = ({ history }) => {
  const NotSignIn = React.useCallback(() => {
    return <button onClick={() => signInWithRedirect()}>signIn</button>;
  }, []);
  const Loading = React.useCallback(() => {
    return <div>loading...</div>;
  }, []);

  return (
    <FirebaseAuth NotSignedIn={NotSignIn} Loading={Loading}>
      <Content history={history} />
      <button onClick={signOut}>sign out</button>
    </FirebaseAuth>
  );
};

export default App;
