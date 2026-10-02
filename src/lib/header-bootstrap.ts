import { initializeHeader } from '../scripts/header';

// Keep the parser-time implementation identical to the TypeScript source under test.
export const headerBootstrap = `(${initializeHeader.toString()})();`;
