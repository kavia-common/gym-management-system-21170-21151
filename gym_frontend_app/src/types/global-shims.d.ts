declare module '*.jsx' {
  const component: any;
  export default component;
}

declare module '*.tsx' {
  const component: any;
  export default component;
}

// Allow importing TS from JS without TS type checking in CRA JS build context
declare module '../context/AuthContext' {
  export const AuthProvider: any;
  export const useSupabaseAuth: any;
  export const useAuth: any;
  export const useRole: any;
}
