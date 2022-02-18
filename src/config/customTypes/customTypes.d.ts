// Global flag that keeps track if permission is currently in process of being requested
// Syntax requires the use of `var`, technically, it's a `let`.
/* eslint-disable no-var */
declare var isAskingForPermission: boolean
declare var isAskingForLocalAuth: boolean

// TODO: add types
declare module 'adex-protocol-eth/js/IdentityProxyDeploy'
