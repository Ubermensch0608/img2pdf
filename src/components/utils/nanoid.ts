const a = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
export const nanoid = (e = 21) => {
  let result = "";
  const randomValues = crypto.getRandomValues(new Uint8Array(e));
  for (let i = 0; i < e; i++) result += a[63 & randomValues[i]];
  return result;
};
