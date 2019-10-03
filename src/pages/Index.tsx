import React, { useMemo } from "react";
import uuidv4 from "uuidv4";
import { Link } from "../Router";
import { useAllDocuments } from "../firebase/database";

const useDocumentLists = () => {
  const { document: documents, loaded } = useAllDocuments();
  return useMemo(() => {
    if (!loaded) {
      return <div> doc loading...</div>;
    }
    if (!documents) {
      return <div>no doc</div>;
    }
    return Object.keys(documents).map(textId => {
      const { title } = documents[textId];
      return (
        <li key={textId}>
          <Link href={"/" + textId}>{title}</Link>
        </li>
      );
    });
  }, [documents, loaded]);
};

const IndexPage: React.FC<any> = () => {
  return (
    <div>
      <Link href={"/" + uuidv4()}>新規ページ</Link>
      <ul>{useDocumentLists()}</ul>
    </div>
  );
};
export default IndexPage;
