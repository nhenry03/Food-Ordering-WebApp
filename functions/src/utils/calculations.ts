export const calculateItemTotal = (
  fields: { price: number }[],
  basePrice: number,
  quantity: number
) => {
  const totalFields = fields.reduce((sum, field) => sum + field.price, 0);
  return (basePrice + totalFields) * quantity;
};


export const calculateOrderTotal = (
  lines: { value: { price: number }[], price: number, quantity: number }[]
) => {
  return lines.reduce((sum, line) => sum + calculateItemTotal(
    line.value,
    line.price,
    line.quantity
  ), 0 as number);
};
