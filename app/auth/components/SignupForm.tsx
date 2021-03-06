import signup from "app/auth/mutations/signup"
import { SignupInput } from "app/auth/validations"
import { Form, FORM_ERROR } from "app/components/Form"
import { LabeledTextField } from "app/components/LabeledTextField"
import { useMutation } from "blitz"
import React from "react"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)

  return (
    <div className="w-1/2">
      <Form
        submitText="Create Account"
        schema={SignupInput}
        initialValues={{ name: "", email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            await signupMutation(values)
            props.onSuccess?.()
          } catch (error) {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
              // This error comes from Prisma
              return { email: "This email is already being used" }
            } else {
              return { [FORM_ERROR]: error.toString() }
            }
          }
        }}
      >
        <LabeledTextField name="name" label="Name" placeholder="Name" />
        <LabeledTextField name="email" label="Email" placeholder="Email" />
        <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />
      </Form>
    </div>
  )
}

export default SignupForm
