import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback
} from "react";
import { History } from "history";
import uuidv4 from "uuidv4";

import Index from "./pages/Index";
import Edit from "./pages/Edit";

const useCurrentPath = (history: History) => {
  const [pathName, setPathName] = useState(history.location.pathname);
  useEffect(() => {
    const unlinten = history.listen(location => {
      setPathName(location.pathname);
    });
    return unlinten;
  }, [history]);
  return pathName;
};

const useEditorRouting = (pathName: string) => {
  const content = useMemo(() => {
    if (pathName === "/") {
      return <Index />;
    } else if (uuidv4.is(pathName.slice(1))) {
      return <Edit textId={pathName.slice(1)} />;
    } else {
      return <div>404</div>;
    }
  }, [pathName]);
  return content;
};

type RouterProps = { history: History };
const RouterContext = React.createContext<History | null>(null);

export const Router: React.FC<RouterProps> = ({ history }) => {
  const pathName = useCurrentPath(history);
  const content = useEditorRouting(pathName);
  return (
    <RouterContext.Provider value={history}>{content}</RouterContext.Provider>
  );
};

type LinkProps = { href: string; as?: string };
export const Link: React.FC<LinkProps> = ({ href, as = "a", children }) => {
  const history = useContext(RouterContext);
  const onClick = useCallback(
    (ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      ev.preventDefault();
      history!.push(href);
    },
    [history, href]
  );
  return React.createElement(as, { onClick, href }, children);
};
