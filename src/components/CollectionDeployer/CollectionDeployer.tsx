import { Database } from "@lib/database.types";
import { useState } from "react";
import DeployModal from "../DeployModal";

type Collection = Database["public"]["Tables"]["collections"]["Row"];

interface CollectionDeployerProps {
  collectionId: Collection["id"];
}

export default function CollectionDeployer({
  collectionId,
}: CollectionDeployerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Preview and Publish
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Preview your collection and deploy the contract.</p>
        </div>
        <div className="mt-5">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={() => setOpen(true)}
          >
            Preview
          </button>
        </div>
      </div>

      {open && collectionId && (
        <DeployModal
          open={open}
          setOpen={setOpen}
          collectionId={collectionId}
        />
      )}
    </div>
  );
}
