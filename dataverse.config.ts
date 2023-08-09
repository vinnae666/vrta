export const config = {
  slug: "xDataverse",
  name: "xDataverse", // app name should NOT contain "-"
  logo: "https://bafybeifozdhcbbfydy2rs6vbkbbtj3wc4vjlz5zg2cnqhb2g4rm2o5ldna.ipfs.w3s.link/dataverse.svg",
  website: ["localhost"], // you can use localhost:(port) for testing
  defaultFolderName: "Main",
  description: "This is dataverse app example.",
  models: [
    {
      isPublicDomain: false, // default
      schemaName: "post.graphql",
      encryptable: ["text", "images", "videos"],
    },
 {
      isPublicDomain: false, // default
      schemaName: "blog.graphql",
      encryptable: [],
    },
    {
      isPublicDomain: true,
      schemaName: "profile.graphql",
      encryptable: [],
    },
  ],
  ceramicUrl: null, // leave null to use dataverse test Ceramic node. Set to {Your Ceramic node Url} for mainnet, should start with "https://".
};

