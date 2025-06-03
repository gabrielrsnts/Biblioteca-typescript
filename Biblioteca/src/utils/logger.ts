export function logAction(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    const timestamp = new Date().toISOString();
    console.log(`[LOG - ${timestamp}] ${propertyKey} foi executado com argumentos:`, args);
    return originalMethod.apply(this, args);
  };
}
