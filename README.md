# EDIT — CSCID Website Content Source

Canonical repository for public website content and media references used by Coconut Shell Charcoal Indonesia (CSCID).

## Responsibility

EDIT owns the content source of truth:
- Public website copy, headings, descriptions, labels, CTA text and links.
- Page and section content.
- Public image/media references and asset metadata.
- SEO and page metadata.
- Publication metadata and content schema versions.

EDIT does **not** own application code, route handlers, authentication, infrastructure settings, or the design system.

## Current content contract

- Published content document: `content/site.json`
- Schema version: `1`
- Public status: `metadata.status = "published"`
- Main site currently reads the homepage hero through CSCID's `/api/site-content` route.
- The API fetches the public EDIT document at runtime with caching disabled; content-only changes therefore do not require a CSCID build/deployment.

## Publishing and safety

The current main document is the published content snapshot. The full Founder workflow for draft, preview, validation, approval, and publish is still being completed. Do not treat a working editor UI or a GitHub branch save as a production publish.

Only public website content belongs here. Never commit passwords, API keys, tokens, personal customer records, or other secrets.

## Related repositories

- `CSCID2004/CSCID`: application structure, routes, components, rendering, and content API.
- `CSCID2004/CSS-ID`: design tokens, stylesheets, responsive rules, and visual components.
- `CSCID2004/SERVER`: Founder/Admin control plane and website editing workflow.

## Change procedure

1. Prepare and validate content in a non-production branch.
2. Review the diff and verify referenced assets.
3. Publish through the approved Founder workflow once it is available.
4. Confirm the public `/api/site-content` response reports `source: "EDIT"` and the website renders the expected revision.

Until the publish workflow is complete, direct changes to `main` are administrative source updates, not a substitute for the intended approval workflow.
