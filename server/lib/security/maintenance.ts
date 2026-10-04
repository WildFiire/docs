import { getPlatformSettings, updatePlatformSettings, PlatformSettings } from './settingsStore';

export interface MaintenanceConfig {
  enabled: boolean;
  message: string;
  allowedIps: string[];
  estimatedEndTime?: string;
  updatedAt: string;
  updatedBy: string;
}

export function getMaintenanceState(): MaintenanceConfig {
  const settings = getPlatformSettings();
  return {
    enabled: settings.maintenance.enabled,
    message: settings.maintenance.message,
    allowedIps: ['127.0.0.1', '::1'],
    estimatedEndTime: settings.maintenance.estimatedEndTime,
    updatedAt: settings.updatedAt,
    updatedBy: settings.updatedBy,
  };
}

export function setMaintenanceState(
  updates: Partial<MaintenanceConfig>,
  actor = 'admin',
): MaintenanceConfig {
  const settings = updatePlatformSettings(
    {
      maintenance: {
        enabled: updates.enabled,
        message: updates.message,
        estimatedEndTime: updates.estimatedEndTime,
      },
    },
    actor,
  );

  return {
    enabled: settings.maintenance.enabled,
    message: settings.maintenance.message,
    allowedIps: ['127.0.0.1', '::1'],
    estimatedEndTime: settings.maintenance.estimatedEndTime,
    updatedAt: settings.updatedAt,
    updatedBy: settings.updatedBy,
  };
}
