import { CollectionList } from "@src/components";

interface CollectionsProps {
    address?: string
}

const CollectionsView = ({ address }: CollectionsProps) => {
  return (
    <>
      <h1 id="primary-heading" className="sr-only">
        Collections
      </h1>
      <div className="md:p-8 p-2">
        <CollectionList address={address} />
      </div>
    </>
  );
};

export default CollectionsView;
