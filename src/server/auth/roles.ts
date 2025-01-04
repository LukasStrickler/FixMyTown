import type { UserRole } from './config';

export const adminLevel: UserRole[] = ['admin']
export const workerLevel: UserRole[] = ['worker', 'admin']
export const userLevel: UserRole[] = ['user', 'worker', 'admin'] 