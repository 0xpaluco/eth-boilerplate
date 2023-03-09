import { Database } from "@lib/database.types";
import _ from "lodash";
type Collection = Database["public"]["Tables"]["collections"]["Row"];
type Stem = Database["public"]["Tables"]["stems"]["Row"];

export type Meta = {
  path: string;
  content: {
    [key: string] : any | null;
  };
}

export function generateDeployParams(collection: Collection, stems: Stem[], uri: string) {

    return [
        collection.name,
        uri,
        _.map(stems, (stem) => { return stem.token_id }),
        _.map(stems, (stem) => { return stem.price }),
        _.map(stems, (stem) => { return stem.supply }),
        _.map(stems, (stem) => { return stem.name }),        
    ]

//   return {
//     name: collection.name,
//     ids: _.map(stems, (stem) => { return stem.token_id }),
//     names: _.map(stems, (stem) => { return stem.name }),
//     supplies: _.map(stems, (stem) => { return stem.supply }),
//     fees: _.map(stems, (stem) => { return stem.price }),
//   }
}

export function generateMetadata(collection: Collection, stems: Stem[]) {
  const abi: Meta[] = new Array<Meta>();
  const meta: Meta = {
    path: "metadata.json",
    content: {
      name: collection.name,
      description: collection.description,
      image: collection.thumbnail_url,
    },
  };
  abi.push(meta);
  const stemsMeta = _.map(stems, (stem) => {
    return {
      path: `${stem.token_id}.json`,
      content: {
        id: stem.token_id,
        name: stem.name,
        description: stem.description,
        image: stem.image_hash,
        animation_url: stem.audio_hash,
        attributes: [
          {
            trait_type: "Instrument",
            value: stem.instrument,
          },
          {
            trait_type: "BPM",
            value: stem.bpm,
          },
          {
            trait_type: "Key",
            value: stem.key,
          },
          {
            trait_type: "Genre",
            value: stem.genre,
          },
          {
            trait_type: "License",
            value: stem.license,
          },
        ],
      },
    }
  })
  abi.push(...stemsMeta)

  
  return abi
}