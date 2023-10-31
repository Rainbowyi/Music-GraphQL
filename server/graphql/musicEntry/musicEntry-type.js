const gql = require('graphql-tag');

const MusicEntryType = gql`
  type MusicEntry {
    id: ID!
    title: String!
    style: String!
    rate: Int!
    createdAt: String!
    updatedAt: String!
    user: ID!
  }

  input MusicEntryInput {
    title: String!
    style: String!
    rate: Int!
    user: ID!
  }

  type MusicEntryMutationResponse {
    id: ID!
    title: String!
    style: String!
    rate: Int!
    createdAt: String!
    updatedAt: String!
    user: ID!
  }

  type Query {
    musicEntry(id: ID!): MusicEntry
    musicEntries: [MusicEntry]
    searchMusicEntries(title: String!): [MusicEntry]
  }

  type Mutation {
    createMusicEntry(input: MusicEntryInput!): MusicEntryMutationResponse!
    updateMusicEntry(
      id: ID!
      input: MusicEntryInput!
    ): MusicEntryMutationResponse!
    deleteMusicEntry(id: ID!): MusicEntryMutationResponse!
  }
`;

module.exports = MusicEntryType;
