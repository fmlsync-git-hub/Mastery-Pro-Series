# Security Specification - Mastery Pro Series

## Data Invariants
1. A **User** profile can only be created by the authenticated user with the matching UID.
2. Users can only read their own profile.
3. A **QuizSession** must belong to the authenticated user who performed it.
4. Users can only read their own quiz sessions.
5. `registeredAt` and `timestamp` fields must match `request.time`.
6. Once a User profile is created, the `email` and `uid` fields are immutable.

## The "Dirty Dozen" Payloads (Security Testing)

1. **User Spoofing**: Attempt to create a user profile for a different UID.
2. **Email Hijacking**: Attempt to update a user profile's email to another user's email.
3. **Session Injection**: Attempt to create a quiz session for another user's UID.
4. **Result Tampering**: Attempt to update a previous quiz session's score.
5. **PII Leak**: Attempt to read all users' profiles.
6. **Stat Forgery**: Attempt to create a quiz session with a future/past timestamp instead of server time.
7. **Size Attack**: Attempt to save a 1MB string as a full name.
8. **Field Injection**: Attempt to add an `isAdmin: true` field to the user profile.
9. **Orphaned Session**: Attempt to create a session without a `userId`.
10. **Shadow Update**: Attempt to update a session's `id` during an update.
11. **Mass Delete**: Attempt to delete all quiz sessions.
12. **Unverified Create**: Attempt to create a profile without being signed in.

## Test Runner logic (Conceptual)
The rules will be validated via ESLint and manual logic checks against these payloads.
