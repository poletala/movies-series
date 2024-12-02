import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store'

export const userSelector = (state: RootState) => state
export const userNameSelector = createSelector(userSelector, (user) => user.user.name)