import React from "react";
import { Link } from "../Router";
import { useDatabaseDocument } from "../firebase/database";

const EditPage: React.FC<{ textId: string }> = ({ textId }) => {
  const { text, updateText, loaded, pending } = useDatabaseDocument(textId);
  if (!loaded) {
    return <div>edit page loading</div>;
  }
  return (
    <>
      <div>{pending ? "write peding now" : ""}</div>
      <Link href="/">一覧に戻る</Link>
      <textarea value={text} onChange={e => updateText(e.target.value)} />
    </>
  );
};

export default EditPage;
