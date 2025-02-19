const regexPatterns = {
  // Vietnamese phone number patterns
  // Supports formats: +84xxxxxxxxx, 84xxxxxxxxx, 0xxxxxxxxx
  // Where x is a digit and the total length is 10-11 digits
  phoneVN: (phone) => {
    const pattern = /^(?:\+?84|0)(?:3[2-9]|5[2689]|7[06-9]|8[1-689]|9[0-9])[0-9]{7}$/;
    return pattern.test(phone);
  },

  // Email validation
  // Supports standard email format: username@domain.tld
  email: (email) => {
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  },

  // Vietnamese landline numbers
  // Supports formats: (xxx)xxxxxxx or xxx.xxxxxxx where x is a digit
  landlineVN: (phone) => {
    const pattern = /^(?:\(?\d{2,3}\)?[\s.-]?)?\d{7}$/;
    return pattern.test(phone);
  },

  // Basic URL validation
  url: (url) => {
    const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return pattern.test(url);
  },

  // Vietnamese postal code (5 digits)
  postalCodeVN: (code) => {
    const pattern = /^\d{5}$/;
    return pattern.test(code);
  },

  // Basic password strength check
  // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number
  password: (password) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return pattern.test(password);
  },

  // Vietnamese name validation
  // Allows Vietnamese characters, spaces, and basic Latin characters
  vietnameseName: (name) => {
    const pattern = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
    return pattern.test(name);
  },
  toRegex: (string) => {
    if (typeof string !== 'string') {
      throw new TypeError('Expected a string');
    }

    // Escape characters with special meaning either inside or outside character sets.
    // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
    return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
  }
};

module.exports = regexPatterns;
