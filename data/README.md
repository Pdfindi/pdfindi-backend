# Universal Agent API — Data Store
# This folder holds all JSON data files, organized by type.
# Each type gets its own subfolder, auto-created on first write.
#
# Structure:
#   data/blog/        ← blog posts
#   data/faq/         ← FAQ entries
#   data/meta/        ← SEO metadata overrides per page
#   data/pages/       ← page-level content / copy
#   data/tickets/     ← support tickets (if needed)
#   data/logs/        ← agent activity logs
#
# To add a new type, just POST to /api/data/<new-type>
# The folder is created automatically. No code changes needed.
