# <type>: <subject> (50 chars max)
# |<----   Preferably using up to 50 characters   ---->|

# Explain why this change is being made
# |<----   Try to limit each line to 72 characters   ---->|

# Provide links or keys to any relevant tickets, articles or other resources
# Example: Github issue #23

# --- COMMIT END ---
# Type can be 
#    feat     (new feature for the user)
#    fix      (bug fix for the user)
#    docs     (changes to documentation)
#    style    (formatting, missing semi colons, etc; no code change)
#    refactor (refactoring production code)
#    test     (adding missing tests, refactoring tests; no production code change)
#    chore    (updating grunt tasks etc; no production code change)
#    perf     (performance improvements)
#    ci       (changes to CI configuration files and scripts)
#    build    (changes that affect the build system or external dependencies)
#    revert   (reverts a previous commit)
# --------------------
# Remember to:
#    - Use the imperative mood in the subject line
#    - Capitalize the subject line
#    - Do not end the subject line with a period
#    - Separate subject from body with a blank line
#    - Use the body to explain what and why vs. how
#    - Can use multiple lines with "-" or "*" for bullet points in body
# --------------------
# Example commit message:
# --------------------
# feat: Add user authentication system
#
# Implemented JWT-based authentication to secure API endpoints.
# This change was needed to protect sensitive user data and ensure
# only authorized users can access certain features.
#
# - Added JWT token generation and validation
# - Created auth middleware for protected routes
# - Updated user model with password hashing
#
# Fixes #45
# --------------------