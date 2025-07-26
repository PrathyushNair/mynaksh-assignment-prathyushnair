import Joi from "joi";
export async function validateSignUpDetails(userDetails: {
  name: string;
  email: string;
  password: string;
  birthdate: string;
}) {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .message("Invalid email format"),
    password: Joi.string()
      .pattern(
        new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$")
      )
      .message(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol"
      )
      .required(),
    birthdate: Joi.string()
      .pattern(
        new RegExp(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d\d$/)
      )
      .message("Invalid birthday format."),
  });
  try {
    const result = await schema.validateAsync(userDetails);
  } catch (err: any) {
    const error = new Error(err.message);
    (error as any).statusCode = 400;
    throw error;
  }
}
export async function validateLoginDeteils(loginDetails:{email:string,password:string}){
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .message("Invalid email format").required(),
    password: Joi.string()
      .pattern(
        new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$")
      )
      .message(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol"
      )
      .required()

  });
  try {
    const result = await schema.validateAsync(loginDetails);
  } catch (err: any) {
    const error = new Error(err.message);
    (error as any).statusCode = 400;
    throw error;
  }
}

