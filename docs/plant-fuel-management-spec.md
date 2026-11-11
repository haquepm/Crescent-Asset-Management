# Plant & Fuel Management — Implementation Specification

## Agreed operating rules
- Meter readings are entered daily (opening and closing readings).
- Storekeeper records diesel receipts and issues.
- Site Engineer approves or rejects each fuel issue.
- Rental bases: daily, monthly and hourly.
- Diesel is stored in individually identified drums at each site.
- Equipment includes company-owned and rented machinery, vehicles, generators and other plant.

## Modules
1. Equipment register — unique code, type, ownership, make/model, registration, meter type, current site and operator.
2. Hire contracts — supplier, site, daily/monthly/hourly rate, dates, minimum daily hours, opening/closing meter, fuel responsibility, mobilisation/demobilisation and agreement reference.
3. Daily meter readings — one reading per equipment per date; start/end values, calculated usage, breakdown hours, work description and optional meter-photo URLs. New opening reading must match the previous closing reading.
4. Drum register — site, unique drum code and capacity.
5. Diesel receipts — supplier invoice, date, drum, litres, rate and calculated invoice value. Capacity is checked before accepting receipt.
6. Fuel issues — storekeeper records the site, drum, equipment, date, meter reading and litres. The transaction remains pending until an engineer decision.
7. Drum stock checks — expected system balance against physical measured litres, with variance and explanation.
8. Reports — fuel receipt cost, approved issue quantity, rejected issue exceptions, consumption per operating hour/km, hire usage and site-wise stock.

## Stock rules
- Physical balance = receipts − approved issues − pending issues − rejected issues.
- Available-to-issue balance excludes pending issues to prevent double issue.
- Pending issues are reserved immediately when submitted.
- Engineer approval moves the issue to approved consumption; it does not deduct stock a second time.
- A rejected issue remains a physical stock issue because the fuel was already handed out; it is flagged for reconciliation and is not included in approved-consumption analytics.
- Physical stock checks compare against the physical balance including pending issues.
- Drum capacity is validated against the physical balance before receipt entry.

## Permissions
- Store Manager (site storekeeper): create drums, diesel receipts, fuel issues and physical stock checks.
- Site Engineer: create daily meter readings; approve/reject fuel issues; verify stock checks.
- Asset Manager / Super Admin: administer equipment and hire contracts, and perform all operational actions.
- Other authenticated roles: read access only through the module.
- Database RLS enforces the role-specific writes. Fuel approval is performed through the invoker-security RPC `approve_diesel_issue`, which verifies the active user's role and locks the drum while checking available stock.

## Database tables
- `plant_equipment`
- `plant_hire_contracts`
- `plant_meter_readings`
- `diesel_drums`
- `diesel_receipts`
- `diesel_issues`
- `diesel_stock_checks`

## Current scope notes
- Meter photo fields accept URLs; a managed upload workflow is a later enhancement.
- Hire invoice matching / payment approval is not part of this first implementation; hire contracts and usage readings provide the source records for that later reconciliation.
- Consumption rates are observational indicators and should be compared with machine-specific benchmarks, not generic assumptions.
- Corrections should be made through authorised, traceable adjustments; do not silently overwrite operational history.
