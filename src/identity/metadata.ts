export interface IdentityMetadata {
  federation: {
    [key: string]: any;
  };
  softDeleted: boolean;
  [key: string]: any;
}
