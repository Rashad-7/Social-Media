export const validation = async(schema,arags) => {
  return (req, res, next) => {
      const validationResult = schema[key]?.validate(arags, { abortEarly: false });
      if (validationResult.error) {
      throw new Error(validationResult.error.toSrring()) 
      } 
return true
  };
}