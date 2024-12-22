export function replaceParametersInString({
  template,
  parameters,
}: {
  template: string;
  parameters: Record<string, string>;
}): string {
  let result = template;

  Object.entries(parameters).forEach(([key, value]) => {
    const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    result = result.replace(regex, value);
  });

  return result;
}