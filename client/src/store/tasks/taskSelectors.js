import { createSelector } from '@reduxjs/toolkit';

export const selectTaskGroups = createSelector(
  (state) => state.tasks.groups,
  (groups) => [...(groups || [])]
);