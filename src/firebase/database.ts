import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
  useMemo
} from "react";
import { firebase, FirebaseContext } from "./index";

export interface Document {
  textId: string;
  title: string;
  text: string;
}

const useDocRef = (pathName: string): firebase.database.Reference => {
  const { userId } = useContext(FirebaseContext);
  const ref = useMemo(() => {
    return firebase.database().ref(`users/${userId}/${pathName}`);
  }, [userId, pathName]);
  return ref;
};

function useFetchDocument<T>(ref: firebase.database.Reference) {
  const [document, setDocument] = useState<T>();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let mounted = true;
    ref.on("value", snapshot => {
      if (!mounted) {
        return;
      }
      if (snapshot && snapshot.val()) {
        setDocument(snapshot.val());
      }
      setLoaded(true);
    });
    return () => {
      ref.off();
      mounted = false;
    };
  }, [ref]);
  return { document, loaded };
}

export const useAllDocuments = () => {
  const ref = useDocRef("documents");
  return useFetchDocument<{ [key: string]: Document }>(ref);
};

function useUpdateDocument<T = any>(ref: firebase.database.Reference) {
  const [pending, setPending] = useState(false);
  const timerRef = useRef<any>(undefined);
  const mountedRef = useRef<boolean>(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const updateDocument = useCallback(
    (document: T) => {
      if (timerRef.current !== undefined) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        if (!mountedRef.current) {
          return;
        }
        setPending(true);
        ref.set(document).then(e => {
          setPending(false);
        });
        timerRef.current = undefined;
      }, 500);
    },
    [ref]
  );

  return { pending, updateDocument };
}

export const useDatabaseDocument = (textId: string) => {
  const ref = useDocRef(`documents/${textId}`);
  const { document, loaded } = useFetchDocument(ref);
  const [text, setText] = useState("");
  const { pending, updateDocument } = useUpdateDocument(ref);

  useEffect(() => {
    let mounted = true;
    if (mounted && document && "text" in document) {
      setText(document.text);
    }
    return () => {
      mounted = false;
    };
  }, [document]);

  const updateText = useCallback(
    (newText: string) => {
      setText(newText);
      const title = newText.split("\n")[0];
      updateDocument({
        textId,
        text: newText,
        title,
        updatedAt: new Date()
      });
    },
    [updateDocument, textId]
  );
  return { text, updateText, loaded, pending };
};
