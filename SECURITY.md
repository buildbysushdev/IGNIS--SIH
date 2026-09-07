# IGNIS Security Policy

## 1. Overview
**IGNIS** (Intelligent Geospatial Network for Industrial Fire Screening) is an autonomous satellite telemetry and fire risk classification system developed for **NTRO / SIH26162**. This document outlines our vulnerability disclosure policy, security controls, and data privacy commitments.

---

## 2. Reporting a Vulnerability

If you discover a security vulnerability within this repository or associated deployed infrastructure, please follow responsible disclosure:

- **Primary Contact**: `security@ignis-fire.org` (or create a private GitHub Security Advisory).
- **Required Details**:
  - Description of vulnerability and potential impact.
  - Reproducible steps or proof-of-concept request.
  - Affected components (`backend`, `frontend`, API endpoints, or database).
- **Response Commitment**:
  - Initial acknowledgement within 24 hours.
  - Triage and mitigation patch within 72 hours.
  - Public disclosure only after a fix is verified and deployed.

---

## 3. Threat Model & Safeguards

| Threat Vector | Mitigation Strategy | Implemented In |
| :--- | :--- | :--- |
| **Credential Leakage** | All API keys and secrets loaded via environment variables; `.env` strictly gitignored; automated repo audits. | `backend/config.py`, `.gitignore` |
| **Denial of Service (DoS)** | IP-based rate limiting via `slowapi`; global 60 req/min, burst capping, response size limits (max 5,000 records). | `backend/main.py` |
| **SQL Injection (SQLi)** | 100% parameterized SQLite queries using `?` bindings and named parameters; zero string concatenation. | `backend/database.py` |
| **Cross-Site Scripting (XSS)** | React JSX automated escaping; zero `dangerouslySetInnerHTML`; Content Security Policy & HTTP security headers. | `frontend/next.config.js` |
| **Clickjacking & MIME Sniffing** | HTTP headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`. | `frontend/next.config.js` |
| **Unauthorized CORS Origins** | CORS restricted to official Vercel deployment domains and local development environments. | `backend/main.py` |
| **Reverse Tabnabbing** | All external links enforce `target="_blank" rel="noopener noreferrer"`. | `frontend/components/` |
| **Database Corruption** | SQLite WAL mode (`PRAGMA journal_mode=WAL`), foreign keys enabled, 5000ms busy timeout. | `backend/database.py` |
| **Telemetry Cache Tampering** | Atomic file writes (`.tmp` -> `os.replace`) to prevent corrupted cache files on abrupt restarts. | `backend/firms.py`, `backend/osm_data.py` |

---

## 4. Data Privacy Statement

- **Zero Personally Identifiable Information (PII)**: IGNIS does not collect, process, or store personal user data, user tracking cookies, phone numbers, or email addresses.
- **Geospatial & Public Domain Only**: All processed data originates from open public domain spaceborne instruments (NASA FIRMS MODIS/VIIRS) and open geospatial registries (OpenStreetMap).
- **Transient Logging**: Diagnostic telemetry logs only capture operational request events, sensor latency, and error states. API keys, authorization headers, and IP addresses are scrubbed.

---

## 5. Security Checklist for Deployers

Before deploying IGNIS in production:
1. Ensure `FIRMS_MAP_KEY` is configured in Railway / host environment variables (never in code).
2. Set `NEXT_PUBLIC_API_URL` to your HTTPS backend endpoint in Vercel.
3. Verify that `backend/.env` is NOT tracked in git (`git status`).
4. Ensure HTTPS is enforced on all custom domain ingress points.
