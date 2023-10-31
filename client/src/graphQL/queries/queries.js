import { gql } from '@apollo/client';

export const GET_MUSIC_ENTRIES = gql`
  query MusicEntries {
    musicEntries {
      id
      title
      style
      rate
      createdAt
      updatedAt
      user
    }
  }
`;

export const GET_MUSIC_ENTRY = gql`
  query MusicEntry($musicEntryId: ID!) {
    musicEntry(id: $musicEntryId) {
      id
      title
      style
      rate
    }
  }
`;
