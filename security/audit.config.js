/**
 * Security Audit Configuration
 *
 * Run: pnpm audit
 * CI: Fails build on high/critical severity vulnerabilities
 *
 * Usage:
 *   pnpm audit --audit-level=high
 *   pnpm audit --json > security/audit-report.json
 */

export default {
  // Minimum severity level that fails the build
  failOnSeverity: "high",

  // Packages to ignore (with justification)
  ignore: [
    // Example:
    // { id: 1234, reason: "No fix available, not exploitable in our context", expires: "2026-06-01" }
  ],

  // Audit schedule
  schedule: {
    ci: "every-push",
    full: "weekly",
  },
};
