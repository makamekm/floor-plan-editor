export const formatPrice = (price) => {
  return String(price || 0).split(/(?=(?:...)*$)/).join(" ") + " P";
};

export const formatTwoDigit = (value) => {
  const str = String(value);
  return str.length === 1 ? ("0" + str) : str;
};

export const formatTime = (date) => {
  return `${formatTwoDigit(date.getHours())}:${formatTwoDigit(date.getMinutes() + 1)}`;
};

export const formatDuration = (duration) => {
  const hours = Math.ceil(duration / 60);
  const monutes = duration % 60;
  return hours ? `${hours}ч ${monutes}м` : `${monutes}м`;
};

export const formatTransition = (length) => {
  const str = String(length);
  const lastDig = Number.parseInt(str[str.length - 1], 10);
  let result = `${str} пересад`;
  if (
    (length > 10 && length < 20)
    || [0, 5, 6, 7, 8, 9].indexOf(lastDig) >= 0
  ) {
    result += "ок";
  } else if (lastDig === 1) {
    result += "ка";
  } else {
    result += "ки";
  }
  return result;
};
