import bcryptjs from "bcryptjs";

const hashPassword = (password: string): Promise<string> => {
  const promise = new Promise<string>((resolve, reject) => {
    bcryptjs.genSalt(10, (err, salt) => {
      if (err) reject(new Error(err.message));
      bcryptjs.hash(password, salt, async (err, hash) => {
        if (err) reject(new Error(err.message));
        resolve(hash);
      });
    });
  });
  return promise;
};

export default hashPassword;
