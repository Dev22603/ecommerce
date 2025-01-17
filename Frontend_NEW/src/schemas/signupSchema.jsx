import * as Yup from "yup";

export const signUpSchema = Yup.object({
	name: Yup.string().min(2).max(25).required("Please enter your name"),
	email: Yup.string().email().required("Please enter your email"),
	password: Yup.string()
		.min(8)
		.required("Please enter your password")
		.matches(/[0-9]/, "At least one digit (0-9)")
		.matches(/[a-z]/, "At least one lowercase")
		.matches(/[A-Z]/, "At least one uppercase")
		.matches(
			/[!@#$%^&*]/,
			"At least one special character (!, @, #, $, %, ^, &, or *)"
		),
	confirm_password: Yup.string()
		.required("Please enter Confirm Password")
		.oneOf(
			[Yup.ref("password"), null],
			"Confirm Password must match with Password"
		),
	terms_and_conditions: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});
