/**
 * License Compliance Policy
 *
 * Run: npx license-checker --production --summary
 * CI: Fails if forbidden licenses are found
 *
 * Usage:
 *   npx license-checker --production --failOn "GPL-2.0;GPL-3.0;AGPL-1.0;AGPL-3.0"
 *   npx license-checker --production --summary > security/license-report.txt
 */

export default {
  // Licenses that are ALLOWED in production
  allowed: [
    "MIT",
    "ISC",
    "BSD-2-Clause",
    "BSD-3-Clause",
    "Apache-2.0",
    "0BSD",
    "CC0-1.0",
    "Unlicense",
    "BlueOak-1.0.0",
    "CC-BY-4.0",
  ],

  // Licenses that are FORBIDDEN — build must fail
  forbidden: ["GPL-2.0", "GPL-3.0", "AGPL-1.0", "AGPL-3.0", "SSPL-1.0", "EUPL-1.1", "EUPL-1.2"],

  // Packages with manual approval (override)
  exceptions: [
    // Example:
    // { package: "some-package", license: "GPL-2.0-only", reason: "Used only in dev, not shipped" }
  ],
};
