export type AdminRole = 'reviewer' | 'governance_admin' | 'brand_operator' | 'analyst' | 'sysadmin';

export type AdminAction = 
  | 'PUBLISH_OBJECT'
  | 'EDIT_SHARED_TEMPLATE'
  | 'READ_ALL'
  | 'WRITE_OBJECT'
  | 'OVERRIDE_BLOCK'
  | 'APPROVE_REVIEW';

const ROLE_PERMISSIONS: Record<AdminRole, AdminAction[]> = {
  sysadmin: ['PUBLISH_OBJECT', 'EDIT_SHARED_TEMPLATE', 'READ_ALL', 'WRITE_OBJECT', 'OVERRIDE_BLOCK', 'APPROVE_REVIEW'],
  governance_admin: ['PUBLISH_OBJECT', 'EDIT_SHARED_TEMPLATE', 'READ_ALL', 'WRITE_OBJECT', 'OVERRIDE_BLOCK', 'APPROVE_REVIEW'],
  reviewer: ['READ_ALL', 'APPROVE_REVIEW'], // Cannot PUBLISH_OBJECT directly
  brand_operator: ['READ_ALL', 'WRITE_OBJECT'], // Cannot EDIT_SHARED_TEMPLATE
  analyst: ['READ_ALL'] // Read-only
};

export class RBACGuard {
  static checkPermission(role: string | null | undefined, action: AdminAction): boolean {
    if (!role) return false;
    
    // Default fallback to safe role if invalid cast
    const adminRole = role as AdminRole;
    const permissions = ROLE_PERMISSIONS[adminRole] || [];
    
    return permissions.includes(action);
  }

  static requirePermission(role: string | null | undefined, action: AdminAction): void {
    if (!this.checkPermission(role, action)) {
      throw new Error(`FORBIDDEN: Role ${role} cannot perform ${action}`);
    }
  }
}
