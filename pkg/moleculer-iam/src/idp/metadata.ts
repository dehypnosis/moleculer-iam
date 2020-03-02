export interface IdentityMetadata {
  federation: {
    [key: string]: any;
  };
  softDeleted: boolean;
  scope: {
    [scopeName: string]: boolean;
  };
  [key: string]: any;
}

export const defaultIdentityMetadata = {
  federation: {},
  scope: {},
  softDeleted: false,
};
