import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
   siteMetadata: {
      title: `3D Noise`,
      siteUrl: `https://damiponce.github.io/3d-noise/`,
   },
   // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
   // If you use VSCode you can also use the GraphQL plugin
   // Learn more at: https://gatsby.dev/graphql-typegen
   graphqlTypegen: true,
   plugins: [`gatsby-plugin-sass`],
   // assetPrefix: 'https://damiponce.github.io/3d-noise',
   //  pathPrefix: '/3d-noise',
};

export default config;
