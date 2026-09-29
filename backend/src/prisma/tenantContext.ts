import { AsyncLocalStorage } from "node:async_hooks";

const tenantStorage = new AsyncLocalStorage<string>();

export function runWithOrganization<T>(organizationId: string, callback: () => T): T {
  return tenantStorage.run(organizationId, callback);
}

export function getOrganizationId() {
  return tenantStorage.getStore();
}