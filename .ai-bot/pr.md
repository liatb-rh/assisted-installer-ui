## What

Add "No matching clusters" empty state message when filters return no results in the Assisted Clusters list.

## Why

When users apply filters in the cluster list and no clusters match the criteria, the UI shows an empty table without any explanatory message, leaving users uncertain whether the filters worked correctly or if there's an issue.

## How

Modified `ClustersTable.tsx` to display an `EmptyState` component when `sortedRows.length === 0` but `rows.length > 0`, indicating that clusters exist but none match the current filter criteria. The empty state shows a "No matching clusters" message with guidance to adjust search or filter criteria.

Fixes MGMT-21857
