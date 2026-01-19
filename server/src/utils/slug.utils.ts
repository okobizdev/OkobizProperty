import crypto from 'crypto';

const generate4DigitNumber = (): string => {
  const num = crypto.randomInt(1000, 10000);
  return num.toString();
};

const SlugUtils = {
  generateSlug: (text: string): string => {
    const baseSlug = text
      .replace(/[।!?,./'"“”‘’`~@#$%^&*()_|+=<>[\]{}\\]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
    const randomDigits = generate4DigitNumber();
    console.log("rerffffff ", randomDigits)
    return `${baseSlug}-${randomDigits}`;
  },
};

export default SlugUtils;
