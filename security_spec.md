# Security Specification

## Data Invariants
- Any user can create/read opportunities and sales they are involved in.

## The "Dirty Dozen" Payloads (Conceptual Test)
- Attempting to bypass auth: Should return PERMISSION_DENIED.
- Attempting to change an immutable field: Should return PERMISSION_DENIED.
- Attempting to inject junk in ID fields: Should return PERMISSION_DENIED.

## Auth Logic
- All write/read operations require `request.auth != null`.
