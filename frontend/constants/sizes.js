export const SPACES = (x) => {
  const obj = {
    xsm: 5,
    sm: 10,
    md: 15,
    lg: 20,
    xlg: 25,
    xxlg: 30,
    custom: x,
  };
  return obj;
};

export const SIZES = {
  xsm: "5%",
  sm: "10%",
  md: "20%",
  lg: "30%",
  half: "50%",
  full: "100%",
};

export const MARGINS = (x) => {
  const obj = {
    ...SPACES(),
    custom: x,
  };
  return obj;
};

export const PADDINGS = (x) => {
  const obj = {
    ...SPACES(),
    custom: x,
  };
  return obj;
};
