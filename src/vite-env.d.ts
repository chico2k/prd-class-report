/// <reference types="vite/client" />

// Vite inject environment variables
declare const __BUILD_TARGET__: string;
declare const __PRIMARY_COLOR__: string;
declare const __SECONDARY_COLOR__: string;
declare const __ENCODED_DOMAINS__: string[];
declare const __DOMAIN_SALT__: string;
declare const __SECURITY_ENABLED__: boolean;
