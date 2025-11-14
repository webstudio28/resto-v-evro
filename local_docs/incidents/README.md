# Incident Report Template

Use this template whenever an incident or near-miss occurs.

```
## Incident Title
- **ID:** INC-YYYYMMDD-XX
- **Date/Time:** YYYY-MM-DD HH:MM (UTC)
- **Severity:** SEV1 / SEV2 / SEV3
- **Reported By:** Name / System
- **Services Impacted:** e.g., Activation API, SMS delivery, Stripe webhook

### Timeline
- T0 – Detection (source & alert)
- T+X – Mitigation step
- T+Y – Resolution confirmed

### Customer Impact
- Users affected (count or %)
- Errors observed / support tickets

### Root Cause
- Technical summary
- Contributing factors

### Mitigation & Recovery
- Immediate fixes deployed
- Backlog cleanup (e.g., resend SMS list)

### Follow-Up Actions
| Action | Owner | Due Date | Status |
| --- | --- | --- | --- |
| Example: Add retry queue for SMS | Tech Lead | YYYY-MM-DD | Pending |

### Lessons Learned
- What went well
- What to improve
```

Store each filled incident as `local_docs/incidents/INC-YYYYMMDD-XX.md`.

> Reminder: link the incident ID in access reviews and roadmap retrospectives.

