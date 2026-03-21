export const filter = <T extends Record<string, any>>({
  data,
  conditions,
}: {
  data: T[];
  conditions: {
    field: string;
    operator: string;
    value: any;
    transform?: (value: any) => any;
  }[];
}): T[] => {
  return data.filter((item) => {
    return conditions.every((condition) => {
      const rawValue = item?.[condition.field];

      if (!rawValue) {
        return false;
      }
      const fieldValue = condition.transform
        ? condition.transform(rawValue)
        : rawValue;

      switch (condition.operator) {
        case 'equals':
          return fieldValue == condition.value;
        case 'greaterThan':
          return fieldValue > condition.value;
        case 'lessThan':
          return fieldValue < condition.value;
      }

      return false;
    });
  });
};
