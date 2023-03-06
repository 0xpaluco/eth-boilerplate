import { MusicalNoteIcon, PlayIcon } from "@heroicons/react/20/solid";
import { classNames } from "@src/helpers";
import { ipfsClient, resolveIPFS } from "@src/utils/resolveIPFS";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface IPFSUploadProps {
  label: string;
  name: string;
  fileType: string;
  ipfsUrl: string | null;
  onUpload: (url: string) => void;
  size?: number;
}

export default function IFPSpload({
  label,
  name,
  fileType,
  ipfsUrl,
  onUpload,
  size = 128,
}: IPFSUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileExt, setFileExt] = useState<string | null>(null);
  useEffect(() => {
    if (ipfsUrl) downloadImage(ipfsUrl);
  }, [ipfsUrl]);

  async function downloadImage(path: string) {
    try {
      const url = resolveIPFS(path) ?? path;
      setMediaUrl(url);
    } catch (error) {
      toast.error("Error resolving IPFS Gateway");
    }
  }

  const uploadMedia: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop() ?? ".ext"
      setFileName(file.name)
      setFileExt(fileExt)
      
      const added = await ipfsClient().add(file);
      const url = `ipfs://${added.path}`;
      onUpload(url);
      setMediaUrl(url);
      
      console.log("IPFS URI: ", url);
    } catch (error) {
      console.log("Error uploading file: ", error);
      toast.error("Error uploading to IPFS");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg mt-6">
      <div>
        <label className="block text-base font-medium leading-6 text-gray-900 mb-1 px-0">
          {label}
        </label>
      </div>
      {mediaUrl ? (
        <div>
          {fileType === "audio/*" && (
            <div key={name} className="col-span-1 flex rounded-md shadow-sm">
              <div
                className={classNames(
                  "bg-indigo-500",
                  "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
                )}
              >
                <MusicalNoteIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
                <div className="flex-1 truncate px-4 py-2 text-sm">
                  <span className="font-medium text-gray-900 hover:text-gray-600">
                    {fileName}
                  </span>
                  <p className="text-gray-500">{fileExt}</p>
                </div>
                <div className="flex-shrink-0 pr-2">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">Open options</span>
                    <PlayIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {fileType === "image/*" &&
            (name === "thumbnail" || name === "cover") && (
              <div className="block w-32 h-32 overflow-hidden rounded-lg">
                <Image
                  src={resolveIPFS(mediaUrl)!}
                  alt={name}
                  className="h-full w-full text-gray-300 object-fill"
                  width={size}
                  height={size}
                />
              </div>
            )}

          {fileType === "image/*" && name === "banner" && (
            <div className="block w-full h-full overflow-hidden rounded-lg">
              <Image
                src={resolveIPFS(mediaUrl)!}
                alt={name}
                className=" text-gray-300 object-fill"
                width={size * 6}
                height={size * 2}
              />
            </div>
          )}

          <div className="px-1 mt-2">
            <label
              htmlFor={name}
              className="cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
            >
              <span>{uploading ? "Uploading..." : "Change file"}</span>
              <input
                id={name}
                name={name}
                accept={fileType}
                type="file"
                className="sr-only"
                onChange={uploadMedia}
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
          <div className="space-y-3 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor={name}
                className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span className="items-center">Upload a file</span>
                <input
                  id={name}
                  name={name}
                  accept={fileType}
                  type="file"
                  className="sr-only"
                  onChange={uploadMedia}
                  disabled={uploading}
                />
              </label>
              <p className="pl-1">to get started.</p>
            </div>
            <p className="text-xs text-gray-500">
              {uploading ? "Uploading..." : ""}
            </p>
            <p className="text-xs text-gray-500">
              {fileType === "image/*"
                ? "PNG, JPG, GIF up to 10MB"
                : "MP3, WAV up to 50MB"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
