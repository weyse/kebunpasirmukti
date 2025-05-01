
export type CalendarPermission = 'view' | 'edit' | 'admin';

export interface CalendarUserAccess {
  userId: string;
  permission: CalendarPermission;
  name?: string;
}
