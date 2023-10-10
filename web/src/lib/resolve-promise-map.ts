export async function resolvePromiseMap<TMap extends { [key: string]: Promise<any> }>(
  map: TMap,
): Promise<{
  [K in keyof TMap]: TMap[K] extends Promise<infer U> ? U | null : never;
}> {
  return await Promise.all(
    Object.entries(map).map(async ([key, promise]) => [key, await promise] as const),
  ).then(Object.fromEntries);
}
