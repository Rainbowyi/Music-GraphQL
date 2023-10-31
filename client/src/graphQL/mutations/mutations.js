import { gql } from '@apollo/client';

export const DELETE_MUSIC_ENTRY = gql`
  mutation DeleteMusicEntry($deleteMusicEntryId: ID!) {
    deleteMusicEntry(id: $deleteMusicEntryId) {
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

export const CREATE_MUSIC_ENTRY = gql`
  mutation CreateMusicEntry($input: MusicEntryInput!) {
    createMusicEntry(input: $input) {
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

export const UPDATE_MUSIC_ENTRY = gql`
  mutation UpdateMusicEntry(
    $updateMusicEntryId: ID!
    $input: MusicEntryInput!
  ) {
    updateMusicEntry(id: $updateMusicEntryId, input: $input) {
      id
      title
      style
      rate
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($input: LoginInput!) {
    loginUser(input: $input) {
      createdAt
      email
      id
      token
      username
    }
  }
`;
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
      email
      createdAt
      token
    }
  }
`;
