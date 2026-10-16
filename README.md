# Crescent Asset Management

Centralized quantity-based asset, inventory, hire, purchase and movement management for Crescent Contractors.

## Technology
- Next.js / React / TypeScript
- Supabase PostgreSQL, Auth and Storage
- Vercel deployment

## Core operating rules
- Track quantities by item, location and ownership type (OWNED or HIRED), not individual serial numbers.
- Available stock = on-hand quantity less reservations and quantities under maintenance.
- In-transit stock is unavailable until the receiving site confirms delivery.
- Partial allocation, partial purchase receipt and partial hire return are supported.
- Every stock movement is recorded in an append-only ledger; corrections use reversals or controlled adjustments.
- Stock changes and reservations must be database transactions, never browser-side balance updates.
- Hire receipts never increase owned stock.
- Director authorization is recorded as verbal approval by the Asset Manager, including director name, date/time and remarks.
- Hire returns require a delivery challan.

## Roles
Super Admin, Asset Manager, Project Manager, Store Manager, Site Engineer and Driver.

## Database foundation
The connected Supabase project is `wjormtcfxaxskwcmrlsi` (ap-south-1). The initial schema has been applied and verified. It contains 29 public tables covering identity, roles, projects, locations, suppliers, items, owned batches, stock balances and ledger, requests and approvals, hire, purchase, challans, receipts, maintenance, damage, notifications and audit logs.

RLS is enabled on the public application tables. Internal authorization and stock reservation functions are kept in a non-exposed `private` schema. Direct client writes to stock balances and the stock ledger are restricted.

## Build status
- [x] Supabase project connected and verified
- [x] Foundational database schema applied (29 tables)
- [x] Initial role records created
- [x] Row-level security policies enabled
- [x] Internal stock reservation/release transaction routines added
- [ ] Complete stock movement, dispatch and receipt transaction routines
- [ ] Secure first Super Admin onboarding
- [ ] Next.js application and authentication screens
- [ ] Role-based dashboards and workflows
- [ ] Challan PDF generation and file storage
- [ ] Reports, notifications and acceptance testing

## Important
Never put Supabase service-role credentials in browser code. Use a publishable key in the client and keep privileged operations server-side. Do not use the Crescent Subcontractor Billing or Little Basket Supabase projects for this application.